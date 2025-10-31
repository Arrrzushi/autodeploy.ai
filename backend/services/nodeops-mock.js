/**
 * Mock NodeOps API Service
 * Simulates deployment to NodeOps infrastructure
 */

const deploymentStore = new Map();
const logsStore = new Map();
const metricsStore = new Map();

/**
 * Generates a random container ID
 */
function generateContainerId() {
  return Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Generates a random node location
 */
function generateNodeLocation() {
  const locations = [
    'US-East-1 (Virginia)',
    'US-West-2 (Oregon)',
    'EU-West-1 (Ireland)',
    'EU-Central-1 (Frankfurt)',
    'AP-Southeast-1 (Singapore)',
    'AP-Northeast-1 (Tokyo)'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Simulates container deployment
 */
async function deployContainer(dockerfile, projectName, projectId) {
  return new Promise((resolve) => {
    // Simulate deployment delay (3-5 seconds)
    const delay = 3000 + Math.random() * 2000;

    setTimeout(() => {
      const containerId = generateContainerId();
      const nodeLocation = generateNodeLocation();
      const deploymentId = `deploy-${Date.now()}`;
      
      // Generate deployment URL
      const subdomain = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 20);
      const containerUrl = `https://${subdomain}-${containerId.substring(0, 8)}.nodeops.network`;

      const deployment = {
        id: deploymentId,
        containerId,
        containerUrl,
        nodeLocation,
        status: 'running',
        createdAt: new Date(),
        dockerfile
      };

      deploymentStore.set(deploymentId, deployment);
      
      // Initialize logs
      initializeLogs(deploymentId, projectName);
      
      // Initialize metrics
      initializeMetrics(deploymentId);

      resolve(deployment);
    }, delay);
  });
}

/**
 * Initializes simulated logs for a deployment (exported)
 */
function initializeLogs(deploymentId, projectName) {
  // Check if logs already exist
  if (logsStore.has(deploymentId)) {
    return logsStore.get(deploymentId);
  }

  const logs = [
    { timestamp: new Date(), level: 'info', message: `[NodeOps] Starting deployment for ${projectName}` },
    { timestamp: new Date(Date.now() + 1000), level: 'info', message: '[Docker] Building image from Dockerfile...' },
    { timestamp: new Date(Date.now() + 2000), level: 'info', message: '[Docker] Step 1/8 : FROM node:18-alpine' },
    { timestamp: new Date(Date.now() + 3000), level: 'info', message: '[Docker] Successfully built image' },
    { timestamp: new Date(Date.now() + 4000), level: 'info', message: '[NodeOps] Pushing image to registry...' },
    { timestamp: new Date(Date.now() + 5000), level: 'info', message: '[NodeOps] Image pushed successfully' },
    { timestamp: new Date(Date.now() + 6000), level: 'info', message: '[NodeOps] Allocating compute resources...' },
    { timestamp: new Date(Date.now() + 7000), level: 'info', message: '[NodeOps] Container starting on distributed node...' },
    { timestamp: new Date(Date.now() + 8000), level: 'info', message: '[App] Server started on port 3000' },
    { timestamp: new Date(Date.now() + 9000), level: 'info', message: '[Health] Health check passed' },
    { timestamp: new Date(Date.now() + 10000), level: 'success', message: '[NodeOps] Deployment successful! Container is now running.' }
  ];

  logsStore.set(deploymentId, logs);
}

/**
 * Initializes metrics for a deployment (exported)
 */
function initializeMetrics(deploymentId) {
  // Check if metrics already exist
  if (metricsStore.has(deploymentId)) {
    return metricsStore.get(deploymentId);
  }

  const metrics = {
    startTime: Date.now(),
    cpu: 0,
    memory: 0,
    network: { in: 0, out: 0 },
    requests: 0
  };

  metricsStore.set(deploymentId, metrics);
  return metrics;
}

/**
 * Retrieves deployment logs
 */
function getLogs(deploymentId, since = 0) {
  const logs = logsStore.get(deploymentId) || [];
  
  // Add some dynamic logs
  if (logs.length > 0) {
    const lastLog = logs[logs.length - 1];
    const timeSinceLastLog = Date.now() - lastLog.timestamp.getTime();
    
    // Add new logs every 30 seconds
    if (timeSinceLastLog > 30000) {
      const newLogs = [
        { timestamp: new Date(), level: 'info', message: `[App] Handled request - 200 OK` },
        { timestamp: new Date(Date.now() + 1000), level: 'info', message: `[Health] Health check passed` }
      ];
      logs.push(...newLogs);
    }
  }

  // Filter logs by timestamp if 'since' is provided
  return logs.filter(log => log.timestamp.getTime() >= since);
}

/**
 * Retrieves deployment metrics
 */
function getMetrics(deploymentId) {
  const deployment = deploymentStore.get(deploymentId);
  if (!deployment) {
    return null;
  }

  const metrics = metricsStore.get(deploymentId);
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);

  // Simulate realistic metrics with some variation
  return {
    uptime,
    cpu: (15 + Math.random() * 10).toFixed(2) + '%',
    memory: (128 + Math.random() * 64).toFixed(0) + 'MB',
    memoryPercent: (25 + Math.random() * 15).toFixed(2) + '%',
    network: {
      in: (metrics.network.in + Math.random() * 1024).toFixed(0) + 'KB',
      out: (metrics.network.out + Math.random() * 2048).toFixed(0) + 'KB'
    },
    requests: Math.floor(metrics.requests + Math.random() * 10),
    status: 'healthy',
    nodeLocation: deployment.nodeLocation,
    containerId: deployment.containerId
  };
}

/**
 * Gets deployment information
 */
function getDeployment(deploymentId) {
  return deploymentStore.get(deploymentId) || null;
}

/**
 * Stops a deployment
 */
async function stopDeployment(deploymentId) {
  const deployment = deploymentStore.get(deploymentId);
  if (deployment) {
    deployment.status = 'stopped';
    
    // Add stop log
    const logs = logsStore.get(deploymentId) || [];
    logs.push({
      timestamp: new Date(),
      level: 'warning',
      message: '[NodeOps] Container stopped by user'
    });
    
    return true;
  }
  return false;
}

/**
 * Simulates streaming logs (for WebSocket or SSE)
 */
function* streamLogs(deploymentId) {
  const logs = getLogs(deploymentId);
  for (const log of logs) {
    yield log;
  }
}

module.exports = {
  deployContainer,
  getLogs,
  getMetrics,
  getDeployment,
  stopDeployment,
  streamLogs,
  initializeLogs,
  initializeMetrics
};


