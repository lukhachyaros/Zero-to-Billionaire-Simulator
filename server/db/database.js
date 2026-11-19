const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');

let db = null;
let statements = null;

/**
 * Generate a cryptographically secure random Sync Code: ZTB-XXXX-XXXX
 * Uses unambiguous charset: 23456789ABCDEFGHJKLMNPQRSTUVWXYZ (no 0/O, 1/I)
 */
function generateSyncCode() {
  const charset = config.syncCode.charset;
  const len = charset.length;
  const bytes = crypto.randomBytes(8);
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += charset[bytes[i] % len];
    p2 += charset[bytes[i + 4] % len];
  }
  return `${config.syncCode.prefix}-${p1}-${p2}`;
}

/**
 * Normalize sync code input (handle casing, hyphens, and missing prefix)
 */
function normalizeSyncCode(code) {
  if (!code || typeof code !== 'string') return '';
  let clean = code.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  if (clean.startsWith('ZTB')) {
    clean = clean.slice(3);
  }
  if (clean.length === 8) {
    return `${config.syncCode.prefix}-${clean.slice(0, 4)}-${clean.slice(4)}`;
  }
  return code.toUpperCase().trim();
}

/**
 * Initialize SQLite database connection, PRAGMAs, and schema DDL
 */
function initDatabase(customDbPath = null) {
  const targetPath = customDbPath || config.dbPath;

  if (targetPath !== ':memory:') {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  db = new DatabaseSync(targetPath);

  // Apply PRAGMAs
  try {
    if (targetPath !== ':memory:') {
      db.exec('PRAGMA journal_mode = WAL;');
    }
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA synchronous = NORMAL;');
  } catch (err) {
    // WAL can throw in-memory or on certain virtual filesystems; ignore if non-fatal
    console.warn('[DB] Warning setting PRAGMA:', err.message);
  }

  // Load and apply schema
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);

  // Ensure traffic_logs has the required columns for M4 telemetry (migration for existing DBs)
  try {
    const tableInfo = db.prepare('PRAGMA table_info(traffic_logs)').all();
    const existingCols = new Set(tableInfo.map(c => c.name));
    if (!existingCols.has('visitor_id')) {
      db.exec('ALTER TABLE traffic_logs ADD COLUMN visitor_id TEXT;');
    }
    if (!existingCols.has('device_type')) {
      db.exec("ALTER TABLE traffic_logs ADD COLUMN device_type TEXT DEFAULT 'desktop';");
    }
    if (!existingCols.has('is_page_view')) {
      db.exec('ALTER TABLE traffic_logs ADD COLUMN is_page_view INTEGER DEFAULT 0;');
    }
    if (!existingCols.has('is_bot')) {
      db.exec('ALTER TABLE traffic_logs ADD COLUMN is_bot INTEGER DEFAULT 0;');
    }
  } catch (err) {
    console.warn('[DB] Warning checking/migrating traffic_logs columns:', err.message);
  }

  // Prepare queries for high performance & SQL injection defense
  statements = {
    // Players
    insertPlayer: db.prepare(`
      INSERT INTO players (
        id, username, display_name, sync_code, password_hash,
        is_vip, device_fingerprint, created_at, updated_at, last_active_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    getPlayerById: db.prepare('SELECT * FROM players WHERE id = ?'),
    getPlayerByUsername: db.prepare('SELECT * FROM players WHERE username = ? COLLATE NOCASE'),
    getPlayerBySyncCode: db.prepare('SELECT * FROM players WHERE sync_code = ?'),
    updateDisplayName: db.prepare('UPDATE players SET display_name = ?, updated_at = ? WHERE id = ?'),
    updateLastActive: db.prepare('UPDATE players SET last_active_at = ? WHERE id = ?'),
    updatePasswordHash: db.prepare('UPDATE players SET password_hash = ?, updated_at = ? WHERE id = ?'),
    updateVipStatus: db.prepare('UPDATE players SET is_vip = ?, updated_at = ? WHERE id = ?'),
    checkSyncCode: db.prepare('SELECT 1 FROM players WHERE sync_code = ? LIMIT 1'),

    // Sessions
    insertSession: db.prepare(`
      INSERT INTO player_sessions (token, player_id, device_label, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `),
    getSession: db.prepare(`
      SELECT s.*, p.username, p.display_name, p.sync_code, p.is_vip, p.created_at AS player_created_at
      FROM player_sessions s
      JOIN players p ON s.player_id = p.id
      WHERE s.token = ? AND s.expires_at > ?
    `),
    deleteSession: db.prepare('DELETE FROM player_sessions WHERE token = ?'),
    deletePlayerSessions: db.prepare('DELETE FROM player_sessions WHERE player_id = ?'),
    cleanExpiredSessions: db.prepare('DELETE FROM player_sessions WHERE expires_at <= ?'),

    // Game Saves
    upsertSave: db.prepare(`
      INSERT INTO game_saves (
        id, player_id, slot, character_name, age, generation,
        current_job, net_worth, peak_net_worth, is_alive,
        save_data_json, save_version, checksum, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(player_id, slot) DO UPDATE SET
        character_name = excluded.character_name,
        age = excluded.age,
        generation = excluded.generation,
        current_job = excluded.current_job,
        net_worth = excluded.net_worth,
        peak_net_worth = MAX(game_saves.peak_net_worth, excluded.peak_net_worth),
        is_alive = excluded.is_alive,
        save_data_json = excluded.save_data_json,
        save_version = excluded.save_version,
        checksum = excluded.checksum,
        updated_at = excluded.updated_at
    `),
    getSaveBySlot: db.prepare('SELECT * FROM game_saves WHERE player_id = ? AND slot = ?'),
    getSavesByPlayer: db.prepare('SELECT * FROM game_saves WHERE player_id = ? ORDER BY slot ASC'),
    deleteSave: db.prepare('DELETE FROM game_saves WHERE player_id = ? AND slot = ?'),

    // Leaderboard (Deduplicated 100% - one entry per player_id)
    upsertLeaderboard: db.prepare(`
      INSERT INTO leaderboard (
        player_id, display_name, age, generation, current_job,
        net_worth, peak_net_worth, is_vip, is_alive, last_active_at, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(player_id) DO UPDATE SET
        display_name = excluded.display_name,
        age = excluded.age,
        generation = excluded.generation,
        current_job = excluded.current_job,
        net_worth = excluded.net_worth,
        peak_net_worth = MAX(leaderboard.peak_net_worth, excluded.peak_net_worth),
        is_vip = excluded.is_vip,
        is_alive = excluded.is_alive,
        last_active_at = excluded.last_active_at,
        submitted_at = excluded.submitted_at
    `),
    getTopLeaderboard: db.prepare(`
      SELECT player_id, display_name, age, generation, current_job,
             net_worth, peak_net_worth, is_vip, is_alive, last_active_at, submitted_at
      FROM leaderboard
      ORDER BY net_worth DESC, submitted_at ASC
      LIMIT ?
    `),
    getLeaderboardEntry: db.prepare('SELECT * FROM leaderboard WHERE player_id = ?'),

    // Traffic Logs
    insertTrafficLog: db.prepare(`
      INSERT INTO traffic_logs (
        ip_hash, session_id, visitor_id, path, method, status_code,
        user_agent, referer, response_time_ms, device_type,
        is_page_view, is_bot, created_at, date_str
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    getTrafficSummary: db.prepare(`
      SELECT 
        COUNT(*) AS total_requests,
        COUNT(DISTINCT ip_hash) AS unique_visitors,
        AVG(response_time_ms) AS avg_response_time,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) AS error_count
      FROM traffic_logs
      WHERE date_str = ?
    `),
    getActiveSessions: db.prepare(`
      SELECT COUNT(DISTINCT session_id) AS active_sessions
      FROM traffic_logs
      WHERE created_at >= ? AND is_bot = 0 AND session_id IS NOT NULL AND session_id != ''
    `),
    getTodayTrafficMetrics: db.prepare(`
      SELECT 
        COUNT(*) AS total_requests,
        COUNT(DISTINCT CASE WHEN visitor_id IS NOT NULL AND visitor_id != '' THEN visitor_id ELSE ip_hash END) AS unique_visitors,
        SUM(CASE WHEN is_page_view = 1 AND is_bot = 0 THEN 1 ELSE 0 END) AS page_views,
        ROUND(AVG(response_time_ms), 1) AS avg_latency_ms,
        ROUND(100.0 * SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) / MAX(COUNT(*), 1), 2) AS error_rate_pct,
        SUM(CASE WHEN is_bot = 1 THEN 1 ELSE 0 END) AS bot_count
      FROM traffic_logs
      WHERE date_str = ?
    `),
    getHourlyTimeseries: db.prepare(`
      SELECT 
        strftime('%Y-%m-%d %H:00', datetime(created_at / 1000, 'unixepoch', 'localtime')) AS hour_bucket,
        COUNT(*) AS total_requests,
        SUM(CASE WHEN is_page_view = 1 AND is_bot = 0 THEN 1 ELSE 0 END) AS page_views,
        COUNT(DISTINCT CASE WHEN is_bot = 0 THEN COALESCE(visitor_id, ip_hash) ELSE NULL END) AS unique_visitors,
        ROUND(AVG(response_time_ms), 1) AS avg_latency_ms
      FROM traffic_logs
      WHERE created_at >= ?
      GROUP BY hour_bucket
      ORDER BY hour_bucket ASC
    `),
    getDeviceBreakdown: db.prepare(`
      SELECT 
        device_type,
        COUNT(*) AS count
      FROM traffic_logs
      WHERE created_at >= ? AND is_bot = 0
      GROUP BY device_type
    `),
    getReferrerBreakdown: db.prepare(`
      SELECT 
        COALESCE(NULLIF(referer, ''), 'Direct') AS ref,
        COUNT(*) AS count
      FROM traffic_logs
      WHERE created_at >= ? AND is_bot = 0
      GROUP BY ref
      ORDER BY count DESC
      LIMIT 10
    `),
    getPathBreakdown: db.prepare(`
      SELECT 
        path,
        COUNT(*) AS count
      FROM traffic_logs
      WHERE created_at >= ? AND is_bot = 0
      GROUP BY path
      ORDER BY count DESC
      LIMIT 10
    `),
    getLiveLogs: db.prepare(`
      SELECT 
        id,
        created_at,
        method,
        path,
        status_code,
        response_time_ms,
        ip_hash,
        device_type,
        is_bot,
        is_page_view,
        referer,
        user_agent
      FROM traffic_logs
      ORDER BY id DESC
      LIMIT ?
    `)
  };

  return db;
}

/**
 * Access the active DatabaseSync instance (initializes if needed)
 */
function getDb() {
  if (!db) {
    initDatabase();
  }
  return db;
}

/**
 * Helper DAO Operations
 */
const players = {
  create({
    id = crypto.randomUUID(),
    username,
    displayName,
    syncCode = null,
    passwordHash = null,
    isVip = 0,
    deviceFingerprint = null
  }) {
    getDb();
    const now = Date.now();
    let finalSyncCode = syncCode;

    // Generate unique sync code with collision check
    if (!finalSyncCode) {
      let attempts = 0;
      do {
        finalSyncCode = generateSyncCode();
        attempts++;
      } while (statements.checkSyncCode.get(finalSyncCode) && attempts < 10);
    }

    statements.insertPlayer.run(
      id,
      username,
      displayName,
      finalSyncCode,
      passwordHash,
      isVip ? 1 : 0,
      deviceFingerprint,
      now,
      now,
      now
    );

    return statements.getPlayerById.get(id);
  },

  getById(id) {
    getDb();
    return statements.getPlayerById.get(id) || null;
  },

  getByUsername(username) {
    getDb();
    return statements.getPlayerByUsername.get(username) || null;
  },

  getBySyncCode(syncCode) {
    getDb();
    const normalized = normalizeSyncCode(syncCode);
    return statements.getPlayerBySyncCode.get(normalized) || null;
  },

  updateDisplayName(id, displayName) {
    getDb();
    statements.updateDisplayName.run(displayName, Date.now(), id);
    return statements.getPlayerById.get(id);
  },

  updateLastActive(id) {
    getDb();
    statements.updateLastActive.run(Date.now(), id);
  },

  setPassword(id, passwordHash) {
    getDb();
    statements.updatePasswordHash.run(passwordHash, Date.now(), id);
    return statements.getPlayerById.get(id);
  },

  setVip(id, isVip) {
    getDb();
    statements.updateVipStatus.run(isVip ? 1 : 0, Date.now(), id);
    return statements.getPlayerById.get(id);
  }
};

const sessions = {
  create({
    playerId,
    deviceLabel = null,
    durationMs = config.sessionDurationMs
  }) {
    getDb();
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + durationMs;

    statements.insertSession.run(token, playerId, deviceLabel, now, expiresAt);
    return { token, playerId, expiresAt };
  },

  get(token) {
    getDb();
    if (!token) return null;
    return statements.getSession.get(token, Date.now()) || null;
  },

  delete(token) {
    getDb();
    statements.deleteSession.run(token);
  },

  deleteForPlayer(playerId) {
    getDb();
    statements.deletePlayerSessions.run(playerId);
  },

  cleanExpired() {
    getDb();
    statements.cleanExpiredSessions.run(Date.now());
  }
};

const gameSaves = {
  save({
    id = crypto.randomUUID(),
    playerId,
    slot = 0,
    characterName,
    age,
    generation = 1,
    currentJob = 'Chưa đi làm',
    netWorth = 0,
    peakNetWorth = null,
    isAlive = 1,
    saveDataJson,
    saveVersion = 2,
    checksum = null
  }) {
    getDb();
    const now = Date.now();
    const calculatedPeak = peakNetWorth !== null ? peakNetWorth : netWorth;
    const serializedJson = typeof saveDataJson === 'string' ? saveDataJson : JSON.stringify(saveDataJson);

    statements.upsertSave.run(
      id,
      playerId,
      slot,
      characterName,
      age,
      generation,
      currentJob,
      netWorth,
      calculatedPeak,
      isAlive ? 1 : 0,
      serializedJson,
      saveVersion,
      checksum,
      now,
      now
    );

    return statements.getSaveBySlot.get(playerId, slot);
  },

  getBySlot(playerId, slot = 0) {
    getDb();
    const row = statements.getSaveBySlot.get(playerId, slot);
    if (!row) return null;
    if (row && row.save_data_json) {
      try {
        row.parsedData = JSON.parse(row.save_data_json);
      } catch (e) {
        row.parsedData = null;
      }
    }
    return row;
  },

  getAllByPlayer(playerId) {
    getDb();
    const rows = statements.getSavesByPlayer.all(playerId);
    return rows.map(r => {
      try {
        r.parsedData = JSON.parse(r.save_data_json);
      } catch (e) {
        r.parsedData = null;
      }
      return r;
    });
  },

  delete(playerId, slot) {
    getDb();
    statements.deleteSave.run(playerId, slot);
  }
};

const leaderboard = {
  submit({
    playerId,
    displayName,
    age,
    generation = 1,
    currentJob = 'Chưa đi làm',
    netWorth = 0,
    peakNetWorth = null,
    isVip = 0,
    isAlive = 1
  }) {
    getDb();
    const now = Date.now();
    const calculatedPeak = peakNetWorth !== null ? peakNetWorth : netWorth;

    statements.upsertLeaderboard.run(
      playerId,
      displayName,
      age,
      generation,
      currentJob,
      netWorth,
      calculatedPeak,
      isVip ? 1 : 0,
      isAlive ? 1 : 0,
      now,
      now
    );

    return statements.getLeaderboardEntry.get(playerId);
  },

  getTop(limit = 50) {
    getDb();
    const rows = statements.getTopLeaderboard.all(Math.min(limit, 100));
    return rows.map((row, idx) => ({
      rank: idx + 1,
      playerId: row.player_id,
      displayName: row.display_name,
      age: row.age,
      generation: row.generation,
      currentJob: row.current_job,
      netWorth: row.net_worth,
      peakNetWorth: row.peak_net_worth,
      isVip: Boolean(row.is_vip),
      isAlive: Boolean(row.is_alive),
      lastActiveAt: row.last_active_at,
      submittedAt: row.submitted_at
    }));
  },

  getEntry(playerId) {
    getDb();
    return statements.getLeaderboardEntry.get(playerId) || null;
  }
};

const traffic = {
  log({
    ipHash,
    sessionId = null,
    visitorId = null,
    path,
    method,
    statusCode,
    userAgent = null,
    referer = null,
    responseTimeMs = 0,
    deviceType = 'desktop',
    isPageView = 0,
    isBot = 0,
    createdAt = null
  }) {
    getDb();
    const now = createdAt || Date.now();
    const dateStr = new Date(now).toISOString().slice(0, 10);

    statements.insertTrafficLog.run(
      ipHash,
      sessionId,
      visitorId,
      path,
      method,
      statusCode,
      userAgent,
      referer,
      responseTimeMs,
      deviceType || 'desktop',
      isPageView ? 1 : 0,
      isBot ? 1 : 0,
      now,
      dateStr
    );
  },

  getSummary(dateStr) {
    getDb();
    const targetDate = dateStr || new Date().toISOString().slice(0, 10);
    return statements.getTrafficSummary.get(targetDate);
  },

  getSummaryMetrics(dateStr = null) {
    getDb();
    const targetDate = dateStr || new Date().toISOString().slice(0, 10);
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeRow = statements.getActiveSessions.get(fiveMinutesAgo);
    const todayRow = statements.getTodayTrafficMetrics.get(targetDate) || {};

    return {
      activeSessions: activeRow ? activeRow.active_sessions : 0,
      uniqueVisitorsToday: todayRow.unique_visitors || 0,
      pageViewsToday: todayRow.page_views || 0,
      totalRequestsToday: todayRow.total_requests || 0,
      avgLatencyMs: todayRow.avg_latency_ms || 0,
      errorRatePct: todayRow.error_rate_pct || 0,
      botRequestCount: todayRow.bot_count || 0
    };
  },

  getTimeseries(hours = 24) {
    getDb();
    const sinceMs = Date.now() - hours * 3600 * 1000;
    const rows = statements.getHourlyTimeseries.all(sinceMs);

    // Build complete hourly map for the last N hours
    const bucketMap = new Map();
    const now = new Date();
    for (let i = hours - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600 * 1000);
      const pad = (n) => String(n).padStart(2, '0');
      const hourStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;
      bucketMap.set(hourStr, {
        hour: hourStr,
        pageViews: 0,
        uniqueVisitors: 0,
        requests: 0,
        avgLatencyMs: 0
      });
    }

    for (const r of rows) {
      if (bucketMap.has(r.hour_bucket)) {
        const item = bucketMap.get(r.hour_bucket);
        item.pageViews = r.page_views || 0;
        item.uniqueVisitors = r.unique_visitors || 0;
        item.requests = r.total_requests || 0;
        item.avgLatencyMs = r.avg_latency_ms || 0;
      }
    }

    return Array.from(bucketMap.values());
  },

  getBreakdown(sinceHours = 24) {
    getDb();
    const sinceMs = Date.now() - sinceHours * 3600 * 1000;
    const deviceRows = statements.getDeviceBreakdown.all(sinceMs);
    const refRows = statements.getReferrerBreakdown.all(sinceMs);
    const pathRows = statements.getPathBreakdown.all(sinceMs);

    let totalHuman = 0;
    const counts = { desktop: 0, mobile: 0, tablet: 0 };
    for (const d of deviceRows) {
      if (counts[d.device_type] !== undefined) {
        counts[d.device_type] = d.count;
        totalHuman += d.count;
      }
    }

    const mobilePct = totalHuman > 0 ? Math.round((counts.mobile / totalHuman) * 1000) / 10 : 0;
    const desktopPct = totalHuman > 0 ? Math.round((counts.desktop / totalHuman) * 1000) / 10 : 0;
    const tabletPct = totalHuman > 0 ? Math.round((counts.tablet / totalHuman) * 1000) / 10 : 0;

    return {
      devices: counts,
      totalCount: totalHuman,
      mobilePct,
      desktopPct,
      tabletPct,
      referrers: refRows.map(r => ({ referrer: r.ref, count: r.count })),
      topPaths: pathRows.map(r => ({ path: r.path, count: r.count }))
    };
  },

  getLiveLogs(limit = 50) {
    getDb();
    const boundedLimit = Math.max(1, Math.min(limit, 200));
    const rows = statements.getLiveLogs.all(boundedLimit);
    return rows.map(r => ({
      id: r.id,
      timestamp: r.created_at,
      timeStr: new Date(r.created_at).toLocaleTimeString('vi-VN', { hour12: false }),
      method: r.method,
      path: r.path,
      statusCode: r.status_code,
      latencyMs: r.response_time_ms,
      ipHashSnippet: r.ip_hash ? r.ip_hash.slice(0, 10) + '...' : 'unknown',
      deviceType: r.device_type,
      isBot: Boolean(r.is_bot),
      isPageView: Boolean(r.is_page_view),
      referer: r.referer || 'Direct'
    }));
  }
};

function close() {
  if (db) {
    db.close();
    db = null;
    statements = null;
  }
}

module.exports = {
  initDatabase,
  getDb,
  close,
  generateSyncCode,
  normalizeSyncCode,
  players,
  sessions,
  gameSaves,
  leaderboard,
  traffic
};
