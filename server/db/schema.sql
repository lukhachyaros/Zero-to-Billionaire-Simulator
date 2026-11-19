-- Zero to Billionaire Simulator - Relational Database Schema
-- SQLite DDL with WAL mode, foreign key integrity, and optimized indexes.

PRAGMA foreign_keys = ON;

-- 1. Players Table (Player Identity & Cross-Device Account)
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,                       -- UUID v4 (e.g. 'usr_...')
  username TEXT UNIQUE NOT NULL,             -- Unique account handle
  display_name TEXT NOT NULL,                -- Character / profile display name
  sync_code TEXT UNIQUE NOT NULL,            -- Human-friendly resume code: ZTB-XXXX-XXXX
  password_hash TEXT,                        -- Optional PIN/password hash (NULL for pure guest)
  is_vip INTEGER DEFAULT 0,                  -- 0 = Regular, 1 = VIP Forever
  device_fingerprint TEXT,                   -- Device info or user-agent fingerprint
  created_at INTEGER NOT NULL,               -- Unix epoch ms
  updated_at INTEGER NOT NULL,               -- Unix epoch ms
  last_active_at INTEGER NOT NULL            -- Heartbeat timestamp ms
);

CREATE INDEX IF NOT EXISTS idx_players_sync_code ON players(sync_code);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_last_active ON players(last_active_at);

-- 2. Player Sessions Table (Token-based Authentication)
CREATE TABLE IF NOT EXISTS player_sessions (
  token TEXT PRIMARY KEY,                    -- Cryptographic session token
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  device_label TEXT,                         -- e.g. 'Chrome on Windows', 'Safari iOS'
  created_at INTEGER NOT NULL,               -- Unix epoch ms
  expires_at INTEGER NOT NULL                -- Expiry timestamp ms
);

CREATE INDEX IF NOT EXISTS idx_sessions_player ON player_sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON player_sessions(expires_at);

-- 3. Game Saves Table (Multi-Slot Cloud Persistence)
CREATE TABLE IF NOT EXISTS game_saves (
  id TEXT PRIMARY KEY,                       -- UUID v4
  player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL DEFAULT 0,           -- 0 = Auto-save, 1..3 = Manual slots
  character_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  generation INTEGER NOT NULL DEFAULT 1,
  current_job TEXT,
  net_worth REAL NOT NULL DEFAULT 0,
  peak_net_worth REAL NOT NULL DEFAULT 0,
  is_alive INTEGER NOT NULL DEFAULT 1,
  save_data_json TEXT NOT NULL,              -- Full JSON snapshot
  save_version INTEGER NOT NULL DEFAULT 2,   -- Schema version (v2)
  checksum TEXT,                             -- Checksum/hash of save state
  created_at INTEGER NOT NULL,               -- Unix epoch ms
  updated_at INTEGER NOT NULL,               -- Unix epoch ms
  CONSTRAINT uq_player_slot UNIQUE(player_id, slot)
);

CREATE INDEX IF NOT EXISTS idx_game_saves_player_slot ON game_saves(player_id, slot);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated ON game_saves(updated_at);

-- 4. Leaderboard Table (100% Deduplicated, Exactly One Record Per Player)
CREATE TABLE IF NOT EXISTS leaderboard (
  player_id TEXT PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  generation INTEGER NOT NULL DEFAULT 1,
  current_job TEXT NOT NULL,
  net_worth REAL NOT NULL DEFAULT 0,
  peak_net_worth REAL NOT NULL DEFAULT 0,
  is_vip INTEGER NOT NULL DEFAULT 0,
  is_alive INTEGER NOT NULL DEFAULT 1,
  last_active_at INTEGER NOT NULL,
  submitted_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lb_networth ON leaderboard(net_worth DESC);
CREATE INDEX IF NOT EXISTS idx_lb_peak_networth ON leaderboard(peak_net_worth DESC);

-- 5. Web Traffic Logs Table (Server-side telemetry for Requirement R3)
CREATE TABLE IF NOT EXISTS traffic_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,                     -- SHA-256(Client IP + Daily Salt)
  session_id TEXT,                           -- Visitor session identifier (ztb_sid)
  visitor_id TEXT,                           -- Persistent visitor identifier (ztb_vid)
  path TEXT NOT NULL,                        -- e.g. '/', '/web/game.js', '/api/save'
  method TEXT NOT NULL,                      -- GET, POST, etc.
  status_code INTEGER NOT NULL,              -- 200, 304, 401, etc.
  user_agent TEXT,
  referer TEXT,
  response_time_ms REAL,
  device_type TEXT NOT NULL DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet', 'bot'
  is_page_view INTEGER NOT NULL DEFAULT 0,   -- 1 for HTML documents, 0 for assets/API
  is_bot INTEGER NOT NULL DEFAULT 0,         -- 1 for bots/crawlers, 0 for human
  created_at INTEGER NOT NULL,               -- Unix epoch ms
  date_str TEXT NOT NULL                     -- 'YYYY-MM-DD' for date indexing
);

CREATE INDEX IF NOT EXISTS idx_traffic_date ON traffic_logs(date_str);
CREATE INDEX IF NOT EXISTS idx_traffic_ip_date ON traffic_logs(ip_hash, date_str);
CREATE INDEX IF NOT EXISTS idx_traffic_created ON traffic_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_traffic_visitor ON traffic_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_traffic_session ON traffic_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_page_view ON traffic_logs(is_page_view, created_at);

-- View for traffic_events compatibility
CREATE VIEW IF NOT EXISTS traffic_events AS SELECT * FROM traffic_logs;

-- 6. Traffic Hourly Rollup (Fast administrative aggregation for R3)
CREATE TABLE IF NOT EXISTS traffic_hourly_rollup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hour_str TEXT UNIQUE NOT NULL,             -- 'YYYY-MM-DD HH:00'
  page_views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  requests INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms REAL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rollup_hour ON traffic_hourly_rollup(hour_str);
