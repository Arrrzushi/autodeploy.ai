


<!-- =========================================================
     AUTO DEPLOY . AI — Animated, Designer-Grade README (No Emojis)
     ========================================================= -->

<!-- HERO: animated gradient banner -->
<p align="center">
  <svg width="100%" height="220" viewBox="0 0 1280 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AutoDeploy.AI">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00F0FF">
          <animate attributeName="stop-color" values="#00F0FF;#9740FF;#FF00C8;#00F0FF" dur="12s" repeatCount="indefinite"/>
        </stop>
        <stop offset="100%" stop-color="#0ea5e9">
          <animate attributeName="stop-color" values="#0ea5e9;#22d3ee;#f59e0b;#0ea5e9" dur="12s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="100%" height="220" fill="#0B1021"/>
    <g filter="url(#glow)">
      <text x="50%" y="48%" text-anchor="middle" font-family="JetBrains Mono, Menlo, Consolas, monospace" font-size="42" fill="url(#g1)" letter-spacing="2.5">AUTO DEPLOY . AI</text>
      <text x="50%" y="74%" text-anchor="middle" font-family="Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="18" fill="#C9D8FF" opacity="0.9">Previews that ship themselves.</text>
    </g>
  </svg>
</p>

<!-- Sub-hero kinetic typing -->
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=18&duration=2200&pause=600&color=00F0FF&center=true&vCenter=true&width=980&lines=AI-Optimized+Dockerfiles;Security+Gates+as+Code;One-Click+Previews+with+Isolated+DB;Telemetry+from+Day+Zero" alt="typing banner">
</p>

<!-- Status badges (sleek, neutral) -->
<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Status-MVP_Launch-00F0FF?style=for-the-badge&labelColor=0B1021&color=00F0FF"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-9740FF?style=for-the-badge&labelColor=0B1021&color=9740FF"></a>
  <a href="#"><img src="https://img.shields.io/badge/OpenAI-GPT--4-FF00C8?style=for-the-badge&labelColor=0B1021&color=FF00C8"></a>
</p>

<!-- WAVE SEPARATOR -->
<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/wave-top.svg" alt="" width="100%">
</p>

<div align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#feature-stack">Feature Stack</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#api">API</a> ·
  <a href="#status">Status</a>
</div>

---

## Before / After

<!-- animated comparison bars (SVG) -->
<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/compare-bars.svg" width="900" alt="animated comparison">
</p>

<table>
<thead>
<tr><th>Previous Reality</th><th>With AutoDeploy.AI</th></tr>
</thead>
<tbody>
<tr><td>Manual Dockerfiles and tribal knowledge</td><td>AI-synthesized, audited Dockerfiles</td></tr>
<tr><td>Security bolted on near release</td><td>SBOM + CVE gating in the critical path</td></tr>
<tr><td>Preview environments take hours</td><td>One-click previews with isolated Postgres</td></tr>
<tr><td>Operational drift and guesswork</td><td>Health specs, smoke tests, rich telemetry</td></tr>
</tbody>
</table>

<!-- subtle divider -->
<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/line-gradient.svg" width="720" alt="">
</p>

## Architecture

<!-- animated pulse line -->
<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/pulse-line.svg" width="820" alt="">
</p>

```mermaid
%%{init: { "theme": "dark", "themeVariables": {
  "primaryColor": "#0B1021",
  "primaryTextColor": "#E7ECFF",
  "primaryBorderColor": "#1E293B",
  "lineColor": "#22D3EE",
  "secondaryColor": "#0f172a",
  "tertiaryColor": "#1e293b",
  "noteBkgColor": "#0B1021",
  "noteTextColor": "#C7D2FE"
}} }%%
graph TB
    A[GitHub Repository] --> B[AI Deep Analysis<br/>Intent + Topology]
    B --> C[Dockerfile Synthesis<br/>Optimized Artifacts]
    B --> D[Health Spec Inference]
    B --> E[Security Blueprint]

    C --> F[Multi-Stage Build Lab]
    F --> G[Nixpacks]
    F --> H[Buildpacks]
    F --> I[AI Strategy]

    G & H & I --> J[Automated Smoke Tests]
    J --> K[Security Suite: SBOM + CVE]

    K --> L{Gates}
    L -->|pass| M[Preview Orchestrator]
    L -->|fail| N[AI Remediation Loop] --> C

    M --> O[Isolated Postgres]
    M --> P[Optimized App Container]
    M --> Q[Auto HEALTHCHECK + Monitoring]

    O & P & Q --> R[Full-Stack Preview]
    R --> S[Telemetry: Logs · Metrics · Health]
    R --> T[NodeOps Production Deploy]
````

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/wave-mid.svg" alt="" width="100%">
</p>

## Feature Stack

<!-- animated “chips” as SVG badges -->

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/chips-intelligence.svg" height="28" alt="">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/chips-security.svg"   height="28" alt="">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/chips-previews.svg"  height="28" alt="">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/chips-telemetry.svg" height="28" alt="">
</p>

<div align="center">

| Capability            | Detail                               | State   |
| --------------------- | ------------------------------------ | ------- |
| Intelligent Analysis  | Repo scan → build plan → health spec | Stable  |
| Dockerfile Generation | Nixpacks → Buildpacks → AI fallback  | Stable  |
| Security Gates        | Syft SBOM + Trivy CVE policy         | Beta    |
| Previews              | One click. Isolated DB. TTL cleanup  | Beta    |
| Telemetry             | Real-time logs, health, metrics      | Beta    |
| NodeOps               | Production deployment target         | Planned |

</div>

### Distilled Workflow

```text
1. Deep repository scan
2. Multi-strategy build (Nixpacks → Buildpacks → AI)
3. Automated smoke tests
4. SBOM + CVE analysis
5. Gate decision (pass → preview, fail → remediation)
```

### Security as a Primitive

```yaml
security_scan:
  tools: [Syft, Trivy]
  gates:
    max_high_cves: 3
    max_critical_cves: 0
  auto_fix: true  # proposes Dockerfile patches
