const crypto = require('crypto');
const config = require('../config');
const { parseCookies } = require('./trafficTracker');

// Lockout settings
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory lockout tracker: Map<string, { attempts: number[], lockedUntil: number }>
const lockoutMap = new Map();

// In-memory admin session storage: Map<string, { token: string, createdAt: number, expiresAt: number }>
const adminSessions = new Map();

/**
 * Constant-time string comparison using crypto.timingSafeEqual
 * Protects against timing attacks by ensuring comparison takes uniform time.
 */
function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    // Prevent timing side-channel: execute comparison against dummy buffer of equal length
    const dummy = Buffer.alloc(bufA.length);
    crypto.timingSafeEqual(bufA, dummy);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Clean expired entries from memory stores
 */
function cleanExpiredState() {
  const now = Date.now();
  // Clean lockouts
  for (const [ip, entry] of lockoutMap.entries()) {
    if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
      lockoutMap.delete(ip);
    } else {
      entry.attempts = entry.attempts.filter(t => now - t <= LOCKOUT_WINDOW_MS);
      if (entry.attempts.length === 0 && entry.lockedUntil === 0) {
        lockoutMap.delete(ip);
      }
    }
  }

  // Clean sessions
  for (const [token, sess] of adminSessions.entries()) {
    if (sess.expiresAt <= now) {
      adminSessions.delete(token);
    }
  }
}

/**
 * Check if an IP address is currently locked out
 */
function checkLockout(ip) {
  cleanExpiredState();
  const entry = lockoutMap.get(ip);
  if (!entry) return { isLocked: false, remainingSeconds: 0 };

  const now = Date.now();
  if (entry.lockedUntil > now) {
    const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Record a login attempt for rate-limiting and brute-force defense
 */
function recordLoginAttempt(ip, success) {
  cleanExpiredState();
  if (success) {
    lockoutMap.delete(ip);
    return { isLocked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS };
  }

  const now = Date.now();
  let entry = lockoutMap.get(ip);
  if (!entry) {
    entry = { attempts: [], lockedUntil: 0 };
    lockoutMap.set(ip, entry);
  }

  entry.attempts.push(now);
  // Keep only attempts within window
  entry.attempts = entry.attempts.filter(t => now - t <= LOCKOUT_WINDOW_MS);

  if (entry.attempts.length >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
    return { isLocked: true, remainingSeconds, attemptsRemaining: 0 };
  }

  const attemptsRemaining = MAX_FAILED_ATTEMPTS - entry.attempts.length;
  return { isLocked: false, attemptsRemaining, remainingSeconds: 0 };
}

/**
 * Create a new cryptographically secure admin session token
 */
function createAdminSession(deviceLabel = 'Admin Dashboard') {
  cleanExpiredState();
  const token = `adm_${crypto.randomBytes(32).toString('hex')}`;
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;

  const session = {
    token,
    deviceLabel,
    createdAt: now,
    expiresAt
  };

  adminSessions.set(token, session);
  return session;
}

/**
 * Revoke an existing admin session
 */
function revokeAdminSession(token) {
  if (token) {
    adminSessions.delete(token);
  }
}

/**
 * Validate an admin token
 */
function validateAdminSession(token) {
  if (!token) return null;
  const session = adminSessions.get(token);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return null;
  }

  return session;
}

/**
 * Helper to extract admin token from Request headers or cookies
 */
function extractAdminToken(req) {
  // 1. Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }

  // 2. Cookie: ztb_admin_token
  const cookies = parseCookies(req.headers['cookie']);
  if (cookies['ztb_admin_token']) {
    return cookies['ztb_admin_token'];
  }

  return null;
}

/**
 * Express middleware to protect Admin API routes
 */
function requireAdminAuth(req, res, next) {
  const token = extractAdminToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Yêu cầu quyền quản trị viên (Admin Unauthorized). Vui lòng đăng nhập.'
    });
  }

  const session = validateAdminSession(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Phiên quản trị viên đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'
    });
  }

  req.adminSession = session;
  next();
}

/**
 * Helper to verify password using constant-time check
 */
function verifyAdminCredentials(inputPassword) {
  const expectedPassword = config.adminPassword;
  return constantTimeCompare(inputPassword || '', expectedPassword);
}

module.exports = {
  constantTimeCompare,
  checkLockout,
  recordLoginAttempt,
  createAdminSession,
  revokeAdminSession,
  validateAdminSession,
  extractAdminToken,
  requireAdminAuth,
  verifyAdminCredentials,
  lockoutMap,
  adminSessions,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MS
};
