# AutoDeploy.AI Quick Start Guide

Get AutoDeploy.AI running in 5 minutes! ⚡

## Prerequisites Check

Before starting, ensure you have:

- ✅ Docker & Docker Compose installed
- ✅ AI API key (OpenAI-compatible provider)
- ✅ At least 4GB RAM available
- ✅ Git installed

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/autodeploy-ai.git
cd autodeploy-ai
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your AI API key:

```env
AI_API_KEY=your-ai-api-key
AI_BASE_URL=https://api.a4f.co/v1
AI_MODEL=provider-1/qwen2.5-coder-32b-instruct
```

**Where to get an OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### 3. Start the Application

```bash
docker-compose up --build
```

This will:
- Build the Docker images
- Start PostgreSQL database
- Start the backend API
- Start the frontend application

**First-time setup takes 3-5 minutes** as it downloads dependencies.

### 4. Access the Application

Once you see:
```
autodeploy-frontend | ✓ ready in XXXms
autodeploy-backend  | 🚀 AutoDeploy.AI Backend running on port 5000
```

Open your browser:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Testing the Application

### Try These Sample Repositories

1. **Node.js/Express**
   ```
   https://github.com/expressjs/express
   ```

2. **Next.js**
   ```
   https://github.com/vercel/next.js
   ```

3. **Python/Flask** (if you want to test Python)
   ```
   https://github.com/pallets/flask
   ```

### Usage Flow

1. **Paste a GitHub URL** on the landing page
2. **Click "Analyze Repository"** (takes 15-30 seconds)
3. **Review the generated Dockerfile**
4. **Click "Deploy to NodeOps"**
5. **Watch the deployment progress**
6. **View the dashboard** with logs and metrics

## Troubleshooting

### Port Already in Use

If you see "port is already allocated":

```bash
# Change ports in .env file
BACKEND_PORT=5001
FRONTEND_PORT=5174
POSTGRES_PORT=5433

# Restart
docker-compose down
docker-compose up
```

### OpenAI API Errors

If you see "OpenAI API error":
- Verify your API key is correct
- Check you have API credits available
- Ensure the key starts with `sk-`

### Database Connection Failed

```bash
# Reset the database
docker-compose down -v
docker-compose up
```

### Build Errors

```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Stopping the Application

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Local Development (Without Docker)

If you prefer to run without Docker:

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

```bash
# Run PostgreSQL in Docker
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=autodeploy_password \
  -e POSTGRES_USER=autodeploy \
  -e POSTGRES_DB=autodeploy \
  postgres:15-alpine
```

## Next Steps

- 📚 Read the [full README](README.md)
- 🤝 Check [Contributing Guide](CONTRIBUTING.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/yourusername/autodeploy-ai/issues)

## Getting Help

- **Documentation**: See README.md
- **API Docs**: Visit http://localhost:5000/health
- **Logs**: Check `docker-compose logs -f`

---

**Happy Deploying! 🚀**