```

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/line-gradient.svg" width="720" alt="">
</p>

## Quick Start

<details>
<summary><strong>Prerequisites</strong></summary>

```bash
Docker Desktop
Node.js 18+
# Docker Desktop → Settings → Expose daemon on tcp://localhost:2375
# Optional local Postgres for previews:
docker run -p 5433:5432 -e POSTGRES_PASSWORD=autodeploy_password postgres
```

</details>

<details open>
<summary><strong>Install & Launch</strong></summary>

<div align="center">

| Step    | Backend                     | Frontend                     |
| ------- | --------------------------- | ---------------------------- |
| Install | `cd backend && npm install` | `cd frontend && npm install` |
| Env     | set vars (below)            | `npm run dev`                |
| Run     | `npm run dev`               | open `http://localhost:5173` |

</div>

```powershell
cd backend
$env:DATABASE_URL = "postgresql://autodeploy:autodeploy_password@localhost:5433/autodeploy"
$env:AI_API_KEY    = "your-ai-key-here"
$env:DOCKER_HOST   = "tcp://localhost:2375"

# Options
$env:FRONTEND_URLS       = "http://localhost:5173"
$env:PREVIEW_TTL_HOURS   = "72"
$env:SECURITY_MAX_CRITICAL = "0"

npx prisma generate
npm run dev
```

</details>

<details>
<summary><strong>Try It Live — Express in under a minute</strong></summary>

```powershell
# 1) Analyze
$analysis = Invoke-RestMethod http://localhost:5000/api/analyze-repo -Method POST -Body (@{
  repoUrl = "https://github.com/expressjs/express"
} | ConvertTo-Json) -ContentType "application/json"

# 2) Preflight (build + smoke + security)
$preflight = Invoke-RestMethod http://localhost:5000/api/build/preflight -Method POST -Body (@{
  repoUrl = "https://github.com/expressjs/express"
  preferredPort = 3000
} | ConvertTo-Json) -ContentType "application/json"

# 3) Preview
$preview = Invoke-RestMethod http://localhost:5000/api/previews/create -Method POST -Body (@{
  repoUrl = "https://github.com/expressjs/express"
  ttlHours = 6
  env = @{ NODE_ENV = "production" }
} | ConvertTo-Json -Depth 5) -ContentType "application/json"

Write-Host "Preview URL: $($preview.url)"
```

</details>

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/wave-mid.svg" alt="" width="100%">
</p>

## API

| Endpoint                    | Method | Purpose                     | Status  |
| --------------------------- | ------ | --------------------------- | ------- |
| `/api/analyze-repo`         | POST   | AI repository analysis      | Active  |
| `/api/generate-dockerfile`  | POST   | AI Dockerfile generation    | Active  |
| `/api/build/preflight`      | POST   | Multi-build + security scan | Active  |
| `/api/previews/create`      | POST   | Create preview environment  | Active  |
| `/api/previews/destroy/:id` | POST   | Destroy preview             | Active  |
| `/api/deploy`               | POST   | Deploy to production        | Active  |
| `/api/deploy/nodeops`       | POST   | Deploy via NodeOps          | Planned |

<!-- animated API ruler -->

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/anim/main/ruler-progress.svg" width="860" alt="">
</p>

## Status

<div align="center">

| Component      | Status  | Version | Notes              |
| -------------- | ------- | ------- | ------------------ |
| AI Analysis    | Stable  | v1.0    | GPT-4 integrated   |
| Dockerfile Gen | Stable  | v1.0    | Strategy fallback  |
| Preview Envs   | Beta    | v0.8    | Isolated Postgres  |
| Security Gates | Beta    | v0.7    | Syft/Trivy         |
| NodeOps Deploy | Planned | v0.1    | Target integration |

</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/your-asset/waves/main/wave-bottom.svg" alt="" width="100%">
</p>

## Tech Stack

```yaml
frontend:
  framework: React 18+
  language: TypeScript
  build_tool: Vite
  styling: Modern CSS

backend:
  runtime: Node.js 18+
  framework: Express.js
  database: PostgreSQL + Prisma
  ai: OpenAI GPT-4
  container: Docker Engine API
```

---

## Contributing & Community

* Issues: [https://github.com/your-repo/issues](https://github.com/your-repo/issues)
* PRs: [https://github.com/your-repo/pulls](https://github.com/your-repo/pulls)
* Docs: [https://docs.autodeploy.ai](https://docs.autodeploy.ai)
* Discussion: [https://discord.gg/your-invite](https://discord.gg/your-invite)

---

<p align="center">
  <a href="https://github.com/your-repo/autodeploy.ai">
    <img src="https://raw.githubusercontent.com/your-asset/anim/main/cta-scanline.svg" width="880" alt="Clone and start">
  </a>
</p>
```

---

