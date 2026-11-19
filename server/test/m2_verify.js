const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Set test environment database path to a dedicated test sqlite file
const TEST_DB_PATH = path.resolve(__dirname, 'test_ztb_m2.sqlite');
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}
process.env.DB_PATH = TEST_DB_PATH;
process.env.NODE_ENV = 'test';

const config = require('../config');
const db = require('../db/database');
const { app, startServer, stopServer } = require('../index');

const TEST_PORT = 3145;
let baseUrl = `http://127.0.0.1:${TEST_PORT}`;

// HTTP request helper
function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqHeaders = { ...headers };
    let payload = null;

    if (body !== null) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json
        });
      });
    });

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// Test runner state
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  process.stdout.write(`  [TEST] ${name} ... `);
  try {
    await fn();
    passedTests++;
    console.log('\x1b[32mPASSED\x1b[0m');
  } catch (err) {
    failedTests++;
    console.log('\x1b[31mFAILED\x1b[0m');
    console.error('    Error:', err.message);
    if (err.stack) {
      console.error('    Stack:', err.stack.split('\n').slice(1, 4).join('\n'));
    }
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('   Milestone 2: Backend & Identity Verification Suite');
  console.log('======================================================\n');

  // Start HTTP Server
  await startServer(TEST_PORT);

  try {
    // ----------------------------------------------------
    // Group 1: Database Schema & Integrity
    // ----------------------------------------------------
    console.log('--- Group 1: Database Schema & Integrity ---');

    await test('Database tables and indexes are initialized correctly', async () => {
      const sqliteDb = db.getDb();
      const tables = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      const tableNames = tables.map(t => t.name);

      assert.ok(tableNames.includes('players'), 'players table must exist');
      assert.ok(tableNames.includes('player_sessions'), 'player_sessions table must exist');
      assert.ok(tableNames.includes('game_saves'), 'game_saves table must exist');
      assert.ok(tableNames.includes('leaderboard'), 'leaderboard table must exist');
      assert.ok(tableNames.includes('traffic_logs'), 'traffic_logs table must exist');
    });

    await test('Foreign key CASCADE constraints work on player deletion', async () => {
      const p = db.players.create({
        username: 'cascade_test_user',
        displayName: 'Cascade User'
      });
      const s = db.sessions.create({ playerId: p.id });
      db.gameSaves.save({
        playerId: p.id,
        slot: 0,
        characterName: 'Cascade User',
        age: 20,
        netWorth: 100,
        saveDataJson: { test: true }
      });
      db.leaderboard.submit({
        playerId: p.id,
        displayName: 'Cascade User',
        age: 20,
        netWorth: 100
      });

      // Confirm existence
      assert.ok(db.sessions.get(s.token), 'Session should exist before cascade');
      assert.ok(db.gameSaves.getBySlot(p.id, 0), 'Save should exist before cascade');
      assert.ok(db.leaderboard.getEntry(p.id), 'Leaderboard entry should exist before cascade');

      // Delete player
      db.getDb().prepare('DELETE FROM players WHERE id = ?').run(p.id);

      // Confirm cascading deletion
      assert.strictEqual(db.sessions.get(s.token), null, 'Session must be deleted on cascade');
      assert.strictEqual(db.gameSaves.getBySlot(p.id, 0), null, 'Save must be deleted on cascade');
      assert.strictEqual(db.leaderboard.getEntry(p.id), null, 'Leaderboard entry must be deleted on cascade');
    });

    // ----------------------------------------------------
    // Group 2: Sync Code Generation & Normalization
    // ----------------------------------------------------
    console.log('\n--- Group 2: Sync Code Generation & Collision Resistance ---');

    await test('Sync Code format matches ZTB-XXXX-XXXX with unambiguous characters', async () => {
      const syncPattern = /^ZTB-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/;
      for (let i = 0; i < 20; i++) {
        const code = db.generateSyncCode();
        assert.ok(syncPattern.test(code), `Sync code ${code} should match format ZTB-XXXX-XXXX`);
        // Verify no ambiguous chars (0, O, 1, I)
        assert.ok(!/[0O1I]/.test(code), `Sync code ${code} must not contain ambiguous characters 0, O, 1, I`);
      }
    });

    await test('Generates 1,000 distinct Sync Codes with zero collisions', async () => {
      const set = new Set();
      const count = 1000;
      for (let i = 0; i < count; i++) {
        const code = db.generateSyncCode();
        set.add(code);
      }
      assert.strictEqual(set.size, count, '1,000 generated sync codes must all be unique');
    });

    await test('Sync Code normalization handles lowercase, hyphens, and missing prefix', async () => {
      const normalized1 = db.normalizeSyncCode('ztb-8492-kx71');
      assert.strictEqual(normalized1, 'ZTB-8492-KX71');

      const normalized2 = db.normalizeSyncCode('ztb8492kx71');
      assert.strictEqual(normalized2, 'ZTB-8492-KX71');

      const normalized3 = db.normalizeSyncCode('8492-KX71');
      assert.strictEqual(normalized3, 'ZTB-8492-KX71');

      const normalized4 = db.normalizeSyncCode('8492kx71');
      assert.strictEqual(normalized4, 'ZTB-8492-KX71');
    });

    // ----------------------------------------------------
    // Group 3: Guest Account Registration & Sessions
    // ----------------------------------------------------
    console.log('\n--- Group 3: Guest Account Registration & Authentication ---');

    let guestPlayer = null;
    let guestToken = null;

    await test('POST /api/auth/guest registers anonymous account and returns token', async () => {
      const res = await request('POST', '/api/auth/guest', {
        displayName: 'Nguyễn Văn A',
        deviceLabel: 'Playwright Test Browser'
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'Must return session token');
      assert.ok(res.data.playerId, 'Must return playerId');
      assert.ok(res.data.syncCode, 'Must return syncCode');
      assert.strictEqual(res.data.displayName, 'Nguyễn Văn A');

      // Verify UUID format
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      assert.ok(uuidPattern.test(res.data.playerId), 'playerId must be a valid UUID');

      // Verify Sync Code format
      const syncPattern = /^ZTB-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/;
      assert.ok(syncPattern.test(res.data.syncCode), 'syncCode must match format ZTB-XXXX-XXXX');

      guestPlayer = res.data;
      guestToken = res.data.token;
    });

    await test('GET /api/player/me rejects unauthenticated requests (401)', async () => {
      const resNoToken = await request('GET', '/api/player/me');
      assert.strictEqual(resNoToken.status, 401);
      assert.strictEqual(resNoToken.data.success, false);

      const resBadToken = await request('GET', '/api/player/me', null, {
        Authorization: 'Bearer invalid_fake_token_12345'
      });
      assert.strictEqual(resBadToken.status, 401);
      assert.strictEqual(resBadToken.data.success, false);
    });

    await test('GET /api/player/me returns player profile with valid token', async () => {
      const res = await request('GET', '/api/player/me', null, {
        Authorization: `Bearer ${guestToken}`
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.player.id, guestPlayer.playerId);
      assert.strictEqual(res.data.player.displayName, 'Nguyễn Văn A');
      assert.strictEqual(res.data.player.syncCode, guestPlayer.syncCode);
      assert.strictEqual(res.data.player.hasPin, false);
    });

    await test('PUT /api/player/name updates player display name', async () => {
      const res = await request('PUT', '/api/player/name', { displayName: 'Trần Thị B' }, {
        Authorization: `Bearer ${guestToken}`
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.displayName, 'Trần Thị B');

      // Verify profile reflects new name
      const profile = await request('GET', '/api/player/me', null, {
        Authorization: `Bearer ${guestToken}`
      });
      assert.strictEqual(profile.data.player.displayName, 'Trần Thị B');
    });

    // ----------------------------------------------------
    // Group 4: Cross-Device Resumption Workflow
    // ----------------------------------------------------
    console.log('\n--- Group 4: Cross-Device Resumption Workflow ---');

    await test('Save game state to slot 0 and resume on Device B via Sync Code', async () => {
      // 1. Device A uploads a game save to slot 0
      const savePayload = {
        slot: 0,
        characterName: 'Trần Thị B',
        age: 35,
        generation: 1,
        currentJob: 'Giám Đốc Tài Chính',
        netWorth: 1500000000, // 1.5 Billion VND
        peakNetWorth: 1500000000,
        saveData: {
          cash: 500000000,
          portfolio: { stocks: 1000000000 },
          relationships: ['Bố', 'Mẹ', 'Bạn thân']
        }
      };

      const saveRes = await request('POST', '/api/save', savePayload, {
        Authorization: `Bearer ${guestToken}`
      });
      assert.strictEqual(saveRes.status, 200);
      assert.strictEqual(saveRes.data.success, true);
      assert.strictEqual(saveRes.data.slot, 0);

      // 2. Device B calls /api/auth/sync-device with guestPlayer.syncCode
      const syncRes = await request('POST', '/api/auth/sync-device', {
        syncCode: guestPlayer.syncCode,
        deviceLabel: 'Device B - iPhone 16'
      });

      assert.strictEqual(syncRes.status, 200);
      assert.strictEqual(syncRes.data.success, true);
      assert.strictEqual(syncRes.data.playerId, guestPlayer.playerId);
      assert.ok(syncRes.data.token, 'Device B must receive a fresh session token');
      assert.notStrictEqual(syncRes.data.token, guestToken, 'Device B token should be distinct from Device A');

      // Verify restored save snapshot
      assert.ok(syncRes.data.latestSave, 'Device B must receive latestSave');
      assert.strictEqual(syncRes.data.latestSave.slot, 0);
      assert.strictEqual(syncRes.data.latestSave.characterName, 'Trần Thị B');
      assert.strictEqual(syncRes.data.latestSave.age, 35);
      assert.strictEqual(syncRes.data.latestSave.netWorth, 1500000000);
      assert.strictEqual(syncRes.data.latestSave.saveData.cash, 500000000);

      // 3. Device B token can make authenticated requests
      const meB = await request('GET', '/api/player/me', null, {
        Authorization: `Bearer ${syncRes.data.token}`
      });
      assert.strictEqual(meB.status, 200);
      assert.strictEqual(meB.data.player.id, guestPlayer.playerId);
    });

    await test('POST /api/auth/sync-device rejects invalid or non-existent Sync Code (404)', async () => {
      const res = await request('POST', '/api/auth/sync-device', {
        syncCode: 'ZTB-9999-9999'
      });
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.error.includes('không tồn tại'));
    });

    // ----------------------------------------------------
    // Group 5: Optional PIN / Password Hardening
    // ----------------------------------------------------
    console.log('\n--- Group 5: Optional PIN Security & Login ---');

    await test('POST /api/auth/set-pin sets PIN and POST /api/auth/login validates it', async () => {
      // 1. Set PIN 789456
      const pinRes = await request('POST', '/api/auth/set-pin', { pin: '789456' }, {
        Authorization: `Bearer ${guestToken}`
      });
      assert.strictEqual(pinRes.status, 200);
      assert.strictEqual(pinRes.data.success, true);

      // Verify DB stores bcrypt hash, not plaintext
      const playerRecord = db.players.getById(guestPlayer.playerId);
      assert.ok(playerRecord.password_hash.startsWith('$2'), 'Must be stored as bcrypt hash');
      assert.ok(!playerRecord.password_hash.includes('789456'), 'Plaintext PIN must never be stored');

      // 2. Login with correct PIN
      const loginSuccess = await request('POST', '/api/auth/login', {
        syncCode: guestPlayer.syncCode,
        pin: '789456'
      });
      assert.strictEqual(loginSuccess.status, 200);
      assert.strictEqual(loginSuccess.data.success, true);
      assert.strictEqual(loginSuccess.data.playerId, guestPlayer.playerId);
      assert.ok(loginSuccess.data.token);

      // 3. Login with wrong PIN
      const loginFail = await request('POST', '/api/auth/login', {
        syncCode: guestPlayer.syncCode,
        pin: '000000'
      });
      assert.strictEqual(loginFail.status, 401);
      assert.strictEqual(loginFail.data.success, false);
    });

    // ----------------------------------------------------
    // Group 6: Leaderboard Deduplication & Ranking (R1 & R2)
    // ----------------------------------------------------
    console.log('\n--- Group 6: Leaderboard Deduplication & Ranking ---');

    await test('Repeated score submissions by same player update atomically without duplicates', async () => {
      // Create Player 1
      const p1 = db.players.create({ username: 'lb_p1', displayName: 'Nguyễn Gia Huy' });
      const s1 = db.sessions.create({ playerId: p1.id });

      // Submit score 1
      await request('POST', '/api/leaderboard/submit', {
        displayName: 'Nguyễn Gia Huy',
        age: 20,
        currentJob: 'Thực Tập Sinh',
        netWorth: 10000000
      }, { Authorization: `Bearer ${s1.token}` });

      // Submit score 2 (career promotion)
      await request('POST', '/api/leaderboard/submit', {
        displayName: 'Nguyễn Gia Huy',
        age: 28,
        currentJob: 'Lập Trình Viên',
        netWorth: 250000000,
        peakNetWorth: 250000000
      }, { Authorization: `Bearer ${s1.token}` });

      // Submit score 3 (temporary market drop, netWorth drops to 200M)
      await request('POST', '/api/leaderboard/submit', {
        displayName: 'Nguyễn Gia Huy',
        age: 30,
        currentJob: 'Kỹ Sư Cấp Cao',
        netWorth: 200000000,
        peakNetWorth: 250000000
      }, { Authorization: `Bearer ${s1.token}` });

      // Verify that in the leaderboard, there is EXACTLY 1 row for Player 1
      const allRows = db.getDb().prepare('SELECT * FROM leaderboard WHERE player_id = ?').all(p1.id);
      assert.strictEqual(allRows.length, 1, 'There must be strictly ONE row per player_id');

      const entry = allRows[0];
      assert.strictEqual(entry.age, 30);
      assert.strictEqual(entry.current_job, 'Kỹ Sư Cấp Cao');
      assert.strictEqual(entry.net_worth, 200000000);
      assert.strictEqual(entry.peak_net_worth, 250000000, 'peak_net_worth must preserve highest historical value');
    });

    await test('GET /api/leaderboard returns ranked players sorted by net_worth DESC', async () => {
      // Clear leaderboard table for clean ranking test
      db.getDb().exec('DELETE FROM leaderboard');

      const contestants = [
        { name: 'Đặng Lê Nguyên Vũ', netWorth: 8000000000000, age: 52, job: 'Vua Cà Phê' },
        { name: 'Phạm Nhật Vượng', netWorth: 150000000000000, age: 56, job: 'Chủ Tịch Tập Đoàn' },
        { name: 'Nguyễn Thị Phương Thảo', netWorth: 65000000000000, age: 54, job: 'CEO Hàng Không' },
        { name: 'Trần Đình Long', netWorth: 50000000000000, age: 63, job: 'Vua Thép' }
      ];

      for (const c of contestants) {
        const p = db.players.create({ username: 'user_' + Math.random().toString(36).slice(2, 8), displayName: c.name });
        db.leaderboard.submit({
          playerId: p.id,
          displayName: c.name,
          age: c.age,
          currentJob: c.job,
          netWorth: c.netWorth,
          peakNetWorth: c.netWorth
        });
      }

      const res = await request('GET', '/api/leaderboard?limit=10');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.entries.length, 4);

      // Verify rank 1 is highest net worth
      assert.strictEqual(res.data.entries[0].rank, 1);
      assert.strictEqual(res.data.entries[0].displayName, 'Phạm Nhật Vượng');
      assert.strictEqual(res.data.entries[0].netWorth, 150000000000000);

      // Verify descending order
      for (let i = 0; i < res.data.entries.length - 1; i++) {
        assert.ok(
          res.data.entries[i].netWorth >= res.data.entries[i + 1].netWorth,
          `Rank ${i + 1} (${res.data.entries[i].netWorth}) must be >= Rank ${i + 2} (${res.data.entries[i + 1].netWorth})`
        );
      }
    });

    // ----------------------------------------------------
    // Group 7: Multi-Slot Cloud Persistence
    // ----------------------------------------------------
    console.log('\n--- Group 7: Multi-Slot Cloud Persistence ---');

    await test('Cloud save slots (0..3) store and retrieve independent snapshots', async () => {
      const p = db.players.create({ username: 'slot_tester', displayName: 'Slot Tester' });
      const s = db.sessions.create({ playerId: p.id });

      // Save to Slot 0 (Auto-save)
      await request('POST', '/api/save', {
        slot: 0,
        characterName: 'Slot Tester',
        age: 22,
        netWorth: 20000000,
        saveData: { stage: 'auto-save snapshot' }
      }, { Authorization: `Bearer ${s.token}` });

      // Save to Slot 1 (Manual Slot 1)
      await request('POST', '/api/save', {
        slot: 1,
        characterName: 'Slot Tester',
        age: 25,
        netWorth: 80000000,
        saveData: { stage: 'manual slot 1 snapshot' }
      }, { Authorization: `Bearer ${s.token}` });

      // Retrieve Slot 0
      const slot0Res = await request('GET', '/api/save?slot=0', null, { Authorization: `Bearer ${s.token}` });
      assert.strictEqual(slot0Res.status, 200);
      assert.strictEqual(slot0Res.data.age, 22);
      assert.strictEqual(slot0Res.data.saveData.stage, 'auto-save snapshot');

      // Retrieve Slot 1
      const slot1Res = await request('GET', '/api/save?slot=1', null, { Authorization: `Bearer ${s.token}` });
      assert.strictEqual(slot1Res.status, 200);
      assert.strictEqual(slot1Res.data.age, 25);
      assert.strictEqual(slot1Res.data.saveData.stage, 'manual slot 1 snapshot');

      // List all slots
      const listRes = await request('GET', '/api/save/slots', null, { Authorization: `Bearer ${s.token}` });
      assert.strictEqual(listRes.status, 200);
      assert.strictEqual(listRes.data.slots.length, 2);
    });

    // ----------------------------------------------------
    // Group 8: Traffic Telemetry Foundation
    // ----------------------------------------------------
    console.log('\n--- Group 8: Traffic Telemetry Foundation (R3 Support) ---');

    await test('Traffic logger records HTTP telemetry events and returns summary', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const ipHash1 = crypto.createHash('sha256').update('192.168.1.1 + salt').digest('hex');
      const ipHash2 = crypto.createHash('sha256').update('192.168.1.2 + salt').digest('hex');

      db.traffic.log({
        ipHash: ipHash1,
        sessionId: 'sess_1',
        path: '/web/game.js',
        method: 'GET',
        statusCode: 200,
        responseTimeMs: 12.5
      });

      db.traffic.log({
        ipHash: ipHash2,
        sessionId: 'sess_2',
        path: '/api/leaderboard',
        method: 'GET',
        statusCode: 200,
        responseTimeMs: 25.0
      });

      const summary = db.traffic.getSummary(today);
      assert.ok(summary.total_requests >= 2, 'Should record at least 2 requests');
      assert.ok(summary.unique_visitors >= 2, 'Should record 2 unique visitor hashes');
    });

  } finally {
    // Stop server and clean up test db
    await stopServer();
    if (fs.existsSync(TEST_DB_PATH)) {
      try {
        fs.unlinkSync(TEST_DB_PATH);
      } catch (e) {
        // file may be locked briefly on Windows; non-fatal
      }
    }
  }

  console.log('\n======================================================');
  console.log(`Results: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
