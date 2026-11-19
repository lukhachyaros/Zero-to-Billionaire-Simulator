const path = require('path');

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',

  // Database path: defaults to server/data/ztb.sqlite
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '..', 'data', 'ztb.sqlite'),

  // Security & Authentication
  tokenSecret: process.env.JWT_SECRET || process.env.TOKEN_SECRET || 'ztb_token_secret_vault_secure_key_2026',
  sessionDurationMs: parseInt(process.env.SESSION_DURATION_MS || String(30 * 24 * 60 * 60 * 1000), 10), // 30 days

  // Default Admin credentials (for traffic dashboard in M4/M5)
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'ZTB@Admin2026!',

  // Web directory path for static asset hosting
  webDir: process.env.WEB_DIR || path.resolve(__dirname, '..', '..', 'web'),

  // Sync Code specification: ZTB-XXXX-XXXX
  syncCode: {
    prefix: 'ZTB',
    // Unambiguous uppercase alphanumeric characters (excluding 0, O, 1, I to prevent human transcription errors)
    charset: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
    segmentLength: 4,
    segments: 2 // Generates ZTB-XXXX-XXXX
  }
};

module.exports = config;
