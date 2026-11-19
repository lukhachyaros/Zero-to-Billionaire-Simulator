const crypto = require('crypto');
const { gameSaves, leaderboard } = require('../db/database');

/**
 * GET /api/save
 * Fetch latest auto-save (slot 0) or requested slot for the authenticated player
 */
function getSave(req, res) {
  try {
    const slot = parseInt(req.query.slot || '0', 10);
    const row = gameSaves.getBySlot(req.player.id, slot);

    if (!row) {
      return res.status(404).json({
        success: false,
        error: `Không tìm thấy bản lưu ở vị trí ${slot}`
      });
    }

    return res.json({
      success: true,
      slot: row.slot,
      characterName: row.character_name,
      age: row.age,
      generation: row.generation,
      currentJob: row.current_job,
      netWorth: row.net_worth,
      peakNetWorth: row.peak_net_worth,
      isAlive: Boolean(row.is_alive),
      saveData: row.parsedData || row.save_data_json,
      saveVersion: row.save_version,
      updatedAt: row.updated_at
    });
  } catch (err) {
    console.error('[SaveController.getSave] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể tải bản lưu: ' + err.message
    });
  }
}

/**
 * POST /api/save
 * Save game snapshot to database and update leaderboard entry atomically
 */
function postSave(req, res) {
  try {
    const body = req.body || {};
    const slot = parseInt(body.slot !== undefined ? body.slot : '0', 10);
    const characterName = String(body.characterName || req.player.displayName || 'Tỷ Phú Ẩn Danh').trim();
    const age = parseInt(body.age !== undefined ? body.age : '18', 10);
    const generation = parseInt(body.generation || '1', 10);
    const currentJob = String(body.currentJob || 'Chưa đi làm').slice(0, 64);
    const netWorth = typeof body.netWorth === 'number' ? body.netWorth : parseFloat(body.netWorth || 0);
    const peakNetWorth = typeof body.peakNetWorth === 'number' ? body.peakNetWorth : (body.peakNetWorth ? parseFloat(body.peakNetWorth) : netWorth);
    const isAlive = body.isAlive !== undefined ? (body.isAlive ? 1 : 0) : 1;
    const saveVersion = parseInt(body.saveVersion || '2', 10);
    const saveData = body.saveData !== undefined ? body.saveData : {};

    if (isNaN(netWorth) || isNaN(age)) {
      return res.status(400).json({
        success: false,
        error: 'Giá trị netWorth hoặc age không hợp lệ'
      });
    }

    const savedRow = gameSaves.save({
      playerId: req.player.id,
      slot,
      characterName,
      age,
      generation,
      currentJob,
      netWorth,
      peakNetWorth,
      isAlive,
      saveDataJson: saveData,
      saveVersion
    });

    // Also atomically update the player's leaderboard entry
    leaderboard.submit({
      playerId: req.player.id,
      displayName: characterName,
      age,
      generation,
      currentJob,
      netWorth,
      peakNetWorth,
      isVip: req.player.isVip ? 1 : 0,
      isAlive
    });

    return res.json({
      success: true,
      slot: savedRow.slot,
      savedAt: savedRow.updated_at
    });
  } catch (err) {
    console.error('[SaveController.postSave] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể lưu tiến trình trò chơi: ' + err.message
    });
  }
}

/**
 * GET /api/save/slots
 * List summary metadata for all slots (0..3) of the authenticated player
 */
function listSlots(req, res) {
  try {
    const rows = gameSaves.getAllByPlayer(req.player.id);
    const slots = rows.map(r => ({
      slot: r.slot,
      characterName: r.character_name,
      age: r.age,
      generation: r.generation,
      currentJob: r.current_job,
      netWorth: r.net_worth,
      peakNetWorth: r.peak_net_worth,
      isAlive: Boolean(r.is_alive),
      updatedAt: r.updated_at
    }));

    return res.json({
      success: true,
      slots
    });
  } catch (err) {
    console.error('[SaveController.listSlots] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể liệt kê danh sách bản lưu: ' + err.message
    });
  }
}

module.exports = {
  getSave,
  postSave,
  listSlots
};
