const { sessions, players } = require('../db/database');

/**
 * Middleware to require a valid Bearer token.
 * Extracts token, validates session, and attaches req.session and req.player.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers['x-ztb-token']) {
    token = req.headers['x-ztb-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Yêu cầu đăng nhập: Không tìm thấy mã xác thực (Bearer token)'
    });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn'
    });
  }

  // Update last active timestamp
  players.updateLastActive(session.player_id);

  req.session = session;
  req.player = {
    id: session.player_id,
    username: session.username,
    displayName: session.display_name,
    syncCode: session.sync_code,
    isVip: Boolean(session.is_vip),
    createdAt: session.player_created_at
  };

  next();
}

/**
 * Optional authentication middleware.
 * Attaches player and session if valid token is provided, but does not block if not.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers['x-ztb-token']) {
    token = req.headers['x-ztb-token'];
  }

  if (token) {
    const session = sessions.get(token);
    if (session) {
      players.updateLastActive(session.player_id);
      req.session = session;
      req.player = {
        id: session.player_id,
        username: session.username,
        displayName: session.display_name,
        syncCode: session.sync_code,
        isVip: Boolean(session.is_vip),
        createdAt: session.player_created_at
      };
    }
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
