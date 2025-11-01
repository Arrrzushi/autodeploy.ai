# AutoDeploy.AI

AI‑Powered DevOps for fast previews, secure builds, and one‑click deploys.

AutoDeploy.AI analyzes GitHub repos, generates optimized Dockerfiles with AI, preflights builds using Nixpacks/Buildpacks/AI, creates preview environments with temporary Postgres, scans images for CVEs, and deploys to NodeOps.

![AutoDeploy.AI](https://img.shields.io/badge/Status-MVP-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node](https://img.shields.io/badge/Node-18+-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue)

---

## Features

- AI‑Powered analysis and Dockerfile generation
- Preflight build: Nixpacks → Buildpacks → AI Dockerfile, with smoke test
- Preview environments: temp Postgres + app container, TTL auto‑reaper
- Security gate: Syft SBOM + Trivy CVEs, thresholds via env
- Health spec inference + automatic HEALTHCHECK injection
- NodeOps plans (placeholder) + deploy integration
- Real‑time logs, metrics, health endpoints

---

## Prerequisites

- Docker Desktop and Node.js 18+
- Docker daemon exposed on `tcp://localhost:2375` (Docker Desktop setting)
- AI API key (for AI analysis + Dockerfile generation)
- Postgres (Docker or local). Example:
  - DB: `autodeploy`, user: `autodeploy`, password: `autodeploy_password`
  - Host: `localhost:5433` (configure as needed)

---

## Setup

1) Backend env (PowerShell)

```
cd backend
$env:DATABASE_URL = "postgresql://autodeploy:autodeploy_password@localhost:5433/autodeploy"
$env:AI_API_KEY = "<your key>"
$env:DOCKER_HOST = "localhost"
$env:DOCKER_PORT = "2375"
$env:DOCKER_PROTOCOL = "http"
# Optional
$env:FRONTEND_URLS = "http://localhost:5173"
$env:PREFLIGHT_PORTS = "3000,5173,8080,8000,5000"
$env:PREVIEW_TTL_HOURS = "72"
$env:SECURITY_MAX_HIGH = "3"
$env:SECURITY_MAX_CRITICAL = "0"

npx prisma generate
npm install
npm run dev
```

2) Frontend env & run

```
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

Backend logs should include: `Prisma connected to ...` and `Docker mode: REAL`.

---

## API Overview

- Analyze + Build
  - POST `/api/analyze-repo` → Analyze repo
  - POST `/api/generate-dockerfile` → AI Dockerfile + save Project
  - POST `/api/build/preflight` → Try Nixpacks/Buildpacks/AI, smoke test, security scans (if syft/trivy present)

- Deployments + Previews
  - POST `/api/deploy` → Deploy container (real Docker)
  - POST `/api/previews/create` → Create preview (temp Postgres + app)
  - POST `/api/previews/destroy/:id` → Destroy preview
  - GET `/api/deployments/:id` → Deployment details
  - GET `/api/logs/:id` → Logs
  - GET `/api/metrics/:id` → Metrics

- Security + Health
  - GET `/api/security/:projectId` → CVE summary from last scan
  - POST `/api/security/fix-and-rebuild` → Patch AI Dockerfile text and store suggestion
  - POST `/api/health/spec` → Infer HealthSpec { port, liveness, readiness }

- NodeOps
  - GET `/api/nodeops/plans` → plans
  - POST `/api/deploy/nodeops` → placeholder deploy

---

## Quick Smoke (PowerShell)

```
# Preflight
$body = @{ repoUrl = "https://github.com/expressjs/express"; preferredPort = 3000 } | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/build/preflight -Method POST -ContentType application/json -Body $body

# Preview create
$body = @{ repoUrl = "https://github.com/expressjs/express"; ttlHours = 6; env = @{ NODE_ENV = "production" } } | ConvertTo-Json -Depth 5
$preview = Invoke-RestMethod http://localhost:5000/api/previews/create -Method POST -ContentType application/json -Body $body
Invoke-WebRequest ($preview.url) -UseBasicParsing | Select-Object StatusCode
Invoke-RestMethod ("http://localhost:5000/api/previews/destroy/{0}" -f $preview.previewId) -Method POST

# Security summary (after build; provide a projectId)
Invoke-RestMethod http://localhost:5000/api/security/<projectId>

# Health spec
$body = @{ repoUrl = "https://github.com/expressjs/express" } | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/health/spec -Method POST -ContentType application/json -Body $body
```

---

## Frontend

- Home: kick off repo analysis and Dockerfile generation
- Features: analysis details and deploy handoff
- Tools: Preflight builds, Preview create/destroy, Security summary, Health spec
- Deploy: deploy flow and dashboard

---

## Notes

- Docker daemon: enable “Expose daemon on tcp://localhost:2375 without TLS” in Docker Desktop.
- Prisma: backend loads `.env` before initializing Prisma; on start it logs the DB target and attempts a `$connect()`.
- Security scans: Syft/Trivy must be installed and on PATH. When absent, preflight continues and skips scans gracefully.

