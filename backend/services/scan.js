const path = require('path');
const fs = require('fs').promises;
const { execCmd } = require('./exec');

async function runSbom(image, outDir) {
  const sbomPath = path.join(outDir, 'sbom.spdx.json');
  const cmd = `syft ${image} -o spdx-json > "${sbomPath}"`;
  const { code, stdout, stderr } = await execCmd(cmd);
  return { ok: code === 0, sbomPath, stdout, stderr };
}

async function runTrivy(image, outDir) {
  const cvePath = path.join(outDir, 'cves.json');
  const cmd = `trivy image --scanners vuln --severity HIGH,CRITICAL --format json ${image} > "${cvePath}"`;
  const { code, stdout, stderr } = await execCmd(cmd);
  return { ok: code === 0, cvePath, stdout, stderr };
}

function parseTrivyJson(json) {
  const res = { high: 0, critical: 0, suggestions: [] };
  if (!json?.Results) return res;
  for (const r of json.Results) {
    for (const v of (r.Vulnerabilities || [])) {
      if (v.Severity === 'HIGH') res.high++;
      if (v.Severity === 'CRITICAL') res.critical++;
    }
  }
  return res;
}

async function suggestBaseImageDigest(imageRef = 'node:18-alpine') {
  // Placeholder suggestion; can be enhanced by docker inspect to fetch the digest
  return `FROM ${imageRef}@sha256:<DIGEST>`;
}

module.exports = { runSbom, runTrivy, parseTrivyJson, suggestBaseImageDigest };

