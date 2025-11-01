const express = require('express');
const router = express.Router();

const PLANS = [
  { id: 'nano', vcpu: 0.25, ramGb: 0.5, region: 'us-east-1', hourlyUsd: 0.005 },
  { id: 'micro', vcpu: 0.5, ramGb: 1, region: 'us-east-1', hourlyUsd: 0.01 },
  { id: 'small', vcpu: 1, ramGb: 2, region: 'us-east-1', hourlyUsd: 0.02 },
  { id: 'medium', vcpu: 2, ramGb: 4, region: 'us-west-2', hourlyUsd: 0.04 },
];

router.get('/nodeops/plans', (req, res) => {
  res.json(PLANS);
});

router.post('/deploy/nodeops', async (req, res) => {
  const { projectId, planId, region, health } = req.body || {};
  if (!projectId || !planId) return res.status(400).json({ error: 'projectId and planId required' });
  const plan = PLANS.find(p => p.id === planId) || PLANS[0];
  // Placeholder integration: return fake panel and echo existing endpoints
  const crypto = require('crypto');
  const deploymentId = crypto.randomUUID();
  const nodeEndpointUrl = 'http://localhost';
  const panelUrl = `https://panel.nodeops.network/deployments/${deploymentId}`;
  res.json({ deploymentId, nodeEndpointUrl, panelUrl });
});

module.exports = router;

