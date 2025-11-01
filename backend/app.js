require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./prisma/client');
const aiRoutes = require('./routes/ai');
const deployRoutes = require('./routes/deploy');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS: reflect dev origins and handle preflight
const devOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]):\d+$/;
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (devOriginRegex.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Prisma connection (logs only)
if (process.env.DATABASE_URL) {
  prisma.$connect()
    .then(() => {
      const url = process.env.DATABASE_URL || '';
      const m = url.match(/@([^/:]+)(?::(\d+))?\/([^?]+)/);
      const info = m ? `${m[1]}${m[2] ? ':' + m[2] : ''}/${m[3]}` : 'database';
      console.log(`Prisma connected to ${info}`);
    })
    .catch((err) => {
      console.error('Prisma connection failed:', err.message);
    });
}

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', aiRoutes);
app.use('/api', deployRoutes);
app.use('/api', logsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, async () => {
  console.log(`🚀 AutoDeploy.AI Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    await prisma.$connect();
    const url = process.env.DATABASE_URL || '';
    const m = url.match(/@([^/:]+)(?::(\d+))?\/([^?]+)/);
    const info = m ? `${m[1]}${m[2] ? ':' + m[2] : ''}/${m[3]}` : 'database';
    console.log(`✅ Prisma connected to ${info}`);
  } catch (err) {
    console.error('❌ Prisma connection failed:', err?.message || err);
  }
});