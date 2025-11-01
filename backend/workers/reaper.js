const { execCmd } = require('../services/exec');
const { prisma } = require('../prisma/client');

const TTL_MINUTES = parseInt(process.env.PREVIEW_SWEEP_MINUTES || '10', 10);
const DEFAULT_TTL_HOURS = parseInt(process.env.PREVIEW_TTL_HOURS || '72', 10);

async function sweep() {
  try {
    const list = await prisma.deployment.findMany({ where: { nodeLocation: 'local-preview', status: 'running' } });
    const now = Date.now();
    for (const d of list) {
      const created = new Date(d.createdAt).getTime();
      if (created + DEFAULT_TTL_HOURS * 3600_000 > now) continue;
      const id = d.id;
      await execCmd(`docker rm -f preview-app-${id}`).catch(()=>{});
      await execCmd(`docker rm -f preview-db-${id}`).catch(()=>{});
      await prisma.deployment.update({ where: { id }, data: { status: 'stopped' } }).catch(()=>{});
    }
  } catch {}
}

function start() {
  setInterval(sweep, TTL_MINUTES * 60_000).unref();
}

module.exports = { start };

