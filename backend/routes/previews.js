const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const { execCmd, dockerRunDetached, dockerInspect, dockerStopRm, dockerBuild } = require('../services/exec');
const githubService = require('../services/github');
const { prisma } = require('../prisma/client');

function ttlToDate(hours) {
  const ms = (hours || parseInt(process.env.PREVIEW_TTL_HOURS || '72', 10)) * 3600 * 1000;
  return new Date(Date.now() + ms).toISOString();
}

router.post('/previews/create', async (req, res) => {
  const { repoUrl, prRef, env = {}, projectId, ttlHours, runMigrations } = req.body || {};
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
  const previewId = crypto.randomUUID().slice(0, 8);
  const appName = `preview-app-${previewId}`;
  const dbName = `preview-db-${previewId}`;
  let repoPath;
  try {
    // Start temp Postgres
    const dbRun = await execCmd(`docker run -d -e POSTGRES_USER=preview -e POSTGRES_PASSWORD=preview -e POSTGRES_DB=app -p :5432 --name ${dbName} --label autodeploy.previewId=${previewId} postgres:16-alpine`);
    if (dbRun.code !== 0) return res.status(500).json({ error: 'Failed to start preview DB', details: dbRun.stderr });
    const dbInspect = await dockerInspect(dbName);
    const dbPort = parseInt(Object.values(dbInspect.NetworkSettings.Ports)[0][0].HostPort, 10);
    const dbUrl = `postgresql://preview:preview@localhost:${dbPort}/app`;

    // Clone repo
    repoPath = await githubService.cloneRepository(repoUrl);
    // Optional branch/PR
    if (prRef) await execCmd(`git fetch origin ${prRef} && git checkout FETCH_HEAD`, { cwd: repoPath });

    // Run prisma migrate deploy if requested
    if (runMigrations) {
      const mig = await execCmd(`npx prisma migrate deploy`, { cwd: repoPath, env: { ...process.env, DATABASE_URL: dbUrl } });
      if (mig.code !== 0) {
        await dockerStopRm(dbName);
        return res.status(400).json({ error: 'Migration failed', stdout: mig.stdout, stderr: mig.stderr });
      }
    }

    // Build image (use Dockerfile if present)
    const imageTag = `autodeploy-preview:${previewId}`;
    await dockerBuild(imageTag, repoPath);

    // Run app container
    const runEnv = { DATABASE_URL: dbUrl, ...env };
    const run = await dockerRunDetached(appName, imageTag, { container: 3000 }, runEnv, { 'autodeploy.previewId': previewId });
    if (run.code !== 0) return res.status(500).json({ error: 'Failed to start app', details: run.stderr });
    const appInspect = await dockerInspect(appName);
    const appPort = parseInt(Object.values(appInspect.NetworkSettings.Ports)[0][0].HostPort, 10);
    const url = `http://localhost:${appPort}`;

    // Persist deployment row
    if (projectId) {
      await prisma.deployment.create({ data: { id: previewId, projectId, containerUrl: url, nodeLocation: 'local-preview', containerId: appInspect.Id.substring(0,12), status: 'running' } });
    }

    res.json({ previewId, url, dbUrl, expires_at: ttlToDate(ttlHours), logsUrl: `/api/logs/${previewId}` });
  } catch (e) {
    try { await dockerStopRm(appName); } catch {}
    try { await dockerStopRm(dbName); } catch {}
    res.status(500).json({ error: 'Preview creation failed', details: e.message });
  } finally {
    if (repoPath) githubService.cleanupRepository(repoPath).catch(()=>{});
  }
});

router.post('/previews/destroy/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dockerStopRm(`preview-app-${id}`);
    await dockerStopRm(`preview-db-${id}`);
    await prisma.deployment.deleteMany({ where: { id } }).catch(()=>{});
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Destroy failed', details: e.message });
  }
});

module.exports = router;
