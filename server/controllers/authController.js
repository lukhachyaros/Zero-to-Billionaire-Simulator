const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { players, sessions, gameSaves, normalizeSyncCode } = require('../db/database');

/**
 * POST /api/auth/guest
 * Create an instant anonymous guest player account with a 10-char Sync Code
 */
function createGuest(req, res) {
  try {
    const rawDisplayName = req.body && req.body.displayName ? String(req.body.displayName).trim() : '';
    const displayName = rawDisplayName && rawDisplayName.length >= 2 && rawDisplayName.length <= 32
      ? rawDisplayName
      : 'Khách ' + Math.floor(1000 + Math.random() * 9000);

    const deviceFingerprint = req.body && req.body.deviceFingerprint ? String(req.body.deviceFingerprint).slice(0, 256) : null;
    const deviceLabel = req.body && req.body.deviceLabel ? String(req.body.deviceLabel).slice(0, 100) : req.headers['user-agent']?.slice(0, 100) || 'Unknown Device';

    const playerId = crypto.randomUUID();
    const username = `guest_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;

    const newPlayer = players.create({
      id: playerId,
      username,
      displayName,
      deviceFingerprint
    });

    const session = sessions.create({
      playerId: newPlayer.id,
      deviceLabel
    });

    return res.status(201).json({
      success: true,
      token: session.token,
      playerId: newPlayer.id,
      syncCode: newPlayer.sync_code,
      displayName: newPlayer.display_name,
      username: newPlayer.username
    });
  } catch (err) {
    console.error('[AuthController.createGuest] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể khởi tạo tài khoản khách: ' + err.message
    });
  }
}

/**
 * POST /api/auth/sync-device
 * Cross-device resume: authenticate with syncCode, issue new session token and return latest save (slot 0)
 */
function syncDevice(req, res) {
  try {
    const rawCode = req.body && req.body.syncCode ? String(req.body.syncCode).trim() : '';
    if (!rawCode) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp mã đồng bộ thiết bị (Sync Code)'
      });
    }

    const player = players.getBySyncCode(rawCode);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Mã đồng bộ không tồn tại hoặc không hợp lệ'
      });
    }

    const deviceLabel = req.body && req.body.deviceLabel
      ? String(req.body.deviceLabel).slice(0, 100)
      : req.headers['user-agent']?.slice(0, 100) || 'Linked Device';

    // Create a new session for this device
    const session = sessions.create({
      playerId: player.id,
      deviceLabel
    });

    // Update last active
    players.updateLastActive(player.id);

    // Fetch latest cloud save (slot 0 auto-save)
    const latestSaveRow = gameSaves.getBySlot(player.id, 0);
    const latestSave = latestSaveRow ? {
      slot: latestSaveRow.slot,
      characterName: latestSaveRow.character_name,
      age: latestSaveRow.age,
      generation: latestSaveRow.generation,
      currentJob: latestSaveRow.current_job,
      netWorth: latestSaveRow.net_worth,
      peakNetWorth: latestSaveRow.peak_net_worth,
      isAlive: Boolean(latestSaveRow.is_alive),
      saveData: latestSaveRow.parsedData || latestSaveRow.save_data_json,
      updatedAt: latestSaveRow.updated_at
    } : null;

    return res.json({
      success: true,
      token: session.token,
      playerId: player.id,
      displayName: player.display_name,
      syncCode: player.sync_code,
      latestSave
    });
  } catch (err) {
    console.error('[AuthController.syncDevice] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Lỗi đồng bộ thiết bị: ' + err.message
    });
  }
}

/**
 * POST /api/auth/set-pin
 * Authenticated endpoint to set a PIN or password for the account
 */
function setPin(req, res) {
  try {
    const rawPin = req.body && (req.body.pin || req.body.password);
    if (!rawPin || typeof rawPin !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp mã PIN (4-12 ký tự)'
      });
    }

    const pin = rawPin.trim();
    if (pin.length < 4 || pin.length > 32) {
      return res.status(400).json({
        success: false,
        error: 'Mã PIN hoặc mật khẩu phải từ 4 đến 32 ký tự'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pin, salt);

    players.setPassword(req.player.id, hash);

    return res.json({
      success: true,
      message: 'Mã PIN bảo mật đã được thiết lập thành công'
    });
  } catch (err) {
    console.error('[AuthController.setPin] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể thiết lập mã PIN: ' + err.message
    });
  }
}

/**
 * POST /api/auth/login
 * Login using Sync Code or Username + PIN
 */
function login(req, res) {
  try {
    const identifier = req.body && (req.body.identifier || req.body.username || req.body.syncCode);
    const rawPin = req.body && (req.body.pin || req.body.password);

    if (!identifier || !rawPin) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập mã đồng bộ/tên đăng nhập và mã PIN'
      });
    }

    let player = players.getBySyncCode(identifier);
    if (!player) {
      player = players.getByUsername(identifier);
    }

    if (!player || !player.password_hash) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản không tồn tại hoặc chưa thiết lập mã PIN'
      });
    }

    const valid = bcrypt.compareSync(String(rawPin).trim(), player.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Mã PIN hoặc thông tin đăng nhập không chính xác'
      });
    }

    const deviceLabel = req.body && req.body.deviceLabel
      ? String(req.body.deviceLabel).slice(0, 100)
      : req.headers['user-agent']?.slice(0, 100) || 'Web Login';

    const session = sessions.create({
      playerId: player.id,
      deviceLabel
    });

    players.updateLastActive(player.id);

    return res.json({
      success: true,
      token: session.token,
      playerId: player.id,
      displayName: player.display_name,
      syncCode: player.sync_code
    });
  } catch (err) {
    console.error('[AuthController.login] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Lỗi đăng nhập: ' + err.message
    });
  }
}

/**
 * GET /api/player/me
 * Authenticated endpoint returning current player profile and sync code
 */
function getProfile(req, res) {
  try {
    const player = players.getById(req.player.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người chơi'
      });
    }

    return res.json({
      success: true,
      player: {
        id: player.id,
        username: player.username,
        displayName: player.display_name,
        syncCode: player.sync_code,
        hasPin: Boolean(player.password_hash),
        isVip: Boolean(player.is_vip),
        createdAt: player.created_at,
        lastActiveAt: player.last_active_at
      }
    });
  } catch (err) {
    console.error('[AuthController.getProfile] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Lỗi truy xuất thông tin: ' + err.message
    });
  }
}

/**
 * PUT /api/player/name
 * Authenticated endpoint to update player display name
 */
function updateName(req, res) {
  try {
    const rawName = req.body && req.body.displayName ? String(req.body.displayName).trim() : '';
    if (!rawName || rawName.length < 2 || rawName.length > 32) {
      return res.status(400).json({
        success: false,
        error: 'Tên hiển thị phải từ 2 đến 32 ký tự'
      });
    }

    const updated = players.updateDisplayName(req.player.id, rawName);
    return res.json({
      success: true,
      displayName: updated.display_name
    });
  } catch (err) {
    console.error('[AuthController.updateName] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể cập nhật tên: ' + err.message
    });
  }
}

/**
 * POST /api/auth/logout
 * Authenticated endpoint to revoke current session
 */
function logout(req, res) {
  try {
    if (req.session && req.session.token) {
      sessions.delete(req.session.token);
    }
    return res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (err) {
    console.error('[AuthController.logout] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Lỗi đăng xuất: ' + err.message
    });
  }
}

module.exports = {
  createGuest,
  syncDevice,
  setPin,
  login,
  getProfile,
  updateName,
  logout
};
