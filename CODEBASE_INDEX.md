## AutoDeploy.AI Codebase Index

### Overview
- Full-stack app: React + TypeScript (frontend), Express + Node.js + Prisma (backend), PostgreSQL, Docker Compose.
- Purpose: Analyze repos, generate Dockerfiles with AI, deploy containers, and monitor logs/metrics.

### Top-Level Structure
```
nodeops/
├─ backend/                 # Express API, services, Prisma
│  ├─ routes/               # REST endpoints: ai, deploy, logs
│  ├─ services/             # GitHub, AI(OpenAI-compatible), Docker runtime
│  ├─ prisma/               # Migrations, schema
│  ├─ app.js                # Server setup and middleware
│  ├─ Dockerfile            # Backend image
│  └─ package.json          # Backend scripts/deps
├─ frontend/                # React + Vite + Tailwind
│  ├─ src/                  # Components, pages, hooks, api
│  ├─ Dockerfile            # Nginx build/serve
│  └─ package.json          # Frontend scripts/deps
├─ scripts/                 # Setup/cleanup/test helpers
├─ docker-compose.yml       # Dev stack (pg, backend, frontend)
├─ docker-compose.prod.yml  # Prod stack (healthchecks, nginx optional)
├─ package.json             # Root helper scripts
└─ *.md                     # Docs: README, ARCHITECTURE, QUICKSTART, etc.
```

### Root Scripts
```json
{
  "setup": "bash scripts/setup.sh",
  "start": "docker-compose up",
  "start:prod": "docker-compose -f docker-compose.prod.yml up -d",
  "stop": "docker-compose down",
  "clean": "bash scripts/cleanup.sh",
  "test": "bash scripts/test-deployment.sh",
  "logs": "docker-compose logs -f",
  "backend": "cd backend && npm run dev",
  "frontend": "cd frontend && npm run dev"
}
```

### Backend
- Entry: `backend/app.js` mounts routers under `/api` and exposes `/health`.
- Dependencies: Express, Prisma, PostgreSQL, Dockerode, OpenAI-compatible SDK, simple-git, multer.

Endpoints (mounted by `app.js`):
- Analysis (in `routes/ai.js`):
  - POST `/api/analyze-repo` → clone + analyze structure + AI analysis
  - POST `/api/generate-dockerfile` → AI Dockerfile + save Project
  - GET `/api/projects` → list latest projects (+recent deployment)
  - GET `/api/projects/:id` → project with deployments
- Deployment (in `routes/deploy.js`):
  - POST `/api/deploy` → build image + run container; save Deployment
  - GET `/api/deployments` → list deployments (with project summary)
  - GET `/api/deployments/:id` → deployment details
  - POST `/api/deployments/:id/stop` → stop container + mark stopped
- Monitoring (in `routes/logs.js`):
  - GET `/api/logs/:deploymentId` → container logs (since=? ms)
  - GET `/api/health/:deploymentId` → health metrics
  - GET `/api/metrics/:deploymentId` → detailed metrics + status

Key Services:
- `services/github.js` → clone repo (simple-git), structure scan (depth-limited, ignores common dirs), tech stack heuristics, cleanup, URL validation.
- `services/openai.js` → analyze repo structure and generate Dockerfile/CI via OpenAI-compatible API (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`).
- `services/docker-real.js` → build image with Dockerode (creates minimal runnable app for demo), run container with dynamic port, stream logs, track metrics, stop deployment.

Prisma:
- See `backend/prisma/migrations/*` for schema. Tables: `Project`, `Deployment` (relations documented in README/ARCHITECTURE).

Scripts:
- `scripts/setup.sh`, `scripts/cleanup.sh`, `scripts/test-deployment.sh`.

### Frontend
- React + Vite + TypeScript + Tailwind.
- Key paths:
  - Pages: `src/pages/{Landing,Analysis,Deploy,Dashboard}.tsx`
  - Components: `src/components/{Navbar,CodeBlock,MetricCard,LogViewer}.tsx`
  - API client: `src/api/client.ts`
  - Hook: `src/hooks/usePolling.tsx`
- Served by Nginx in production image; uses `VITE_API_URL` to reach backend.

### Docker & Compose
- Dev (`docker-compose.yml`):
  - `postgres` (15-alpine, healthcheck, volume `postgres_data`)
  - `backend` (bind-mount `./backend:/app`, exposes `5000`, shares `./repos`)
  - `frontend` (built, served on `:80` mapped to host `${FRONTEND_PORT:-5173}`)
- Prod (`docker-compose.prod.yml`):
  - `postgres`, `backend`, `frontend` with healthchecks; optional `nginx` reverse proxy.
- Default network: `autodeploy-network` (dev) / `autodeploy-prod-network` (prod).

### Environment Variables (commonly used)
- Database: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`.
- Backend: `NODE_ENV`, `PORT`, `FRONTEND_URL` (CORS), `DOCKER_HOST`.
- AI: `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.
- Frontend: `VITE_API_URL`.

### Getting Started (quick)
1) Copy envs (`.env.example` → `.env`) and set AI/DB values.
2) Start dev stack: `npm run start` (or `docker-compose up --build`).
3) Frontend: http://localhost:5173, Backend: http://localhost:5000/health.

### Key Docs
- `README.md` → features, quick start, endpoints, schema.
- `ARCHITECTURE.md` → system design, flows, tables, security.
- `PROJECT_SUMMARY.md` → file map and features list.
- `QUICKSTART.md`, `DEPLOYMENT.md`, `CONTRIBUTING.md`.



