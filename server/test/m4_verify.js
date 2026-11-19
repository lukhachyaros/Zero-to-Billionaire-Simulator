const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Set test environment database path
const TEST_DB_PATH = path.resolve(__dirname, 'test_ztb_m4.sqlite');
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}
process.env.DB_PATH = TEST_DB_PATH;
process.env.NODE_ENV = 'test';

const config = require('../config');
const db = require('../db/database');
const { app, startServer, stopServer } = require('../index');
const {
  trafficTracker,
  parseCookies,
  getDailySalt,
  anonymizeIp,
  isBotUserAgent,
  classifyDevice,
  isPageViewRequest,
  reloadDebounceMap
} = require('../middleware/trafficTracker');
const {
  constantTimeCompare,
  checkLockout,
  recordLoginAttempt,
  lockoutMap,
  adminSessions
} = require('../middleware/adminAuth');

const TEST_PORT = 3146;
const baseUrl = `http://127.0.0.1:${TEST_PORT}`;

// Helper: HTTP request wrapper
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

// Helper to extract cookies from response Set-Cookie headers
function getCookiesFromResponse(res) {
  const setCookie = res.headers['set-cookie'] || [];
  const cookies = {};
  const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const c of arr) {
    const parts = c.split(';')[0].split('=');
    if (parts.length >= 2) {
      cookies[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  }
  return cookies;
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

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('   Milestone 4: Traffic Monitoring & Admin Panel Suite');
  console.log('======================================================\n');

  await startServer(TEST_PORT);

  try {
    // ----------------------------------------------------
    // Group 1: Traffic Tracker Cookie Issuance & Parsing
    // ----------------------------------------------------
    console.log('--- Group 1: Traffic Tracker Cookie Issuance & Lifecycle ---');

    let clientVid = null;
    let clientSid = null;

    await test('Issues persistent ztb_vid (1 year) and rolling ztb_sid (30m) on initial request', async () => {
      const res = await request('GET', '/api/health');
      assert.strictEqual(res.status, 200);

      const cookies = getCookiesFromResponse(res);
      assert.ok(cookies['ztb_vid'], 'Response must set ztb_vid cookie');
      assert.ok(cookies['ztb_sid'], 'Response must set ztb_sid cookie');
      assert.ok(cookies['ztb_vid'].startsWith('vid_'), 'ztb_vid should follow vid_ prefix format');
      assert.ok(cookies['ztb_sid'].startsWith('sid_'), 'ztb_sid should follow sid_ prefix format');

      const rawSetCookie = JSON.stringify(res.headers['set-cookie']);
      assert.ok(rawSetCookie.includes('Max-Age=31536000'), 'ztb_vid must have 1-year Max-Age (31536000s)');
      assert.ok(rawSetCookie.includes('Max-Age=1800'), 'ztb_sid must have 30-min Max-Age (1800s)');
      assert.ok(rawSetCookie.includes('HttpOnly'), 'Cookies must be HttpOnly');

      clientVid = cookies['ztb_vid'];
      clientSid = cookies['ztb_sid'];
    });

    await test('Preserves existing ztb_vid across subsequent requests without re-issuing', async () => {
      const res = await request('GET', '/api/health', null, {
        Cookie: `ztb_vid=${clientVid}; ztb_sid=${clientSid}`
      });
      assert.strictEqual(res.status, 200);

      const rawSetCookie = JSON.stringify(res.headers['set-cookie'] || []);
      // Should refresh ztb_sid but NOT issue a new ztb_vid
      assert.ok(!rawSetCookie.includes('ztb_vid='), 'Should not re-issue ztb_vid if already provided');
      assert.ok(rawSetCookie.includes('ztb_sid='), 'Should refresh rolling ztb_sid');
    });

    // ----------------------------------------------------
    // Group 2: Salted IP Anonymization (SHA-256)
    // ----------------------------------------------------
    console.log('\n--- Group 2: Salted IP Anonymization (SHA-256) ---');

    await test('Computes deterministic SHA-256 hash for IP on same day', () => {
      const hash1 = anonymizeIp('192.168.1.50', '2026-11-19');
      const hash2 = anonymizeIp('192.168.1.50', '2026-11-19');
      assert.strictEqual(hash1, hash2, 'Hash must be identical for same IP on same day');
      assert.strictEqual(hash1.length, 64, 'SHA-256 hex hash must be exactly 64 characters');
    });

    await test('Computes distinct hashes for different client IPs', () => {
      const hashA = anonymizeIp('192.168.1.50', '2026-11-19');
      const hashB = anonymizeIp('10.0.0.1', '2026-11-19');
      assert.notStrictEqual(hashA, hashB, 'Different IPs must yield different hashes');
    });

    await test('Rotates hash across days using server daily salt', () => {
      const hashDay1 = anonymizeIp('192.168.1.50', '2026-11-19');
      const hashDay2 = anonymizeIp('192.168.1.50', '2026-11-20');
      assert.notStrictEqual(hashDay1, hashDay2, 'Daily rotating salt must yield different hashes across days');
    });

    await test('Database stores ONLY hashed IP and never stores raw IP', async () => {
      const testIp = '203.0.113.195';
      await request('GET', '/api/health', null, {
        'x-forwarded-for': testIp,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      });
      await sleep(100); // Allow res finish handler to complete

      const rawDb = db.getDb();
      const logs = rawDb.prepare('SELECT * FROM traffic_logs ORDER BY id DESC LIMIT 5').all();
      assert.ok(logs.length > 0, 'Should have logged traffic');

      for (const row of logs) {
        assert.notStrictEqual(row.ip_hash, testIp, 'Raw IP must not be stored in ip_hash');
        assert.strictEqual(row.ip_hash.length, 64, 'Stored IP must be 64-char SHA-256 hash');
        // Ensure raw IP doesn't appear anywhere in the row text fields
        assert.ok(!JSON.stringify(row).includes(testIp), 'Raw IP must never be present in DB row');
      }
    });

    // ----------------------------------------------------
    // Group 3: Bot & Crawler Detection & Human Metric Isolation
    // ----------------------------------------------------
    console.log('\n--- Group 3: Bot & Crawler Detection ---');

    await test('Accurately detects search crawlers, bots, and automated tools', () => {
      const bots = [
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
        'curl/7.88.1',
        'python-requests/2.31.0',
        'PostmanRuntime/7.32.3',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 HeadlessChrome/114.0.5735.133 Safari/537.36'
      ];
      for (const bot of bots) {
        assert.ok(isBotUserAgent(bot), `Should detect bot: ${bot}`);
        assert.strictEqual(classifyDevice(bot), 'bot', `Device classification should be bot for: ${bot}`);
      }
    });

    await test('Accurately classifies human mobile, tablet, and desktop user agents', () => {
      const desktop = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
      const mobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1';
      const tablet = 'Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

      assert.strictEqual(isBotUserAgent(desktop), false);
      assert.strictEqual(classifyDevice(desktop), 'desktop');

      assert.strictEqual(isBotUserAgent(mobile), false);
      assert.strictEqual(classifyDevice(mobile), 'mobile');

      assert.strictEqual(isBotUserAgent(tablet), false);
      assert.strictEqual(classifyDevice(tablet), 'tablet');
    });

    await test('Bot requests are excluded from human visitor & page view counts', async () => {
      const initialMetrics = db.traffic.getSummaryMetrics();

      // Send bot request
      await request('GET', '/', null, {
        'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
      });
      await sleep(100);

      const updatedMetrics = db.traffic.getSummaryMetrics();
      assert.strictEqual(
        updatedMetrics.botRequestCount,
        initialMetrics.botRequestCount + 1,
        'Bot request count should increment'
      );
      assert.strictEqual(
        updatedMetrics.pageViewsToday,
        initialMetrics.pageViewsToday,
        'Bot visits must NOT increment human page views'
      );
    });

    // ----------------------------------------------------
    // Group 4: Rapid F5 Reload Debounce (< 1.5s)
    // ----------------------------------------------------
    console.log('\n--- Group 4: Rapid F5 Reload Debounce (< 1.5s) ---');

    await test('Debounces rapid repeated requests from same visitor to same URL within 1.5s', async () => {
      const vid = 'vid_debounce_tester_' + Date.now();
      const initialMetrics = db.traffic.getSummaryMetrics();

      // First page view
      await request('GET', '/', null, {
        Cookie: `ztb_vid=${vid}; ztb_sid=sid_test_1`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      });
      await sleep(80);

      const afterFirst = db.traffic.getSummaryMetrics();
      assert.strictEqual(
        afterFirst.pageViewsToday,
        initialMetrics.pageViewsToday + 1,
        'First request must increment page views'
      );

      // Immediate second request (simulated F5 spam, within 100ms < 1.5s)
      await request('GET', '/', null, {
        Cookie: `ztb_vid=${vid}; ztb_sid=sid_test_1`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      });
      await sleep(80);

      const afterSecond = db.traffic.getSummaryMetrics();
      assert.strictEqual(
        afterSecond.pageViewsToday,
        afterFirst.pageViewsToday,
        'Rapid reload within 1.5s must be debounced and NOT increment page views'
      );

      // Wait 1.6s (> 1.5s debounce window)
      await sleep(1600);

      // Third request after debounce window expires
      await request('GET', '/', null, {
        Cookie: `ztb_vid=${vid}; ztb_sid=sid_test_1`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      });
      await sleep(80);

      const afterThird = db.traffic.getSummaryMetrics();
      assert.strictEqual(
        afterThird.pageViewsToday,
        afterFirst.pageViewsToday + 1,
        'Request after 1.5s debounce window should increment page views'
      );
    });

    // ----------------------------------------------------
    // Group 5: Admin Authentication & Constant-Time Security
    // ----------------------------------------------------
    console.log('\n--- Group 5: Admin Authentication & Constant-Time Comparison ---');

    await test('constantTimeCompare correctly validates matching and non-matching passwords', () => {
      assert.strictEqual(constantTimeCompare('secret123', 'secret123'), true);
      assert.strictEqual(constantTimeCompare('secret123', 'wrong123'), false);
      assert.strictEqual(constantTimeCompare('short', 'much_longer_password'), false);
      assert.strictEqual(constantTimeCompare('', 'secret'), false);
    });

    let adminAuthToken = null;

    await test('POST /api/admin/login validates credentials and issues token + cookie', async () => {
      const res = await request('POST', '/api/admin/login', {
        password: config.adminPassword
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, 'Must return admin token');
      assert.ok(res.data.token.startsWith('adm_'), 'Token should have adm_ prefix');

      const cookies = getCookiesFromResponse(res);
      assert.ok(cookies['ztb_admin_token'], 'Must issue ztb_admin_token cookie');

      adminAuthToken = res.data.token;
    });

    await test('POST /api/admin/login rejects incorrect password with 401', async () => {
      const res = await request('POST', '/api/admin/login', {
        password: 'IncorrectPassword123!'
      }, {
        'x-forwarded-for': '198.51.100.1' // Separate test IP
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
      assert.ok(res.data.error.includes('không chính xác'), 'Should explain invalid password');
      assert.strictEqual(res.data.attemptsRemaining, 4, 'Should show remaining attempts');
    });

    // ----------------------------------------------------
    // Group 6: Brute-Force Lockout Defense (5 attempts -> 15 min lockout)
    // ----------------------------------------------------
    console.log('\n--- Group 6: Brute-Force Lockout Defense ---');

    await test('Locks out client IP after 5 failed login attempts (HTTP 429)', async () => {
      const attackerIp = '203.0.113.88';

      // Attempts 1 to 4 should return 401
      for (let i = 1; i <= 4; i++) {
        const res = await request('POST', '/api/admin/login', { password: `bad_${i}` }, {
          'x-forwarded-for': attackerIp
        });
        assert.strictEqual(res.status, 401);
        assert.strictEqual(res.data.attemptsRemaining, 5 - i);
      }

      // 5th failed attempt should trigger lockout (429 Too Many Requests)
      const res5 = await request('POST', '/api/admin/login', { password: 'bad_5' }, {
        'x-forwarded-for': attackerIp
      });
      assert.strictEqual(res5.status, 429, '5th failed attempt must return 429');
      assert.strictEqual(res5.data.success, false);
      assert.ok(res5.data.retryAfter > 0, 'Must include retryAfter value');
      assert.ok(res5.headers['retry-after'], 'Must set Retry-After header');

      // 6th attempt is blocked immediately with 429 even before checking password
      const res6 = await request('POST', '/api/admin/login', { password: config.adminPassword }, {
        'x-forwarded-for': attackerIp
      });
      assert.strictEqual(res6.status, 429, 'Subsequent attempts while locked must be blocked immediately');
    });

    // ----------------------------------------------------
    // Group 7: Protected Admin Endpoints & Access Control
    // ----------------------------------------------------
    console.log('\n--- Group 7: Protected Admin Endpoints & Route Security ---');

    await test('Rejects unauthenticated access to /api/admin/traffic/summary (401)', async () => {
      const res = await request('GET', '/api/admin/traffic/summary');
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
    });

    await test('Rejects invalid or forged admin token (401)', async () => {
      const res = await request('GET', '/api/admin/traffic/summary', null, {
        Authorization: 'Bearer adm_forged_invalid_token_12345'
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
    });

    await test('Allows access with valid Bearer token', async () => {
      const res = await request('GET', '/api/admin/traffic/summary', null, {
        Authorization: `Bearer ${adminAuthToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
    });

    await test('Allows access with valid ztb_admin_token cookie', async () => {
      const res = await request('GET', '/api/admin/traffic/summary', null, {
        Cookie: `ztb_admin_token=${adminAuthToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
    });

    await test('POST /api/admin/logout revokes session token and clears cookie', async () => {
      const res = await request('POST', '/api/admin/logout', null, {
        Authorization: `Bearer ${adminAuthToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      const rawSetCookie = JSON.stringify(res.headers['set-cookie'] || []);
      assert.ok(rawSetCookie.includes('Max-Age=0'), 'Must expire ztb_admin_token cookie');

      // Subsequent call with revoked token must fail with 401
      const checkRes = await request('GET', '/api/admin/traffic/summary', null, {
        Authorization: `Bearer ${adminAuthToken}`
      });
      assert.strictEqual(checkRes.status, 401, 'Revoked token must be rejected');
    });

    // ----------------------------------------------------
    // Group 8: Traffic Analytics Endpoints Verification
    // ----------------------------------------------------
    console.log('\n--- Group 8: Traffic Analytics Endpoints Verification ---');

    // Log in again to get fresh valid token
    const loginRes = await request('POST', '/api/admin/login', { password: config.adminPassword });
    const activeToken = loginRes.data.token;

    await test('GET /api/admin/traffic/summary returns complete KPI metric set', async () => {
      const res = await request('GET', '/api/admin/traffic/summary', null, {
        Authorization: `Bearer ${activeToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      assert.ok('activeSessions' in res.data, 'Must return activeSessions');
      assert.ok('uniqueVisitorsToday' in res.data, 'Must return uniqueVisitorsToday');
      assert.ok('pageViewsToday' in res.data, 'Must return pageViewsToday');
      assert.ok('avgLatencyMs' in res.data, 'Must return avgLatencyMs');
      assert.ok('errorRatePct' in res.data, 'Must return errorRatePct');
      assert.ok('botRequestCount' in res.data, 'Must return botRequestCount');
    });

    await test('GET /api/admin/traffic/timeseries returns 24 hourly buckets', async () => {
      const res = await request('GET', '/api/admin/traffic/timeseries?hours=24', null, {
        Authorization: `Bearer ${activeToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.hours, 24);
      assert.ok(Array.isArray(res.data.timeseries), 'Must return timeseries array');
      assert.strictEqual(res.data.timeseries.length, 24, 'Must return exactly 24 hourly buckets');

      const sample = res.data.timeseries[0];
      assert.ok('hour' in sample, 'Bucket must have hour string');
      assert.ok('pageViews' in sample, 'Bucket must have pageViews count');
      assert.ok('uniqueVisitors' in sample, 'Bucket must have uniqueVisitors count');
      assert.ok('requests' in sample, 'Bucket must have requests count');
    });

    await test('GET /api/admin/traffic/breakdown returns device distribution & referrers', async () => {
      const res = await request('GET', '/api/admin/traffic/breakdown', null, {
        Authorization: `Bearer ${activeToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);

      assert.ok('devices' in res.data, 'Must return devices count');
      assert.ok('mobilePct' in res.data, 'Must return mobile percentage');
      assert.ok('desktopPct' in res.data, 'Must return desktop percentage');
      assert.ok(Array.isArray(res.data.referrers), 'Must return referrers array');
      assert.ok(Array.isArray(res.data.topPaths), 'Must return topPaths array');
    });

    await test('GET /api/admin/traffic/live-logs returns recent request logs stream', async () => {
      const res = await request('GET', '/api/admin/traffic/live-logs?limit=25', null, {
        Authorization: `Bearer ${activeToken}`
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.logs), 'Must return logs array');
      assert.ok(res.data.logs.length > 0, 'Must have recorded log entries');

      const log = res.data.logs[0];
      assert.ok(log.id, 'Log item must have id');
      assert.ok(log.method, 'Log item must have method');
      assert.ok(log.path, 'Log item must have path');
      assert.ok(log.statusCode, 'Log item must have statusCode');
      assert.ok(log.ipHashSnippet, 'Log item must have ipHashSnippet');
      assert.ok(log.deviceType, 'Log item must have deviceType');
    });

    // ----------------------------------------------------
    // Group 9: Static Routing & Admin Dashboard HTML Delivery
    // ----------------------------------------------------
    console.log('\n--- Group 9: Static Routing & Admin Dashboard UI ---');

    await test('GET /admin delivers web/admin.html with dark luxury dashboard layout', async () => {
      const res = await request('GET', '/admin');
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers['content-type'].includes('text/html'), 'Must serve HTML content');
      assert.ok(res.data.includes('Zero to Billionaire'), 'Must contain Zero to Billionaire title');
      assert.ok(res.data.includes('login-section'), 'Must contain login section');
      assert.ok(res.data.includes('dashboard-section'), 'Must contain dashboard section');
      assert.ok(res.data.includes('traffic-svg-chart'), 'Must contain SVG chart element');
      assert.ok(res.data.includes('admin.js'), 'Must load admin.js script');
    });

    await test('GET /admin.html delivers web/admin.html identically', async () => {
      const res = await request('GET', '/admin.html');
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers['content-type'].includes('text/html'));
      assert.ok(res.data.includes('traffic-svg-chart'));
    });

  } finally {
    await stopServer();
    if (fs.existsSync(TEST_DB_PATH)) {
      try {
        fs.unlinkSync(TEST_DB_PATH);
      } catch (e) {
        // Ignore unlink on Windows if file handle is settling
      }
    }
  }

  console.log('\n======================================================');
  console.log(`Results: ${passedTests}/${totalTests} tests passed (${failedTests} failed)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
