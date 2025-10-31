# Backend Dockerfile - Multi-stage build for AutoDeploy.AI
FROM node:18-alpine AS base

# Install OpenSSL for Prisma, Git for cloning repos, and Docker CLI for real builds
RUN apk add --no-cache openssl libc6-compat git docker-cli

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

# Development dependencies for Prisma
FROM base AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

# Change ownership
RUN chown -R appuser:nodejs /app

USER appuser

EXPOSE 5000

CMD ["node", "app.js"]


