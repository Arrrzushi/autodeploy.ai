const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma/client');
const nodeopsService = require('../services/nodeops');

const hasDB = !!process.env.DATABASE_URL;

/**
 * GET /api/logs/:deploymentId
 * Retrieves container logs for a deployment
 */
router.get('/logs/:deploymentId', async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const { since } = req.query;

    // Check if deployment exists
    let deployment;
    if (hasDB) {
      deployment = await prisma.deployment.findUnique({
        where: { id: deploymentId },
        include: { project: true }
      });
    } else {
      const runtime = nodeopsService.getDeployment(deploymentId);
      deployment = runtime ? { id: deploymentId, project: null } : null;
    }

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    let logs = nodeopsService.getLogs(
      deploymentId,
      since ? parseInt(since) : 0
    );

    // If no logs exist, initialize them
    if (!logs || logs.length === 0) {
      const projectName = deployment.project?.repoUrl?.split('/').pop() || 'app';
      nodeopsService.initializeLogs(deploymentId, projectName);
      logs = nodeopsService.getLogs(deploymentId, since ? parseInt(since) : 0);
    }

    res.json({
      deploymentId,
      logs,
      count: logs.length,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch logs',
      details: error.message 
    });
  }
});

/**
 * GET /api/health/:deploymentId
 * Retrieves container health and metrics
 */
router.get('/health/:deploymentId', async (req, res) => {
  try {
    const { deploymentId } = req.params;

    let deployment;
    if (hasDB) {
      deployment = await prisma.deployment.findUnique({ where: { id: deploymentId } });
    } else {
      deployment = nodeopsService.getDeployment(deploymentId);
    }

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Use the deployment ID to get metrics from runtime service
    const metrics = nodeopsService.getMetrics(deploymentId);

    if (!metrics) {
      // If metrics don't exist yet, create them
      nodeopsService.initializeMetrics(deploymentId);
      const newMetrics = nodeopsService.getMetrics(deploymentId);
      
      return res.json({
        deploymentId,
        ...newMetrics,
        nodeLocation: deployment.nodeLocation,
        containerId: deployment.containerId,
        timestamp: Date.now()
      });
    }

    res.json({
      deploymentId,
      ...metrics,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch health metrics',
      details: error.message 
    });
  }
});

/**
 * GET /api/metrics/:deploymentId
 * Detailed metrics endpoint
 */
router.get('/metrics/:deploymentId', async (req, res) => {
  try {
    const { deploymentId } = req.params;

    const deployment = nodeopsService.getDeployment(deploymentId);
    
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    const metrics = nodeopsService.getMetrics(deploymentId);

    res.json({
      deploymentId,
      containerUrl: deployment.containerUrl,
      containerId: deployment.containerId,
      status: deployment.status,
      metrics,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch metrics',
      details: error.message 
    });
  }
});

module.exports = router;
