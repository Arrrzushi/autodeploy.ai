# 🚀 Quick Start - AutoDeploy.AI

## ✅ Your API is Already Configured!

I've integrated your third-party AI API with these settings:

- **API Key**: `ddc-a4f-9a975b2949cd4161a7577ba02560733a`
- **Base URL**: `https://api.a4f.co/v1`
- **Model**: `provider-1/qwen2.5-coder-32b-instruct` (Qwen Coder - optimized for code generation!)

## 📝 Create Your .env File

Create a file named `.env` in the root directory with this content:

```env
# AutoDeploy.AI Environment Configuration

# ===== AI API Configuration =====
AI_API_KEY=ddc-a4f-9a975b2949cd4161a7577ba02560733a
AI_BASE_URL=https://api.a4f.co/v1
AI_MODEL=provider-1/qwen2.5-coder-32b-instruct

# ===== Database Configuration =====
POSTGRES_USER=autodeploy
POSTGRES_PASSWORD=autodeploy_password
POSTGRES_DB=autodeploy
POSTGRES_PORT=5432
DATABASE_URL=postgresql://autodeploy:autodeploy_password@postgres:5432/autodeploy

# ===== Application Configuration =====
NODE_ENV=development
BACKEND_PORT=5000
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000
```

## 🚀 Run the Application

```bash
docker-compose up --build
```

Wait for all services to start (3-5 minutes first time), then visit:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000/health

## 🧪 Test It!

1. Visit http://localhost:5173
2. Paste this repo: `https://github.com/expressjs/express`
3. Click "Analyze Repository"
4. Watch the AI generate a Dockerfile!
5. Click "Deploy to NodeOps"
6. View the dashboard

## 🎯 What Changed

- Replaced OpenAI with your third-party API
- Using Qwen 2.5 Coder 32B model (excellent for code/Dockerfile generation)
- All AI calls now go to `https://api.a4f.co/v1`
- Your API key is pre-configured

## 🔧 Alternative Models

Want to try a different model? Just change `AI_MODEL` in `.env`:

**Best for Code Generation:**
- `provider-1/qwen2.5-coder-32b-instruct` ← Current (best for Dockerfiles)
- `provider-1/deepseek-v3.1` (excellent reasoning)
- `provider-1/llama-3.3-70b-instruct` (large, powerful)

**Fastest:**
- `provider-3/gpt-4o-mini`
- `provider-1/qwen2.5-coder-7b-instruct`

**Most Creative:**
- `provider-1/deepseek-v3.1`
- `provider-1/llama-4-scout-17b-16e-instruct`

Just restart after changing: `docker-compose restart backend`

---

**Ready to go!** 🎉




