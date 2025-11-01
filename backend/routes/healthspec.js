const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const githubService = require('../services/github');
const openaiService = require('../services/openai');

router.post('/health/spec', async (req, res) => {
  const { repoUrl } = req.body || {};
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });
  let repoPath;
  try {
    repoPath = await githubService.cloneRepository(repoUrl);
    const reasons = [];
    let port = 3000;
    let pathGuess = '/health';
    const files = await fs.readdir(repoPath);
    const tree = files.join('\n');
    if (tree.includes('next.config') || files.includes('next.config.js')) { port = 3000; pathGuess = '/'; reasons.push('Next.js detected'); }
    const serverJs = await tryRead(path.join(repoPath, 'server.js'));
    if (serverJs && serverJs.includes("app.get('/health'")) { pathGuess = '/health'; reasons.push('Express health route'); }
    // If still unknown, ask AI
    let inferred = reasons.length > 0;
    if (!inferred) {
      const proposal = await openaiService.chat(null, [
        { role: 'system', content: 'Infer health endpoint for this repo. Return JSON { port, path }' },
        { role: 'user', content: `Files: ${tree}` }
      ]);
      try { const json = JSON.parse(proposal); if (json.port) port = json.port; if (json.path) pathGuess = json.path; inferred = true; reasons.push('AI-assisted'); } catch {}
    }
    const health = { port, liveness: { path: pathGuess, expect: 200 }, readiness: { path: '/', expect: 200 }, timeoutSeconds: 60 };
    res.json({ health, inferred, reasons });
  } catch (e) {
    res.status(500).json({ error: 'Health spec failed', details: e.message });
  } finally {
    if (repoPath) githubService.cleanupRepository(repoPath).catch(()=>{});
  }
});

async function tryRead(p) { try { return await fs.readFile(p, 'utf8'); } catch { return null; } }

module.exports = router;

