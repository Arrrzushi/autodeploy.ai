// NodeOps service selector: real Docker by default; mock only if requested
// Env:
//   USE_NODEOPS_MOCK=true  -> force mock
//   DOCKER_HOST, DOCKER_PORT, DOCKER_PROTOCOL -> real Docker connection

const useMock = /^true$/i.test(process.env.USE_NODEOPS_MOCK || '');

let svc;
if (useMock) {
  svc = require('./nodeops-mock');
} else {
  try {
    svc = require('./docker-real');
  } catch (e) {
    console.warn('docker-real load failed, falling back to mock:', e.message);
    svc = require('./nodeops-mock');
  }
}

module.exports = svc;
