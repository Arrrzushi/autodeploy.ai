const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const crypto = require('crypto');
const { execCmd, dockerBuild, dockerRunDetached, dockerInspect, dockerStopRm } = require('../services/exec');
const githubService = require('../services/github');
const openaiService = require('../services/openai');
const { prisma } = require('../prisma/client');
const { runSbom, runTrivy, parseTrivyJson, suggestBaseImageDigest } = require('../services/scan');
const { ensureHealthcheck, patchDockerfileForNode } = require('../services/dockerfile');

const PREFLIGHT_PORTS = (process.env.PREFLIGHT_PORTS || '3000,5173,8080,8000,5000')
  .split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean);

function parsePort(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function uniquePorts(values) {
  const seen = new Set();
  const result = [];
  for (const val of values) {
    const n = parsePort(val);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    result.push(n);
  }
  return result;
}

function parseDockerfilePorts(text) {
  if (!text) return [];
  const ports = [];
  const exposeRe = /^\s*EXPOSE\s+(.+)$/gmi;
  let match;
  while ((match = exposeRe.exec(text))) {
    const parts = match[1].trim().split(/\s+/);
    for (const part of parts) {
      const partNum = parsePort(part);
      if (partNum) ports.push(partNum);
    }
  }
  const envMatch = text.match(/^\s*ENV\s+PORT\s*=?\s*(\d+)/mi);
  if (envMatch) {
    const envPort = parsePort(envMatch[1]);
    if (envPort) ports.unshift(envPort);
  }
  return ports;
}

async function waitForHttp(host, port, paths = ['/', '/health', '/status'], timeoutMs = 60000) {
  const start = Date.now();
  const http = require('http');
  while (Date.now() - start < timeoutMs) {
    for (const p of paths) {
      try {
        const status = await new Promise((resolve, reject) => {
          const req = http.get({ hostname: host, port, path: p, timeout: 3000 }, (res) => {
            res.resume();
            resolve(res.statusCode || 0);
          });
          req.on('error', reject);
          req.setTimeout(3000, () => { req.destroy(new Error('timeout')); });
        });
        if (status === 200 || status === 204) return { ok: true, status, path: p };
      } catch (_) {}
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return { ok: false, status: 0, path: '/' };
}

async function preflightBuild(repoDir, imageTag, preferredPort, hostPort) {
  const logs = [];
  const preferred = parsePort(preferredPort);
  const envPort = parsePort(process.env.PORT);
  const basePorts = uniquePorts([preferred, envPort, 3000, ...PREFLIGHT_PORTS]);
  const ports = basePorts.length > 0 ? basePorts : [3000];
  const structure = await githubService.analyzeStructure(repoDir).catch(() => null);

  // Strategy 1: Nixpacks
  const nixCmd = `npx nixpacks build -o ${imageTag}`;
  let res = await execCmd(nixCmd, { cwd: repoDir });
  logs.push(`--- nixpacks ---\n${res.stdout}\n${res.stderr}`);
  if (res.code === 0) {
    const smoke = await smokeTest(imageTag, ports, hostPort);
    if (smoke.ok) return { strategy: 'nixpacks', image: imageTag, logs: logs.join('\n\n'), smoke };
  }

  // Strategy 2: Buildpacks
  const packCmd = `pack build ${imageTag} --builder paketobuildpacks/builder-jammy-base`;
  res = await execCmd(packCmd, { cwd: repoDir });
  logs.push(`--- buildpacks ---\n${res.stdout}\n${res.stderr}`);
  if (res.code === 0) {
    const smoke = await smokeTest(imageTag, ports, hostPort);
    if (smoke.ok) return { strategy: 'buildpacks', image: imageTag, logs: logs.join('\n\n'), smoke };
  }

  // Strategy 3: Existing Dockerfiles
  const dockerfilePaths = (structure?.files || [])
    .filter(f => /(^|\/)Dockerfile$/i.test(f))
    .sort((a, b) => a.length - b.length);

  for (const relPath of dockerfilePaths) {
    try {
      const fullPath = path.join(repoDir, relPath);
      const contextDir = path.dirname(fullPath);
      const dockerfileName = path.basename(fullPath);
      const dockerfileText = await fs.readFile(fullPath, 'utf8');
      const buildCmd = dockerfileName === 'Dockerfile'
        ? `docker build -t ${imageTag} .`
        : `docker build -t ${imageTag} -f ${dockerfileName} .`;
      const buildRes = await execCmd(buildCmd, { cwd: contextDir });
      logs.push(`--- dockerfile:${relPath} ---\n${buildRes.stdout}\n${buildRes.stderr}`);
      if (buildRes.code !== 0) continue;

      const dfPorts = uniquePorts([...parseDockerfilePorts(dockerfileText), ...ports]);
      const candidatePorts = dfPorts.length > 0 ? dfPorts : ports;
      const smoke = await smokeTest(imageTag, candidatePorts, hostPort);
      if (smoke.ok) {
        return {
          strategy: `dockerfile:${relPath}`,
          image: imageTag,
          logs: logs.join('\n\n'),
          smoke,
          artifacts: { dockerfilePath: relPath }
        };
      }
    } catch (err) {
      logs.push(`--- dockerfile:${relPath} (error) ---\n${err?.message || err}`);
    }
  }

  // Strategy 4: AI Dockerfile
  // Try to infer structure minimally
  const fallbackStructure = structure || { files: [], language: null, framework: null, dependencies: [], hasDockerfile: false, fileCount: 0, directories: [] };
  let dockerfile = await openaiService.generateDockerfile({ language: 'Unknown', framework: 'Unknown', dependencies: [] }, fallbackStructure);
  const portUse = ports[0] || 3000;
  // Patch for Node apps: ensure real start command and port
  dockerfile = patchDockerfileForNode(repoDir, dockerfile, portUse);
  // Ensure HEALTHCHECK baked in (idempotent)
  dockerfile = ensureHealthcheck(dockerfile, portUse, '/health');
  await fs.writeFile(path.join(repoDir, 'Dockerfile'), dockerfile);
  const buildRes = await dockerBuild(imageTag, repoDir);
  logs.push(`--- ai-dockerfile build ---\n${buildRes.stdout}\n${buildRes.stderr}`);
  const smoke = buildRes.code === 0 ? await smokeTest(imageTag, ports, hostPort) : { ok: false, port: ports[0], path: '/', status: 0, logs: buildRes.stderr };
  return { strategy: 'ai', image: imageTag, logs: logs.join('\n\n'), smoke, artifacts: { dockerfile } };
}

async function smokeTest(imageTag, ports, hostPort) {
  const id = crypto.randomUUID().slice(0, 8);
  const name = `preflight-${id}`;
  let chosen = ports[0] || 3000;
  let inspect, stdout = '', stderr = '';
  try {
    for (const portCandidate of ports) {
      chosen = portCandidate;
      const run = await dockerRunDetached(name, imageTag, { containerPort: portCandidate, hostPort }, {}, {});
      stdout += run.stdout; stderr += run.stderr;
      if (run.code !== 0) continue;
      // inspect port
      inspect = await dockerInspect(name);
      const hostPort = Object.values((inspect?.NetworkSettings?.Ports || {}))[0]?.[0]?.HostPort;
      if (!hostPort) throw new Error('no host port');
      const probe = await waitForHttp('127.0.0.1', parseInt(hostPort, 10), ['/', '/health', '/status']);
      await dockerStopRm(name);
      return { ok: probe.ok, port: parseInt(hostPort, 10), path: probe.path, status: probe.status, logs: `${stdout}\n${stderr}` };
    }
  } catch (e) {
    try { await dockerStopRm(name); } catch {}
    return { ok: false, port: chosen, path: '/', status: 0, logs: `${stdout}\n${stderr}\n${e.message}` };
  }
  try { await dockerStopRm(name); } catch {}
  return { ok: false, port: chosen, path: '/', status: 0, logs: `${stdout}\n${stderr}` };
}

router.post('/build/preflight', async (req, res) => {
  const { repoUrl, branch, preferredPort, projectId, hostPort } = req.body || {};
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
  const normalizedRepoUrl = githubService.normalizeRepoUrl(repoUrl);
  if (!normalizedRepoUrl) return res.status(400).json({ error: 'Invalid repoUrl format' });
  let repoPath;
  try {
    repoPath = await githubService.cloneRepository(normalizedRepoUrl);
    const imageTag = `autodeploy-preflight:${crypto.randomUUID().slice(0,8)}`;
    const result = await preflightBuild(repoPath, imageTag, preferredPort, hostPort);
    // Security scans (best-effort)
    let security = { high: 0, critical: 0, suggestions: [] };
    try {
      const outDir = os.tmpdir();
      const sbom = await runSbom(result.image, outDir);
      const trivy = await runTrivy(result.image, outDir);
      try {
        const cvesJson = JSON.parse(await fs.readFile(trivy.cvePath, 'utf8'));
        security = parseTrivyJson(cvesJson);
        if (security.high + security.critical > 0) {
          const suggestion = await suggestBaseImageDigest('node:18-alpine');
          security.suggestions.push(`Pin base image digest: ${suggestion}`);
        }
      } catch {}
    } catch {}

    if (projectId) {
      // persist artifacts into project.analysis
      try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (project) {
          const analysis = project.analysis || {};
          analysis.lastImage = result.image;
          analysis.buildLogs = [...(analysis.buildLogs || []), { strategy: result.strategy, logs: result.logs }];
          if (result.artifacts?.dockerfile) analysis.dockerfile_ai = result.artifacts.dockerfile;
          if (security) analysis.security = security;
          await prisma.project.update({ where: { id: projectId }, data: { analysis } });
        }
      } catch {}
    }
    res.json({ build: { strategy: result.strategy, image: result.image, logs: result.logs }, smoke: result.smoke, artifacts: result.artifacts });
  } catch (e) {
    res.status(500).json({ error: 'Preflight failed', details: e.message });
  } finally {
    if (repoPath) githubService.cleanupRepository(repoPath).catch(()=>{});
  }
});

module.exports = router;

