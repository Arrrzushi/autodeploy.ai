# AutoDeploy.AI Architecture

Comprehensive technical architecture documentation.

## System Overview

AutoDeploy.AI is a full-stack application that automates the process of analyzing codebases, generating optimized Dockerfiles, and deploying containerized applications.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│                  (React + TypeScript + Tailwind)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Layer                           │
│                    (Express.js + Node.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────┐    ┌────────────┐    ┌──────────────┐          │
│  │ AI Routes │    │   Deploy   │    │     Logs     │          │
│  │           │    │   Routes   │    │    Routes    │          │
│  └─────┬─────┘    └──────┬─────┘    └──────┬───────┘          │
│        │                 │                   │                   │
│        ▼                 ▼                   ▼                   │
│  ┌───────────┐    ┌────────────┐    ┌──────────────┐          │
│  │  OpenAI   │    │  NodeOps   │    │    GitHub    │          │
│  │  Service  │    │   Mock     │    │   Service    │          │
│  └───────────┘    └────────────┘    └──────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │ Prisma ORM
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│              (Projects, Deployments, Metrics)                    │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **AI Integration**: OpenAI API (GPT-4)
- **Version Control**: simple-git

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (production)
- **Database**: PostgreSQL with persistent volumes

## Data Flow

### 1. Repository Analysis Flow

```
User → Frontend → Backend → GitHub Service
                      ↓
                 Clone Repo
                      ↓
              Analyze Structure
                      ↓
                 OpenAI Service
                      ↓
            Generate Analysis
                      ↓
                   Database
                      ↓
                  Frontend
```

**Steps:**
1. User pastes GitHub URL
2. Frontend validates and sends to `/api/analyze-repo`
3. Backend clones repository to temp directory
4. Filesystem walker analyzes structure
5. OpenAI analyzes codebase and detects tech stack
6. Results stored in PostgreSQL
7. Response sent back to frontend

### 2. Dockerfile Generation Flow

```
Analysis Data → Backend → OpenAI Service
                   ↓
           Prompt Engineering
                   ↓
           GPT-4 Processing
                   ↓
        Generated Dockerfile
                   ↓
              Database
                   ↓
              Frontend
```

**Steps:**
1. Frontend sends analysis results to `/api/generate-dockerfile`
2. Backend constructs optimized prompt
3. OpenAI GPT-4 generates Dockerfile
4. Dockerfile validated and stored
5. Project record created in database
6. Dockerfile returned to frontend

### 3. Deployment Flow

```
Deploy Request → Backend → NodeOps Mock
                    ↓
            Simulate Build
                    ↓
          Create Deployment
                    ↓
          Generate Metadata
                    ↓
              Database
                    ↓
    Start Log Generation
                    ↓
              Frontend
```

**Steps:**
1. User clicks "Deploy to NodeOps"
2. Frontend sends request to `/api/deploy`
3. Mock service simulates deployment (3-5s)
4. Deployment record created
5. Container ID and URL generated
6. Logs and metrics initialized
7. Frontend polls for updates

### 4. Monitoring Flow

```
Dashboard → Polling (3-5s intervals)
              ↓
   ┌──────────┴──────────┐
   ▼                     ▼
Logs API            Metrics API
   ▼                     ▼
Mock Service      Mock Service
   ▼                     ▼
Generate Logs     Generate Metrics
   ▼                     ▼
      Frontend Display
```

## Database Schema

### Projects Table

```sql
CREATE TABLE projects (
    id          UUID PRIMARY KEY,
    repoUrl     VARCHAR(500) NOT NULL,
    analysis    JSONB NOT NULL,
    dockerfile  TEXT NOT NULL,
    createdAt   TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique project identifier
- `repoUrl`: GitHub repository URL
- `analysis`: JSON containing AI analysis results
- `dockerfile`: Generated Dockerfile content
- `createdAt`: Project creation timestamp

### Deployments Table

```sql
CREATE TABLE deployments (
    id            UUID PRIMARY KEY,
    projectId     UUID REFERENCES projects(id),
    containerUrl  VARCHAR(500) NOT NULL,
    nodeLocation  VARCHAR(100) NOT NULL,
    containerId   VARCHAR(100) NOT NULL,
    status        VARCHAR(50) NOT NULL,
    createdAt     TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique deployment identifier
- `projectId`: Foreign key to projects
- `containerUrl`: Public URL of deployed container
- `nodeLocation`: Geographic location of node
- `containerId`: Container identifier
- `status`: Current status (pending/running/stopped)
- `createdAt`: Deployment timestamp

## API Endpoints

### Analysis Endpoints

#### POST /api/analyze-repo
Analyzes a GitHub repository.

**Request:**
```json
{
  "repoUrl": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "repoUrl": "...",
  "structure": {
    "language": "JavaScript/Node.js",
    "framework": "Express",
    "fileCount": 234,
    "files": [...],
    "directories": [...]
  },
  "analysis": {
    "language": "JavaScript",
    "framework": "Express",
    "dependencies": [...],
    "deploymentStrategy": "...",
    "resources": {...}
  }
}
```

#### POST /api/generate-dockerfile
Generates optimized Dockerfile.

**Request:**
```json
{
  "analysis": {...},
  "structure": {...},
  "repoUrl": "..."
}
```

**Response:**
```json
{
  "projectId": "uuid",
  "dockerfile": "FROM node:18-alpine\n...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Deployment Endpoints

#### POST /api/deploy
Deploys container to NodeOps.

**Request:**
```json
{
  "projectId": "uuid",
  "dockerfile": "...",
  "projectName": "my-app"
}
```

**Response:**
```json
{
  "deploymentId": "uuid",
  "containerId": "abc123def456",
  "containerUrl": "https://my-app-abc123.nodeops.network",
  "nodeLocation": "US-East-1 (Virginia)",
  "status": "running"
}
```

### Monitoring Endpoints

#### GET /api/logs/:deploymentId
Retrieves container logs.

**Query Params:**
- `since`: Timestamp to fetch logs after

**Response:**
```json
{
  "deploymentId": "uuid",
  "logs": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "level": "info",
      "message": "Server started"
    }
  ],
  "count": 10
}
```

#### GET /api/health/:deploymentId
Retrieves health metrics.

**Response:**
```json
{
  "deploymentId": "uuid",
  "uptime": 3600,
  "cpu": "15.5%",
  "memory": "192MB",
  "memoryPercent": "25.6%",
  "nodeLocation": "US-East-1 (Virginia)",
  "status": "healthy"
}
```

## Security Considerations

### 1. API Security
- CORS protection with whitelist
- Input validation on all endpoints
- Environment variable isolation
- Rate limiting (to be implemented)

### 2. Container Security
- Non-root user in containers
- Multi-stage builds to reduce attack surface
- Minimal base images (Alpine)
- No hardcoded secrets

### 3. Database Security
- Parameterized queries via Prisma
- Connection pooling
- SSL connections (production)
- Regular backups

### 4. GitHub Operations
- Shallow clones (`--depth 1`)
- Temporary directory cleanup
- Timeout limits on operations
- Validation of GitHub URLs

## Performance Optimizations

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Debounced API calls
- Optimized re-renders with React.memo
- Gzip compression in Nginx
- Asset caching

### Backend
- Database connection pooling
- Async/await for non-blocking operations
- Response compression
- Efficient Prisma queries
- Cleanup of temporary files

### Database
- Indexed foreign keys
- JSON field for flexible analysis storage
- Cascade deletes
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Load balancer ready
- Session-less architecture

### Vertical Scaling
- Efficient memory usage
- Garbage collection optimization
- Process monitoring

### Future Improvements
- Redis caching layer
- Message queue for long operations
- CDN for static assets
- Database read replicas
- WebSocket for real-time updates

## Monitoring & Observability

### Current Implementation
- Console logging
- Request/response logging
- Error tracking
- Health check endpoints

### Future Implementation
- Structured logging (Winston/Pino)
- Application metrics (Prometheus)
- Distributed tracing (OpenTelemetry)
- Error reporting (Sentry)
- Performance monitoring (APM)

## Deployment Strategies

### Development
```bash
docker-compose up
```

### Production (Self-Hosted)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options
- **Kubernetes**: Helm charts for orchestration
- **AWS**: ECS + RDS
- **GCP**: Cloud Run + Cloud SQL
- **Azure**: Container Instances + PostgreSQL

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- API endpoint handlers

### Integration Tests
- API endpoint flows
- Database operations
- External service mocks

### E2E Tests
- Complete user flows
- Repository analysis
- Deployment process

## Future Architecture Enhancements

1. **Microservices Split**
   - Separate AI service
   - Separate deployment service
   - API Gateway

2. **Event-Driven Architecture**
   - Message queue (RabbitMQ/Kafka)
   - Event sourcing
   - CQRS pattern

3. **Real-Time Features**
   - WebSocket connections
   - Server-Sent Events
   - Live collaboration

4. **Advanced Features**
   - Multi-tenancy
   - Role-based access control
   - Template marketplace
   - Cost analytics

---

**Last Updated**: January 2024





