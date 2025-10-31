# Contributing to AutoDeploy.AI

Thank you for considering contributing to AutoDeploy.AI! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/autodeploy-ai.git
   cd autodeploy-ai
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- OpenAI API Key

### Local Development

1. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd frontend && npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Run with Docker**
   ```bash
   docker-compose up
   ```

   OR run separately:
   ```bash
   # Terminal 1 - Database
   docker run -p 5432:5432 -e POSTGRES_PASSWORD=autodeploy_password postgres:15-alpine
   
   # Terminal 2 - Backend
   cd backend
   npx prisma migrate dev
   npm run dev
   
   # Terminal 3 - Frontend
   cd frontend
   npm run dev
   ```

## 📝 Code Style

### Backend (Node.js)
- Use ES6+ features
- Follow Express.js best practices
- Add JSDoc comments for functions
- Use async/await for promises
- Handle errors properly

### Frontend (React/TypeScript)
- Use TypeScript strict mode
- Follow React hooks best practices
- Use functional components
- Proper prop typing
- Use Tailwind CSS for styling

### General
- Meaningful variable and function names
- Keep functions small and focused
- Write comments for complex logic
- Follow the existing code structure

## 🧪 Testing

Before submitting:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run build  # Ensure it builds
```

## 📥 Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in deployment"
   git commit -m "docs: update README"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create Pull Request** with:
   - Clear title and description
   - Screenshots (if UI changes)
   - Related issue number

## 🐛 Bug Reports

When filing an issue, include:
- **Description**: Clear and concise
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Environment**: OS, Node version, etc.
- **Screenshots** (if applicable)

## 💡 Feature Requests

We love new ideas! When suggesting features:
- Explain the use case
- Describe the expected behavior
- Consider implementation complexity
- Check if it aligns with project goals

## 🔍 Code Review

All submissions require review. We look for:
- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Security considerations

## 📜 Commit Message Guidelines

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting changes
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

## 🎯 Areas for Contribution

### High Priority
- Real NodeOps API integration
- User authentication (Supabase)
- Additional language support
- Performance optimizations

### Medium Priority
- Template library
- Deployment history
- Cost estimation
- Better error handling

### Good First Issues
- UI/UX improvements
- Documentation enhancements
- Test coverage
- Code cleanup

## 🤝 Community

- Be respectful and constructive
- Help others when you can
- Share knowledge and learnings
- Give credit where due

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AutoDeploy.AI! 🚀





