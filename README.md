# AutoDeploy.AI 🚀

**AI-Powered Autonomous DevOps System for NodeOps Proof of Build DePIN Hackathon**

AutoDeploy.AI automatically analyzes GitHub repositories, generates optimized Dockerfiles using GPT-4, and deploys containerized applications to NodeOps infrastructure with one click.

![AutoDeploy.AI](https://img.shields.io/badge/Status-MVP-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node](https://img.shields.io/badge/Node-18+-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue)

---

## ✨ Features

- 🤖 **AI-Powered Analysis**: GPT-4 analyzes your codebase and detects tech stack
- 🐳 **Smart Dockerfile Generation**: Creates optimized, production-ready Dockerfiles
- ⚡ **One-Click Deployment**: Deploy to NodeOps with a single button click
- 📊 **Real-Time Dashboard**: Monitor logs, metrics, and container health
- 🔒 **Security-First**: Multi-stage builds, non-root users, and best practices
- 🎨 **Modern UI**: Beautiful dark theme with gradient accents and smooth animations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AutoDeploy.AI System                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Frontend   │◄────►│   Backend    │◄────►│ PostgreSQL│ │
│  │ React + TS   │      │ Node + Express│     │  Database │ │
│  │  Tailwind    │      │   + Prisma   │      └───────────┘ │
│  └──────────────┘      └──────┬───────┘                     │
│                                │                             │
│                    ┌───────────┼───────────┐                │
│                    │           │           │                 │
│              ┌─────▼────┐ ┌───▼────┐ ┌───▼─────┐           │
│              │ OpenAI   │ │ GitHub │ │ NodeOps │           │
│              │  GPT-4   │ │  Clone │ │  Mock   │           │
│              └──────────┘ └────────┘ └─────────┘           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker** & **Docker Compose** (v2.0+)
- **Node.js** 18+ (for local development)
- **AI API Key** (Third-party AI service)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/autodeploy-ai.git
   cd autodeploy-ai
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your AI API credentials:
   ```env
   AI_API_KEY=your-ai-api-key
   AI_BASE_URL=https://api.a4f.co/v1
   AI_MODEL=provider-1/qwen2.5-coder-32b-instruct
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: localhost:5432

---

## 🛠️ Local Development

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up Prisma
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📡 API Endpoints

### Analysis & Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze-repo` | Analyze GitHub repository |
| `POST` | `/api/generate-dockerfile` | Generate optimized Dockerfile |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get project details |

### Deployment

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/deploy` | Deploy to NodeOps |
| `GET` | `/api/deployments` | List deployments |
| `GET` | `/api/deployments/:id` | Get deployment details |
| `POST` | `/api/deployments/:id/stop` | Stop deployment |

### Monitoring

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/logs/:deploymentId` | Get container logs |
| `GET` | `/api/health/:deploymentId` | Get health metrics |
| `GET` | `/api/metrics/:deploymentId` | Get detailed metrics |

---

## 🎯 Usage Flow

1. **Enter GitHub URL**: Paste any public GitHub repository URL
2. **AI Analysis**: System clones repo and analyzes with GPT-4
3. **Review Dockerfile**: See the generated optimized Dockerfile
4. **Deploy**: Click to deploy to NodeOps (mock simulation)
5. **Monitor**: View real-time logs, metrics, and uptime

### Example Repositories to Test

- `https://github.com/vercel/next.js` (Next.js)
- `https://github.com/expressjs/express` (Express)
- `https://github.com/facebook/react` (React)
- `https://github.com/pallets/flask` (Python Flask)

---

## 🐳 Docker Details

### Multi-Stage Builds

Both frontend and backend use optimized multi-stage Docker builds:

- **Backend**: Node.js 18 Alpine → Production with Prisma
- **Frontend**: Node build → Nginx serve (production-ready)

### Services

- **postgres**: PostgreSQL 15 with persistent volume
- **backend**: Express API with Prisma ORM
- **frontend**: React SPA served by Nginx

---

## 🗄️ Database Schema

```prisma
model Project {
  id          String       @id @default(uuid())
  repoUrl     String
  analysis    Json
  dockerfile  String
  createdAt   DateTime     @default(now())
  deployments Deployment[]
}

model Deployment {
  id            String   @id @default(uuid())
  projectId     String
  containerUrl  String
  nodeLocation  String
  containerId   String
  status        String   // pending, running, stopped
  createdAt     DateTime @default(now())
  project       Project  @relation(...)
}
```

---

## 🎨 UI/UX Design

- **Dark Theme**: Modern, futuristic design
- **Gradient Accents**: Cyan (#00E0FF) to Purple (#9D00FF)
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design with Tailwind CSS

---

## 🔒 Security Features

- ✅ Multi-stage Docker builds for smaller images
- ✅ Non-root user in containers
- ✅ CORS protection
- ✅ Environment variable isolation
- ✅ Security headers in Nginx
- ✅ Health checks for all services

---

## 🚧 Roadmap & Future Features

- [ ] **Real NodeOps Integration**: Replace mock with actual NodeOps API
- [ ] **User Authentication**: Supabase auth for multi-user support
- [ ] **Template Library**: Save and share Dockerfile templates
- [ ] **Deployment History**: Track all deployments over time
- [ ] **CI/CD Generation**: Auto-generate GitHub Actions workflows
- [ ] **Cost Estimation**: Show deployment costs before deploying
- [ ] **Blockchain Integration**: Store config hashes on Polygon/Filecoin
- [ ] **Multi-Cloud Support**: Deploy to AWS, GCP, Azure

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Hackathon Submission

**Project**: AutoDeploy.AI  
**Event**: NodeOps Proof of Build DePIN Hackathon  
**Category**: AI-Powered DevOps Automation  

### Key Innovations

1. **AI-First Approach**: Leverages GPT-4 for intelligent Dockerfile generation
2. **NodeOps Integration**: Designed for decentralized infrastructure deployment
3. **Developer Experience**: Reduces deployment time from hours to minutes
4. **Production-Ready**: Security best practices and optimized builds

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/autodeploy-ai/issues)
- **Email**: your.email@example.com
- **Discord**: [Join our community](#)

---

## 🙏 Acknowledgments

- **NodeOps** for the DePIN infrastructure platform
- **OpenAI** for GPT-4 API access
- **Vercel** for UI/UX inspiration
- **The Open Source Community** for amazing tools

---

<div align="center">

**Built with ❤️ for the NodeOps Hackathon**

[![Star on GitHub](https://img.shields.io/github/stars/yourusername/autodeploy-ai?style=social)](https://github.com/yourusername/autodeploy-ai)

</div>


