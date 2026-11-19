const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const db = require('./db/database');

const authRoutes = require('./routes/authRoutes');
const playerRoutes = require('./routes/playerRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const saveRoutes = require('./routes/saveRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { trafficTracker } = require('./middleware/trafficTracker');

const app = express();

// Initialize database
db.initDatabase();

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Global Traffic Monitoring Middleware (Requirement R3)
app.use(trafficTracker);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    service: 'Zero to Billionaire Backend API',
    database: 'sqlite-wal'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/save', saveRoutes);
app.use('/api/admin', adminRoutes);

// Static Web Assets & Admin Dashboard Route
const webDir = path.resolve(__dirname, '..', 'web');
const rootDir = path.resolve(__dirname, '..');

// Administrative Dashboard Route
app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(webDir, 'admin.html'));
});
app.get('/admin.html', (req, res) => {
  res.sendFile(path.resolve(webDir, 'admin.html'));
});

app.use('/web', express.static(webDir));
app.use(express.static(webDir));
app.use(express.static(rootDir, { index: 'index.html' }));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Đường dẫn API không tồn tại: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Lỗi máy chủ nội bộ: ' + (err.message || 'Unknown error')
  });
});

let server = null;

function startServer(port = config.port) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`[ZTB Server] Running on http://${config.host}:${port}`);
      console.log(`[ZTB Server] Static web dir: ${webDir}`);
      console.log(`[ZTB Server] SQLite DB: ${config.dbPath}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        db.close();
        server = null;
        resolve();
      });
    } else {
      db.close();
      resolve();
    }
  });
}

// Graceful shutdown listeners
process.on('SIGINT', () => {
  console.log('\n[ZTB Server] Received SIGINT. Shutting down gracefully...');
  stopServer().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('\n[ZTB Server] Received SIGTERM. Shutting down gracefully...');
  stopServer().then(() => process.exit(0));
});

// Auto-start when executed directly
if (require.main === module) {
  startServer().catch(err => {
    console.error('[ZTB Server] Failed to start:', err);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
  stopServer
};
