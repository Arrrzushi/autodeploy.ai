const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma/client');
const crypto = require('crypto');
const nodeopsService = require('../services/nodeops');

const hasDB = !!process.env.DATABASE_URL;

/**
 * POST /api/deploy
 * Deploys a containerized application to NodeOps
 */
router.post('/deploy', async (req, res) => {
  try {
    const { projectId, dockerfile, projectName } = req.body;

    if (!projectId || !dockerfile) {
      return res.status(400).json({ 
        error: 'Project ID and Dockerfile are required' 
      });
    }

    console.log(`Deploying project: ${projectId}`);

    // Verify project exists only when DB is configured
    if (hasDB) {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
    }

    // Create a deployment ID to align DB and runtime state
    const deploymentId = crypto.randomUUID();

    // Deploy to NodeOps
    const deployment = await nodeopsService.deployContainer(
      dockerfile,
      projectName || 'app',
      deploymentId
    );

    // Save deployment to database if available
    let dbDeployment = { id: deploymentId, ...deployment };
    if (hasDB) {
      dbDeployment = await prisma.deployment.create({
        data: {
          id: deploymentId,
          projectId,
          containerUrl: deployment.containerUrl,
          nodeLocation: deployment.nodeLocation,
          containerId: deployment.containerId,
          status: deployment.status
        }
      });
    }

    // Initialize logs and metrics with the database deployment ID
    nodeopsService.initializeLogs(dbDeployment.id, projectName || 'app');
    nodeopsService.initializeMetrics(dbDeployment.id);

    res.json({
      deploymentId: dbDeployment.id,
      ...deployment
    });
  } catch (error) {
    console.error('Error deploying project:', error);
    res.status(500).json({ 
      error: 'Failed to deploy project',
      details: error.message 
    });
  }
});

/**
 * GET /api/deployments/:id
 * Retrieves deployment details
 */
router.get('/deployments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let deployment;
    if (hasDB) {
      deployment = await prisma.deployment.findUnique({
        where: { id },
        include: { project: true }
      });
    } else {
      const runtime = nodeopsService.getDeployment(id);
      deployment = runtime ? { id, ...runtime } : null;
    }

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.json(deployment);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    res.status(500).json({ 
      error: 'Failed to fetch deployment',
      details: error.message 
    });
  }
});

/**
 * GET /api/deployments
 * Lists all deployments
 */
router.get('/deployments', async (req, res) => {
  try {
    let deployments = [];
    if (hasDB) {
      deployments = await prisma.deployment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          project: {
            select: { id: true, repoUrl: true, createdAt: true }
          }
        }
      });
    }

    res.json(deployments);
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch deployments',
      details: error.message 
    });
  }
});

/**
 * POST /api/deployments/:id/stop
 * Stops a running deployment
 */
router.post('/deployments/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = hasDB
      ? await prisma.deployment.findUnique({ where: { id } })
      : (nodeopsService.getDeployment(id) ? { id } : null);

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Stop deployment in NodeOps
    await nodeopsService.stopDeployment(id);

    // Update database if available
    if (hasDB) {
      await prisma.deployment.update({
        where: { id },
        data: { status: 'stopped' }
      });
    }

    res.json({ message: 'Deployment stopped successfully' });
  } catch (error) {
    console.error('Error stopping deployment:', error);
    res.status(500).json({ 
      error: 'Failed to stop deployment',
      details: error.message 
    });
  }
});

module.exports = router;
