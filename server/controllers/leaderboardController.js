const { leaderboard } = require('../db/database');

/**
 * GET /api/leaderboard
 * Query top 50 ranked players, deduplicated by player_id, sorted by net_worth DESC
 */
function getLeaderboard(req, res) {
  try {
    const rawLimit = parseInt(req.query.limit || '50', 10);
    const limit = isNaN(rawLimit) ? 50 : Math.max(1, Math.min(rawLimit, 100));

    const entries = leaderboard.getTop(limit);

    return res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (err) {
    console.error('[LeaderboardController.getLeaderboard] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể tải bảng xếp hạng: ' + err.message
    });
  }
}

/**
 * POST /api/leaderboard/submit
 * Authenticated endpoint to insert or update player's entry in leaderboard atomically
 */
function submitScore(req, res) {
  try {
    const playerId = req.player.id;
    const body = req.body || {};

    const displayName = (body.displayName && String(body.displayName).trim()) || req.player.displayName || 'Tỷ Phú Ẩn Danh';
    const age = parseInt(body.age || '18', 10);
    const generation = parseInt(body.generation || '1', 10);
    const currentJob = body.currentJob ? String(body.currentJob).slice(0, 64) : 'Chưa đi làm';
    const netWorth = typeof body.netWorth === 'number' ? body.netWorth : parseFloat(body.netWorth || 0);
    const peakNetWorth = typeof body.peakNetWorth === 'number' ? body.peakNetWorth : (body.peakNetWorth ? parseFloat(body.peakNetWorth) : null);
    const isVip = req.player.isVip ? 1 : (body.isVip ? 1 : 0);
    const isAlive = body.isAlive !== undefined ? (body.isAlive ? 1 : 0) : 1;

    // Basic bounds validation
    if (isNaN(netWorth) || isNaN(age)) {
      return res.status(400).json({
        success: false,
        error: 'Giá trị tài sản ròng hoặc tuổi không hợp lệ'
      });
    }

    const updatedEntry = leaderboard.submit({
      playerId,
      displayName,
      age: Math.max(0, Math.min(age, 200)),
      generation: Math.max(1, generation),
      currentJob,
      netWorth,
      peakNetWorth,
      isVip,
      isAlive
    });

    return res.json({
      success: true,
      entry: {
        playerId: updatedEntry.player_id,
        displayName: updatedEntry.display_name,
        age: updatedEntry.age,
        generation: updatedEntry.generation,
        currentJob: updatedEntry.current_job,
        netWorth: updatedEntry.net_worth,
        peakNetWorth: updatedEntry.peak_net_worth,
        isVip: Boolean(updatedEntry.is_vip),
        isAlive: Boolean(updatedEntry.is_alive),
        submittedAt: updatedEntry.submitted_at
      }
    });
  } catch (err) {
    console.error('[LeaderboardController.submitScore] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Không thể ghi nhận điểm xếp hạng: ' + err.message
    });
  }
}

module.exports = {
  getLeaderboard,
  submitScore
};
