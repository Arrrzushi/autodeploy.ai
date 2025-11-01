function ensureHealthcheck(dockerfileText, port, path) {
  try {
    if (/HEALTHCHECK/i.test(dockerfileText || '')) return dockerfileText;
  } catch {}
  const line = [
    '',
    'HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\\n  CMD curl -fsS http://localhost:' + port + (path || '/health') + ' || exit 1',
    ''
  ].join('\n');
  return (dockerfileText || '').trimEnd() + '\n' + line;
}

module.exports = { ensureHealthcheck };

