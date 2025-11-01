const { exec, spawn } = require('child_process');
const fs = require('fs').promises;

function execCmd(cmd, opts = {}) {
  return new Promise((resolve) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 10, ...opts }, (error, stdout, stderr) => {
      resolve({ code: error ? error.code ?? 1 : 0, stdout: stdout?.toString() || '', stderr: stderr?.toString() || '' });
    });
  });
}

async function dockerBuild(tag, cwd) {
  return execCmd(`docker build -t ${tag} .`, { cwd });
}

async function dockerRunDetached(name, image, portMap, env = {}, labels = {}) {
  const envFlags = Object.entries(env).map(([k, v]) => `-e ${k}=${v}`).join(' ');
  const labelFlags = Object.entries(labels).map(([k, v]) => `--label ${k}=${v}`).join(' ');
  // portMap: { host:'', container: number } -> use random host by empty host
  const portFlag = portMap?.container ? `-p :${portMap.container}` : '';
  const cmd = `docker run -d ${portFlag} --name ${name} ${envFlags} ${labelFlags} ${image}`.trim().replace(/\s+/g, ' ');
  return execCmd(cmd);
}

async function dockerInspect(nameOrId) {
  const res = await execCmd(`docker inspect ${nameOrId}`);
  if (res.code !== 0) return null;
  try { return JSON.parse(res.stdout)[0]; } catch { return null; }
}

async function dockerStopRm(name) {
  await execCmd(`docker rm -f ${name}`);
}

module.exports = { execCmd, dockerBuild, dockerRunDetached, dockerInspect, dockerStopRm };

