// Milestone 3: Cloud Persistence & Cross-Device Sync Verification Suite
const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const TEST_DB_PATH = path.resolve(__dirname, 'test_ztb_m3.sqlite');
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}
process.env.DB_PATH = TEST_DB_PATH;
process.env.NODE_ENV = 'test';

const config = require('../config');
const db = require('../db/database');
const { app, startServer, stopServer } = require('../index');

const TEST_PORT = 3146;
const baseUrl = `http://127.0.0.1:${TEST_PORT}`;

function request(method, reqPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(reqPath, baseUrl);
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
  console.log('   Milestone 3: Cloud Persistence & Device Sync Suite');
  console.log('======================================================\n');

  await startServer(TEST_PORT);

  try {
    // 1. Web Files & DOM Elements Verification
    console.log('--- Phase 1: Static UI, Scripts & Integrity Checks ---');

    await test('web/api_client.js exists and is non-empty', async () => {
      const clientPath = path.resolve(__dirname, '../../web/api_client.js');
      assert.ok(fs.existsSync(clientPath), 'web/api_client.js must exist');
      const content = fs.readFileSync(clientPath, 'utf8');
      assert.ok(content.length > 500, 'web/api_client.js must not be empty');
      assert.ok(content.includes('ApiClient'), 'Must declare ApiClient class');
      assert.ok(content.includes('syncDevice'), 'Must declare syncDevice method');
      assert.ok(content.includes('saveToCloud'), 'Must declare saveToCloud method');
      assert.ok(content.includes('scheduleCloudSync'), 'Must declare scheduleCloudSync method');
      assert.ok(content.includes('ensureAuth'), 'Must declare ensureAuth method');
    });

    await test('web/game.js does NOT contain raw fetch()', async () => {
      const gamePath = path.resolve(__dirname, '../../web/game.js');
      const gameText = fs.readFileSync(gamePath, 'utf8');
      assert.ok(!gameText.includes('fetch('), 'web/game.js must not contain raw fetch()');
      assert.ok(gameText.includes('scheduleCloudSync'), 'web/game.js must call scheduleCloudSync');
      assert.ok(gameText.includes('saveToCloud'), 'web/game.js must call saveToCloud');
      assert.ok(gameText.includes('btn-copy-sync-code'), 'web/game.js must bind btn-copy-sync-code');
      assert.ok(gameText.includes('btn-sync-device'), 'web/game.js must bind btn-sync-device');
    });

    await test('web/index.html contains required M3 DOM elements', async () => {
      const indexPath = path.resolve(__dirname, '../../web/index.html');
      const html = fs.readFileSync(indexPath, 'utf8');

      const requiredIds = [
        'display-sync-code',
        'btn-copy-sync-code',
        'cloud-sync-status',
        'input-sync-code',
        'btn-sync-device',
        'sync-device-error'
      ];

      for (const id of requiredIds) {
        assert.ok(html.includes(`id="${id}"`), `web/index.html must contain id="${id}"`);
      }
    });

    await test('Script tags in web/index.html & root index.html maintain strict order', async () => {
      const webIndexPath = path.resolve(__dirname, '../../web/index.html');
      const rootIndexPath = path.resolve(__dirname, '../../index.html');
      const webHtml = fs.readFileSync(webIndexPath, 'utf8');
      const rootHtml = fs.readFileSync(rootIndexPath, 'utf8');

      const expectedOrder = [
        'game_data.js',
        'live_leaderboard.js',
        'audio.js',
        'vendor/three.min.js',
        'diorama3d.js',
        'api_client.js',
        'game.js'
      ];

      let lastPos = -1;
      for (const script of expectedOrder) {
        const pos = webHtml.indexOf(script);
        assert.ok(pos !== -1, `web/index.html missing script ${script}`);
        assert.ok(pos > lastPos, `web/index.html script ${script} out of order`);
        lastPos = pos;
      }

      lastPos = -1;
      for (const script of expectedOrder) {
        const pos = rootHtml.indexOf(script);
        assert.ok(pos !== -1, `root index.html missing script ${script}`);
        assert.ok(pos > lastPos, `root index.html script ${script} out of order`);
        lastPos = pos;
      }
    });

    // 2. REST API & Cloud Persistence Tests
    console.log('\n--- Phase 2: REST API & Cloud Persistence ---');

    let device1Token = null;
    let device1PlayerId = null;
    let device1SyncCode = null;

    await test('POST /api/auth/guest registers new player with Sync Code', async () => {
      const res = await request('POST', '/api/auth/guest', {
        displayName: 'Nguyễn Văn Phú',
        deviceLabel: 'Device Alpha'
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'Token must be returned');
      assert.ok(res.data.playerId, 'Player ID must be returned');
      assert.ok(res.data.syncCode, 'Sync Code must be returned');
      assert.match(res.data.syncCode, /^ZTB-[2-9A-Z]{4}-[2-9A-Z]{4}$/, 'Sync code must match ZTB-XXXX-XXXX');

      device1Token = res.data.token;
      device1PlayerId = res.data.playerId;
      device1SyncCode = res.data.syncCode;
    });

    await test('POST /api/save creates cloud auto-save (slot 0)', async () => {
      const savePayload = {
        slot: 0,
        characterName: 'Nguyễn Văn Phú',
        age: 35,
        generation: 1,
        currentJob: 'Kỹ sư Trưởng AI',
        netWorth: 15_800_000_000,
        peakNetWorth: 18_000_000_000,
        isAlive: true,
        saveData: {
          stats: {
            characterName: 'Nguyễn Văn Phú',
            age: 35,
            cash: 2_500_000_000,
            generation: 1,
            currentJob: 'Kỹ sư Trưởng AI'
          },
          portfolio: [
            { assetId: 'apt_mid', name: 'Chung cư cao cấp Vinhomes', quantity: 2 }
          ]
        }
      };

      const res = await request('POST', '/api/save', savePayload, {
        'Authorization': `Bearer ${device1Token}`
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.slot, 0);
      assert.ok(res.data.savedAt > 0);
    });

    await test('GET /api/save retrieves saved state accurately', async () => {
      const res = await request('GET', '/api/save?slot=0', null, {
        'Authorization': `Bearer ${device1Token}`
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.characterName, 'Nguyễn Văn Phú');
      assert.strictEqual(res.data.age, 35);
      assert.strictEqual(res.data.netWorth, 15_800_000_000);
      assert.strictEqual(res.data.currentJob, 'Kỹ sư Trưởng AI');
      assert.strictEqual(res.data.saveData.portfolio[0].name, 'Chung cư cao cấp Vinhomes');
    });

    // 3. Cross-Device Resumption Workflow
    console.log('\n--- Phase 3: Cross-Device Resumption Flow ---');

    let device2Token = null;

    await test('POST /api/auth/sync-device resumes state on Device 2 using Sync Code', async () => {
      const res = await request('POST', '/api/auth/sync-device', {
        syncCode: device1SyncCode,
        deviceLabel: 'Device Beta (Tablet)'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'New session token for device 2 must be issued');
      assert.notStrictEqual(res.data.token, device1Token, 'Device 2 gets its own unique session token');
      assert.strictEqual(res.data.playerId, device1PlayerId, 'Player ID must match');
      assert.strictEqual(res.data.syncCode, device1SyncCode, 'Sync Code must match');

      // Check latestSave payload
      assert.ok(res.data.latestSave, 'latestSave must be returned');
      assert.strictEqual(res.data.latestSave.characterName, 'Nguyễn Văn Phú');
      assert.strictEqual(res.data.latestSave.age, 35);
      assert.strictEqual(res.data.latestSave.netWorth, 15_800_000_000);
      assert.strictEqual(res.data.latestSave.saveData.stats.cash, 2_500_000_000);

      device2Token = res.data.token;
    });

    await test('Device 2 can continue game progression and cloud save', async () => {
      const updatedSavePayload = {
        slot: 0,
        characterName: 'Nguyễn Văn Phú',
        age: 36,
        generation: 1,
        currentJob: 'Giám Đốc Công Nghệ CTO',
        netWorth: 28_000_000_000,
        peakNetWorth: 28_000_000_000,
        isAlive: true,
        saveData: {
          stats: {
            characterName: 'Nguyễn Văn Phú',
            age: 36,
            cash: 5_000_000_000,
            generation: 1,
            currentJob: 'Giám Đốc Công Nghệ CTO'
          }
        }
      };

      const res = await request('POST', '/api/save', updatedSavePayload, {
        'Authorization': `Bearer ${device2Token}`
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      // Verify that device 1 can fetch the updated save
      const fetchRes = await request('GET', '/api/save?slot=0', null, {
        'Authorization': `Bearer ${device1Token}`
      });
      assert.strictEqual(fetchRes.status, 200);
      assert.strictEqual(fetchRes.data.age, 36);
      assert.strictEqual(fetchRes.data.netWorth, 28_000_000_000);
      assert.strictEqual(fetchRes.data.currentJob, 'Giám Đốc Công Nghệ CTO');
    });

    await test('POST /api/auth/sync-device with invalid code returns 404', async () => {
      const res = await request('POST', '/api/auth/sync-device', {
        syncCode: 'ZTB-0000-0000'
      });

      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.error.includes('không tồn tại'));
    });

    await test('POST /api/auth/sync-device with empty code returns 400', async () => {
      const res = await request('POST', '/api/auth/sync-device', {
        syncCode: ''
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.data.success, false);
    });

  } finally {
    await stopServer();
    if (fs.existsSync(TEST_DB_PATH)) {
      try { fs.unlinkSync(TEST_DB_PATH); } catch (_) {}
    }
  }

  console.log('\n======================================================');
  console.log(`  Tests Complete: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
