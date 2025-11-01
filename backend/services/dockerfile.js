const fs = require('fs');
const path = require('path');

function ensureHealthcheck(dockerfileText, port, healthPath = '/health') {
  try {
    if (/HEALTHCHECK/i.test(dockerfileText || '')) return dockerfileText;
  } catch {}
  // Single-line to avoid continuation issues on Windows
  const line = `HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget -qO- http://localhost:${port}${healthPath} || exit 1`;
  return (dockerfileText || '').trimEnd() + '\n' + line + '\n';
}

function patchDockerfileForNode(repoDir, dockerfileText, port = 3000) {
  const pkgPath = path.join(repoDir, 'package.json');
  let pkg = null;
  if (fs.existsSync(pkgPath)) {
    try { pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')); } catch {}
  }

  const fallbackEntry = ['server.js', 'app.js', 'index.js', 'main.js']
    .map(name => ({ name, exists: fs.existsSync(path.join(repoDir, name)) }))
    .find(entry => entry.exists);

  let startCmd = null;
  if (pkg?.scripts?.start) {
    startCmd = ['npm', 'start'];
  } else if (typeof pkg?.main === 'string' && pkg.main.trim()) {
    startCmd = ['node', pkg.main.trim().replace(/\\/g, '/')];
  } else if (fallbackEntry) {
    startCmd = ['node', fallbackEntry.name];
  }
  if (!startCmd && pkg) {
    startCmd = ['npm', 'start'];
  }

  const isLikelyNode = Boolean(pkg || fallbackEntry);
  if (!isLikelyNode) {
    return dockerfileText;
  }

  const hasCmd = /^\s*CMD\s+/mi.test(dockerfileText || '');
  const usesNodeBase = /\bFROM\s+node(?::|@|\s)/i.test(dockerfileText || '');
  const placeholderCmd = /(your_command_here|YOUR_COMMAND_HERE|<start_command>)/i.test(dockerfileText || '');
  const needsHardReplace = (!usesNodeBase) || placeholderCmd || !hasCmd;

  if (needsHardReplace && startCmd) {
    const installCmd = 'npm ci --omit=dev || npm install --omit=dev';
    const startCmdJson = JSON.stringify(startCmd);
    const dfLines = [
      'FROM node:18-alpine AS deps',
      'WORKDIR /app',
      'COPY package*.json ./',
      `RUN ${installCmd}`,
      '',
      'FROM node:18-alpine',
      'WORKDIR /app',
      'ENV NODE_ENV=production',
      `ENV PORT=${port}`,
      'COPY --from=deps /app/node_modules ./node_modules',
      'COPY . .',
      `EXPOSE ${port}`,
      `HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -qO- http://localhost:${port}/ || exit 1`,
      'USER node',
      `CMD ${startCmdJson}`,
      ''
    ];
    return dfLines.join('\n');
  }

  // Ensure EXPOSE and HEALTHCHECK if missing
  const exposeRe = new RegExp('^\\s*EXPOSE\\s+' + port + '\\b', 'mi');
  if (!exposeRe.test(dockerfileText || '')) {
    dockerfileText += `\nEXPOSE ${port}\n`;
  }
  if (!/^\s*HEALTHCHECK\b/mi.test(dockerfileText || '')) {
    dockerfileText += `HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -qO- http://localhost:${port}/ || exit 1\n`;
  }
  return dockerfileText;
}

module.exports = { ensureHealthcheck, patchDockerfileForNode };
