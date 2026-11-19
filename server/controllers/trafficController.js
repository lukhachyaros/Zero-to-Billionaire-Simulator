const db = require('../db/database');
const {
  checkLockout,
  recordLoginAttempt,
  verifyAdminCredentials,
  createAdminSession,
  revokeAdminSession,
  extractAdminToken
} = require('../middleware/adminAuth');

/**
 * Extract normalized client IP for rate limiting
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || req.ip || '127.0.0.1';
}

const trafficController = {
  /**
   * POST /api/admin/login
   * Admin authentication with brute-force lockout and constant-time check
   */
  async login(req, res) {
    const clientIp = getClientIp(req);

    // 1. Check if IP is already locked out
    const lockoutStatus = checkLockout(clientIp);
    if (lockoutStatus.isLocked) {
      res.setHeader('Retry-After', lockoutStatus.remainingSeconds);
      return res.status(429).json({
        success: false,
        error: `Tài khoản bị tạm khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau ${lockoutStatus.remainingSeconds} giây.`,
        retryAfter: lockoutStatus.remainingSeconds
      });
    }

    const { password } = req.body || {};

    // 2. Validate input
    if (!password || typeof password !== 'string') {
      const attemptRes = recordLoginAttempt(clientIp, false);
      if (attemptRes.isLocked) {
        res.setHeader('Retry-After', attemptRes.remainingSeconds);
        return res.status(429).json({
          success: false,
          error: `Tài khoản bị khóa trong 15 phút do 5 lần nhập sai liên tiếp.`,
          retryAfter: attemptRes.remainingSeconds
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp mật khẩu quản trị viên (password is required).',
        attemptsRemaining: attemptRes.attemptsRemaining
      });
    }

    // 3. Constant-time password verification
    const isValid = verifyAdminCredentials(password);

    if (!isValid) {
      const attemptRes = recordLoginAttempt(clientIp, false);
      if (attemptRes.isLocked) {
        res.setHeader('Retry-After', attemptRes.remainingSeconds);
        return res.status(429).json({
          success: false,
          error: `Tài khoản bị tạm khóa 15 phút do 5 lần nhập sai liên tiếp.`,
          retryAfter: attemptRes.remainingSeconds
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Mật khẩu quản trị viên không chính xác.',
        attemptsRemaining: attemptRes.attemptsRemaining
      });
    }

    // 4. Successful login: reset lockout & create session
    recordLoginAttempt(clientIp, true);
    const session = createAdminSession(req.headers['user-agent'] || 'Browser');

    // Issue HTTP-only admin cookie (24 hours)
    res.setHeader(
      'Set-Cookie',
      `ztb_admin_token=${encodeURIComponent(session.token)}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`
    );

    return res.json({
      success: true,
      message: 'Đăng nhập trang quản trị thành công.',
      token: session.token,
      expiresAt: session.expiresAt
    });
  },

  /**
   * POST /api/admin/logout
   */
  async logout(req, res) {
    const token = extractAdminToken(req);
    if (token) {
      revokeAdminSession(token);
    }

    // Clear admin cookie
    res.setHeader(
      'Set-Cookie',
      'ztb_admin_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    );

    return res.json({
      success: true,
      message: 'Đã đăng xuất khỏi phiên quản trị.'
    });
  },

  /**
   * GET /api/admin/me
   */
  async getMe(req, res) {
    return res.json({
      success: true,
      authenticated: true,
      session: {
        createdAt: req.adminSession.createdAt,
        expiresAt: req.adminSession.expiresAt
      }
    });
  },

  /**
   * GET /api/admin/traffic/summary
   * Active sessions, today's unique visitors, page views, avg latency, error rate
   */
  async getSummary(req, res) {
    try {
      const metrics = db.traffic.getSummaryMetrics();
      return res.json({
        success: true,
        ...metrics
      });
    } catch (err) {
      console.error('[TrafficController] getSummary error:', err);
      return res.status(500).json({
        success: false,
        error: 'Lỗi máy chủ khi lấy dữ liệu tổng quan truy cập: ' + err.message
      });
    }
  },

  /**
   * GET /api/admin/traffic/timeseries?hours=24
   */
  async getTimeseries(req, res) {
    try {
      const hoursParam = parseInt(req.query.hours || '24', 10);
      const hours = Math.max(1, Math.min(hoursParam, 168)); // 1 hour to 7 days
      const timeseries = db.traffic.getTimeseries(hours);

      return res.json({
        success: true,
        hours,
        timeseries
      });
    } catch (err) {
      console.error('[TrafficController] getTimeseries error:', err);
      return res.status(500).json({
        success: false,
        error: 'Lỗi máy chủ khi lấy dữ liệu biểu đồ truy cập: ' + err.message
      });
    }
  },

  /**
   * GET /api/admin/traffic/breakdown
   */
  async getBreakdown(req, res) {
    try {
      const breakdown = db.traffic.getBreakdown(24);
      return res.json({
        success: true,
        ...breakdown
      });
    } catch (err) {
      console.error('[TrafficController] getBreakdown error:', err);
      return res.status(500).json({
        success: false,
        error: 'Lỗi máy chủ khi phân tích thiết bị và nguồn truy cập: ' + err.message
      });
    }
  },

  /**
   * GET /api/admin/traffic/live-logs?limit=50
   */
  async getLiveLogs(req, res) {
    try {
      const limitParam = parseInt(req.query.limit || '50', 10);
      const limit = Math.max(5, Math.min(limitParam, 200));
      const logs = db.traffic.getLiveLogs(limit);

      return res.json({
        success: true,
        count: logs.length,
        logs
      });
    } catch (err) {
      console.error('[TrafficController] getLiveLogs error:', err);
      return res.status(500).json({
        success: false,
        error: 'Lỗi máy chủ khi lấy nhật ký yêu cầu thời gian thực: ' + err.message
      });
    }
  }
};

module.exports = trafficController;
