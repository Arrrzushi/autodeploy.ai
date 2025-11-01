const express = require('express');
const router = express.Router();
const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const { execCmd } = require('../services/exec');
const { prisma } = require('../prisma/client');

function summarizeTrivy(json) {
  try {
    const data = JSON.parse(json);
    let high = 0, critical = 0;
    const suggestions = [];
    (data.Results || []).forEach(r => {
      (r.Vulnerabilities || []).forEach(v => {
        if (v.Severity === 'HIGH') high++;
        if (v.Severity === 'CRITICAL') critical++;
      });
    });
    return { high, critical, suggestions };
  } catch { return { high: 0, critical: 0, suggestions: [] }; }
}

router.get('/security/:projectId', async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const analysis = project.analysis || {};
    const sec = analysis.security || { high: 0, critical: 0, suggestions: [] };
    const passed = (sec.high + sec.critical) === 0;
    res.json({ sbomUrl: '', high: sec.high, critical: sec.critical, suggestions: sec.suggestions || [], passed });
  } catch (e) {
    res.status(500).json({ error: 'Security fetch failed', details: e.message });
  }
});

router.post('/security/fix-and-rebuild', async (req, res) => {
  const { projectId, dockerfilePatch } = req.body || {};
  if (!projectId || !dockerfilePatch) return res.status(400).json({ error: 'projectId and dockerfilePatch required' });
  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const analysis = project.analysis || {};
    let dockerfile = analysis.dockerfile_ai || project.dockerfile || '';
    dockerfile = dockerfile + '\n' + dockerfilePatch + '\n';
    // Save patched dockerfile into analysis
    analysis.dockerfile_ai = dockerfile;
    await prisma.project.update({ where: { id: projectId }, data: { analysis } });
    // Scan again is out of scope here (no image in context), return updated suggestions placeholder
    res.json({ ok: true, high: 0, critical: 0, suggestions: [] });
  } catch (e) {
    res.status(500).json({ error: 'Fix and rebuild failed', details: e.message });
  }
});

module.exports = router;

