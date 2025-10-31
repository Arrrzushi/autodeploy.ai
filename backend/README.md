# AutoDeploy.AI Backend

Express.js backend API for AutoDeploy.AI system.

## Features

- GitHub repository cloning and analysis
- OpenAI GPT-4 integration for Dockerfile generation
- Mock NodeOps deployment simulation
- PostgreSQL database with Prisma ORM
- RESTful API endpoints

## Tech Stack

- Node.js 18+
- Express.js
- Prisma ORM
- PostgreSQL
- OpenAI API
- simple-git

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Analysis
- `POST /api/analyze-repo` - Analyze GitHub repository
- `POST /api/generate-dockerfile` - Generate Dockerfile

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details

### Deployment
- `POST /api/deploy` - Deploy to NodeOps
- `GET /api/deployments` - List deployments
- `GET /api/deployments/:id` - Get deployment details
- `POST /api/deployments/:id/stop` - Stop deployment

### Monitoring
- `GET /api/logs/:deploymentId` - Get container logs
- `GET /api/health/:deploymentId` - Get health metrics
- `GET /api/metrics/:deploymentId` - Get detailed metrics

## Project Structure

```
backend/
├── app.js              # Express server
├── routes/
│   ├── ai.js          # AI and analysis routes
│   ├── deploy.js      # Deployment routes
│   └── logs.js        # Logging and metrics routes
├── services/
│   ├── openai.js      # OpenAI integration
│   ├── github.js      # GitHub operations
│   └── nodeops-mock.js # Mock NodeOps service
└── prisma/
    └── schema.prisma  # Database schema
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/autodeploy
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:5173
```

## Development

```bash
# Run with auto-reload
npm run dev

# Database operations
npx prisma studio        # Open Prisma Studio
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client
```





