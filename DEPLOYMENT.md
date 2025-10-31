# Deployment Guide

Production deployment instructions for AutoDeploy.AI.

## Production Checklist

Before deploying to production:

- [ ] Set strong database passwords
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Enable production logging
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Review security headers
- [ ] Test with production data
- [ ] Set up CI/CD pipeline
- [ ] Document rollback procedures

## Environment Configuration

### Production Environment Variables

Create a `.env.production` file:

```env
# Node Environment
NODE_ENV=production

# Database (use managed service)
DATABASE_URL=postgresql://user:password@your-db-host:5432/autodeploy

# AI Provider (OpenAI-compatible)
AI_API_KEY=your-production-key
AI_BASE_URL=https://api.a4f.co/v1
AI_MODEL=provider-1/qwen2.5-coder-32b-instruct

# URLs
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com

# Security
CORS_ORIGIN=https://yourdomain.com

# Ports (usually behind reverse proxy)
BACKEND_PORT=5000
FRONTEND_PORT=80
```

## Deployment Options

### Option 1: Docker Compose (Simple)

Best for small-scale deployments on a single server.

1. **Set up server** (Ubuntu 22.04 recommended)
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/autodeploy-ai.git
   cd autodeploy-ai
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

4. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Set up reverse proxy** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5173;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Option 2: Kubernetes (Scalable)

Best for production-grade deployments with high availability.

1. **Create Kubernetes manifests**

   `k8s/namespace.yaml`:
   ```yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: autodeploy
   ```

   `k8s/postgres.yaml`:
   ```yaml
   apiVersion: apps/v1
   kind: StatefulSet
   metadata:
     name: postgres
     namespace: autodeploy
   spec:
     serviceName: postgres
     replicas: 1
     selector:
       matchLabels:
         app: postgres
     template:
       metadata:
         labels:
           app: postgres
       spec:
         containers:
         - name: postgres
           image: postgres:15-alpine
           env:
           - name: POSTGRES_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: password
           ports:
           - containerPort: 5432
           volumeMounts:
           - name: postgres-storage
             mountPath: /var/lib/postgresql/data
     volumeClaimTemplates:
     - metadata:
         name: postgres-storage
       spec:
         accessModes: ["ReadWriteOnce"]
         resources:
           requests:
             storage: 10Gi
   ```

   `k8s/backend.yaml`:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: backend
     namespace: autodeploy
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: backend
     template:
       metadata:
         labels:
           app: backend
       spec:
         containers:
         - name: backend
           image: yourdockerhub/autodeploy-backend:latest
           env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: url
           - name: OPENAI_API_KEY
             valueFrom:
               secretKeyRef:
                 name: api-keys
                 key: openai
           ports:
           - containerPort: 5000
   ```

2. **Deploy to cluster**
   ```bash
   kubectl apply -f k8s/
   ```

### Option 3: Cloud Platforms

#### AWS (ECS + RDS)

1. **Set up RDS PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier autodeploy-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password YourPassword
   ```

2. **Build and push images**
   ```bash
   aws ecr create-repository --repository-name autodeploy-backend
   docker build -t autodeploy-backend backend/
   docker tag autodeploy-backend:latest \
     YOUR_ACCOUNT.dkr.ecr.region.amazonaws.com/autodeploy-backend:latest
   docker push YOUR_ACCOUNT.dkr.ecr.region.amazonaws.com/autodeploy-backend:latest
   ```

3. **Create ECS task definition and service**
   (Use AWS Console or Terraform)

#### Google Cloud (Cloud Run + Cloud SQL)

1. **Create Cloud SQL instance**
   ```bash
   gcloud sql instances create autodeploy-db \
     --database-version=POSTGRES_15 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Deploy to Cloud Run**
   ```bash
   # Backend
   cd backend
   gcloud run deploy autodeploy-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   
   # Frontend
   cd ../frontend
   gcloud run deploy autodeploy-frontend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### DigitalOcean (App Platform)

1. **Connect repository** in DigitalOcean dashboard
2. **Configure build settings**:
   - Backend: Node.js, port 5000
   - Frontend: Static Site, Vite build
3. **Add PostgreSQL database** from marketplace
4. **Set environment variables**
5. **Deploy**

## Database Setup

### Managed Database Services

Recommended providers:
- **AWS RDS**: Full-featured, auto-backups
- **Google Cloud SQL**: Good performance
- **DigitalOcean Managed Databases**: Simple setup
- **Supabase**: PostgreSQL + extras

### Database Migration

```bash
# Run migrations
npx prisma migrate deploy

# Seed data (if needed)
npx prisma db seed
```

## SSL/TLS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Update DNS to Cloudflare nameservers
3. Enable "Full (strict)" SSL mode
4. Configure page rules for caching

## Monitoring Setup

### Basic Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend health
curl https://yourdomain.com/health
```

### Uptime Monitoring

Services to use:
- UptimeRobot (free)
- Pingdom
- StatusCake
- Better Uptime

### Application Monitoring

Integrate:
```javascript
// backend/app.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Backup Strategy

### Database Backups

Automated:
```bash
# Daily backup cron job
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql
```

Manual:
```bash
docker-compose exec postgres pg_dump -U autodeploy autodeploy > backup.sql
```

### Application Backups

- Docker images in registry
- Configuration in version control
- Environment variables documented

## Scaling Strategies

### Horizontal Scaling

1. **Load balancer** (Nginx/HAProxy)
2. **Multiple backend instances**
3. **Session-less design** (already implemented)
4. **Shared database**

### Vertical Scaling

- Increase container resources
- Optimize database queries
- Add caching layer (Redis)

### Auto-scaling

Kubernetes HPA:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Security Hardening

### 1. Environment Security
- Use secrets management (Vault, AWS Secrets Manager)
- Rotate credentials regularly
- Limit database access by IP
- Use read-only database users where possible

### 2. Network Security
- Use VPC/private networks
- Enable firewall rules
- Implement rate limiting
- Use WAF (Web Application Firewall)

### 3. Application Security
- Keep dependencies updated
- Run security audits: `npm audit`
- Use security headers
- Implement CSP (Content Security Policy)

## Troubleshooting

### Check logs
```bash
# Docker Compose
docker-compose logs -f backend

# Kubernetes
kubectl logs -f deployment/backend -n autodeploy
```

### Database connection issues
```bash
# Test connection
docker-compose exec backend npx prisma db pull
```

### Performance issues
- Check database query performance
- Monitor memory usage
- Profile with Node.js profiler
- Review nginx access logs

## Rollback Procedures

### Docker Compose
```bash
# Roll back to previous version
docker-compose down
git checkout previous-tag
docker-compose up -d
```

### Kubernetes
```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n autodeploy
```

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: |
          docker-compose build
      
      - name: Push to registry
        run: |
          docker push yourdockerhub/autodeploy-backend:latest
      
      - name: Deploy
        run: |
          ssh user@yourserver 'cd autodeploy-ai && docker-compose pull && docker-compose up -d'
```

---

**Need help?** Open an issue or check the documentation.





