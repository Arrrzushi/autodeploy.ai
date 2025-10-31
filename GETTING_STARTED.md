# Getting Started with AutoDeploy.AI

Welcome! This guide will help you get AutoDeploy.AI running on your machine in just a few minutes.

## 🎯 What You'll Need

Before starting, make sure you have:

1. **Docker Desktop** installed ([Download here](https://www.docker.com/products/docker-desktop/))
2. **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
3. **Git** installed
4. At least **4GB of free RAM**

## 🚀 Quick Setup (3 Steps)

### Step 1: Get the Code

```bash
git clone https://github.com/yourusername/autodeploy-ai.git
cd autodeploy-ai
```

### Step 2: Configure OpenAI

```bash
# Copy the environment template
cp .env.example .env
```

Open `.env` in your favorite text editor and replace `your_openai_api_key_here` with your actual OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

💡 **Don't have an OpenAI API key?**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account (you'll get free credits!)
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### Step 3: Launch!

```bash
docker-compose up --build
```

This will:
- 📦 Download required Docker images
- 🏗️ Build your application containers
- 🗄️ Set up the PostgreSQL database
- 🚀 Start the frontend and backend servers

**First-time setup takes 3-5 minutes.** You'll see a lot of logs - that's normal!

### Step 4: Open the App

Once you see these messages:
```
autodeploy-frontend | ✓ ready in XXXms
autodeploy-backend  | 🚀 AutoDeploy.AI Backend running on port 5000
```

Open your browser and visit:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/health

## 🎮 Try It Out!

### Test with a Sample Repository

1. **Visit** http://localhost:5173
2. **Paste this URL** in the input box:
   ```
   https://github.com/expressjs/express
   ```
3. **Click** "Analyze Repository"
4. **Wait** ~30 seconds while AI analyzes the code
5. **Review** the generated Dockerfile
6. **Click** "Deploy to NodeOps"
7. **Watch** the deployment progress
8. **Explore** the dashboard with logs and metrics

### More Repositories to Try

- **React App**: `https://github.com/facebook/react`
- **Next.js**: `https://github.com/vercel/next.js`
- **Python Flask**: `https://github.com/pallets/flask`
- **Your own repository!**

## 📱 What You'll See

### 1. Landing Page
Beautiful gradient design where you enter GitHub URLs.

### 2. Analysis Page
- Detected programming language
- Framework information
- Generated Dockerfile with syntax highlighting
- "Deploy" button

### 3. Deploy Page
- Animated progress indicator
- Real-time deployment stages
- Success confirmation

### 4. Dashboard
- Live container logs (auto-refreshing)
- CPU, Memory, and Uptime metrics
- Deployment URL
- Container location

## 🛑 Stopping the App

When you're done:

```bash
# Press Ctrl+C in the terminal, then:
docker-compose down
```

To start again later:
```bash
docker-compose up
```

## 🔧 Troubleshooting

### "Port already in use"

Someone else is using port 5173 or 5000. Edit `.env`:

```env
FRONTEND_PORT=5174
BACKEND_PORT=5001
```

Then restart:
```bash
docker-compose down
docker-compose up
```

### "OpenAI API Error"

- ✅ Check your API key is correct in `.env`
- ✅ Ensure you have API credits available
- ✅ Key should start with `sk-`
- ✅ No extra spaces in the `.env` file

### "Database connection failed"

Reset everything:
```bash
docker-compose down -v
docker-compose up --build
```

### "Container failed to start"

Check the logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Still stuck?

1. Check the full [README.md](README.md)
2. Read [QUICKSTART.md](QUICKSTART.md)
3. Open an issue on GitHub

## 💡 Tips & Tricks

### View Logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

### Restart a Single Service
```bash
docker-compose restart backend
```

### Access the Database
```bash
docker-compose exec postgres psql -U autodeploy
```

### Run Backend Locally (without Docker)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Run Frontend Locally (without Docker)
```bash
cd frontend
npm install
npm run dev
```

## 🎓 Understanding the Flow

```
1. User enters GitHub URL
         ↓
2. Backend clones repository
         ↓
3. AI analyzes code structure
         ↓
4. GPT-4 generates Dockerfile
         ↓
5. User clicks "Deploy"
         ↓
6. Mock deployment simulates NodeOps
         ↓
7. Dashboard shows logs & metrics
```

## 📚 What's Next?

- 📖 Read the full [Architecture Documentation](ARCHITECTURE.md)
- 🚀 Learn about [Production Deployment](DEPLOYMENT.md)
- 🤝 Check the [Contributing Guide](CONTRIBUTING.md)
- 🏗️ Explore the [Project Summary](PROJECT_SUMMARY.md)

## 🎉 You're All Set!

Congratulations! You're now running AutoDeploy.AI locally. 

Try analyzing different repositories and see how the AI generates optimized Dockerfiles for various tech stacks!

## ❓ Common Questions

**Q: Is my GitHub repository cloned permanently?**  
A: No, it's cloned to a temporary directory and cleaned up automatically.

**Q: Does this actually deploy to NodeOps?**  
A: Currently it's a simulation. Real NodeOps integration is planned for future releases.

**Q: How much does OpenAI API usage cost?**  
A: Very little - each analysis costs ~$0.01-0.05. New accounts get free credits!

**Q: Can I use this for private repositories?**  
A: Currently only public GitHub repositories are supported.

**Q: Can I customize the generated Dockerfiles?**  
A: Yes! You can copy the generated Dockerfile and modify it as needed.

## 🆘 Need Help?

- 💬 Open a GitHub Issue
- 📧 Check the documentation
- 🔍 Search existing issues

---

**Happy deploying!** 🚀

Made with ❤️ for the NodeOps Hackathon





