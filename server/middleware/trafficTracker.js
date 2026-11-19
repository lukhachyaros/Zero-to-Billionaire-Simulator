const crypto = require('crypto');
const config = require('../config');
const db = require('../db/database');

// Bot detection regex
const BOT_REGEX = /(bot|crawler|spider|slurp|googlebot|bingbot|yandex|duckduckbot|baiduspider|headlesschrome|headless|lighthouse|curl|wget|python-requests|postman|axios|httpclient|urllib)/i;

// Static asset extensions regex
const STATIC_ASSET_REGEX = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|map|json|mp3|wav|ogg|webmanifest)$/i;

// Rapid reload debounce cache: Map<string, number> (key: `${visitorId}:${cleanPath}`)
const reloadDebounceMap = new Map();
const DEBOUNCE_WINDOW_MS = 1500; // 1.5s
const DEBOUNCE_CLEANUP_INTERVAL_MS = 60000; // 1 minute
let lastCleanup = Date.now();

/**
 * Clean up stale debounce entries
 */
function cleanStaleDebounceEntries() {
  const now = Date.now();
  if (now - lastCleanup < DEBOUNCE_CLEANUP_INTERVAL_MS && reloadDebounceMap.size < 5000) {
    return;
  }
  lastCleanup = now;
  for (const [key, timestamp] of reloadDebounceMap.entries()) {
    if (now - timestamp > DEBOUNCE_WINDOW_MS * 2) {
      reloadDebounceMap.delete(key);
    }
  }
}

/**
 * Parse standard HTTP Cookie header into key-value map
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader || typeof cookieHeader !== 'string') return cookies;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx !== -1) {
      const key = part.slice(0, idx).trim();
      const val = part.slice(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch (e) {
        cookies[key] = val;
      }
    }
  }
  return cookies;
}

/**
 * Append a Set-Cookie string to the response headers
 */
function appendSetCookie(res, cookieStr) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', cookieStr);
  } else if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookieStr]);
  } else {
    res.setHeader('Set-Cookie', [existing, cookieStr]);
  }
}

/**
 * Get daily rotating salt for IP anonymization
 */
function getDailySalt(dateStr = null) {
  const targetDate = dateStr || new Date().toISOString().slice(0, 10);
  return crypto
    .createHmac('sha256', config.tokenSecret)
    .update(`ztb_traffic_daily_salt_${targetDate}`)
    .digest('hex');
}

/**
 * Anonymize client IP using SHA-256(Client_IP + Server_Daily_Salt)
 * Stores ONLY the hash, never the raw IP.
 */
function anonymizeIp(rawIp, dateStr = null) {
  if (!rawIp || typeof rawIp !== 'string') {
    return crypto.createHash('sha256').update('0.0.0.0_unknown').digest('hex');
  }
  // Normalize IPv6 loopback and mapped IPv4
  let cleanIp = rawIp.trim();
  if (cleanIp === '::1') cleanIp = '127.0.0.1';
  if (cleanIp.startsWith('::ffff:')) cleanIp = cleanIp.slice(7);

  const salt = getDailySalt(dateStr);
  return crypto
    .createHash('sha256')
    .update(`${cleanIp}:${salt}`)
    .digest('hex');
}

/**
 * Check if User-Agent indicates an automated crawler, bot, or script
 */
function isBotUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return BOT_REGEX.test(userAgent);
}

/**
 * Classify client device type: 'desktop', 'mobile', 'tablet', or 'bot'
 */
function classifyDevice(userAgent) {
  if (!userAgent) return 'desktop';
  if (isBotUserAgent(userAgent)) return 'bot';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Check if request is an HTML page view
 */
function isPageViewRequest(req) {
  if (req.method !== 'GET') return false;

  const urlPath = req.path || '/';

  // API calls are never HTML page views
  if (urlPath.startsWith('/api/')) return false;

  // Static assets are never page views
  if (STATIC_ASSET_REGEX.test(urlPath)) return false;

  // Root or explicit HTML files
  if (
    urlPath === '/' ||
    urlPath === '/index.html' ||
    urlPath === '/admin' ||
    urlPath === '/admin.html' ||
    urlPath === '/web' ||
    urlPath === '/web/' ||
    urlPath === '/web/index.html' ||
    urlPath === '/web/admin.html'
  ) {
    return true;
  }

  // Check Accept header
  const accept = req.headers['accept'] || '';
  if (accept.includes('text/html') && !STATIC_ASSET_REGEX.test(urlPath)) {
    return true;
  }

  return false;
}

/**
 * Main Traffic Tracker Express Middleware
 */
function trafficTracker(req, res, next) {
  const startTime = process.hrtime.bigint();
  const cookies = parseCookies(req.headers['cookie']);

  // 1. Persistent Visitor ID (ztb_vid, 1 year)
  let visitorId = cookies['ztb_vid'];
  let isNewVid = false;
  if (!visitorId || typeof visitorId !== 'string' || visitorId.length < 8) {
    visitorId = `vid_${crypto.randomBytes(16).toString('hex')}`;
    isNewVid = true;
    // Set 1-year persistent cookie
    appendSetCookie(
      res,
      `ztb_vid=${encodeURIComponent(visitorId)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax`
    );
  }
  req.visitorId = visitorId;

  // 2. Rolling Session ID (ztb_sid, 30 min)
  let sessionId = cookies['ztb_sid'];
  let isNewSid = false;
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 8) {
    sessionId = `sid_${crypto.randomBytes(16).toString('hex')}`;
    isNewSid = true;
  }
  // Refresh rolling 30-min cookie
  appendSetCookie(
    res,
    `ztb_sid=${encodeURIComponent(sessionId)}; Path=/; Max-Age=1800; HttpOnly; SameSite=Lax`
  );
  req.trafficSessionId = sessionId;

  // 3. Client IP Extraction & Anonymization
  const rawIp =
    (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',')[0].trim()) ||
    req.socket.remoteAddress ||
    req.ip ||
    '127.0.0.1';
  const ipHash = anonymizeIp(rawIp);
  req.ipHash = ipHash;

  // 4. Bot & Device Detection
  const userAgent = req.headers['user-agent'] || '';
  const isBot = isBotUserAgent(userAgent);
  const deviceType = classifyDevice(userAgent);

  // 5. Page View Classification & Rapid Reload Debounce
  let isPageView = isPageViewRequest(req);
  if (isPageView && !isBot) {
    cleanStaleDebounceEntries();
    const cleanPath = req.path || '/';
    const debounceKey = `${visitorId}:${cleanPath}`;
    const now = Date.now();
    const lastRequestTime = reloadDebounceMap.get(debounceKey);

    if (lastRequestTime && now - lastRequestTime < DEBOUNCE_WINDOW_MS) {
      // Rapid reload within 1.5s — debounce so page views aren't artificially inflated
      isPageView = false;
    } else {
      reloadDebounceMap.set(debounceKey, now);
    }
  }

  // 6. Record on request completion
  res.on('finish', () => {
    try {
      const elapsedMs = Number(process.hrtime.bigint() - startTime) / 1e6;
      const responseTimeMs = Math.round(elapsedMs * 10) / 10;
      const referer = req.headers['referer'] || req.headers['referrer'] || null;

      db.traffic.log({
        ipHash,
        sessionId,
        visitorId,
        path: req.originalUrl || req.url || req.path || '/',
        method: req.method,
        statusCode: res.statusCode,
        userAgent: userAgent ? userAgent.slice(0, 500) : null,
        referer: referer ? referer.slice(0, 500) : null,
        responseTimeMs,
        deviceType,
        isPageView: isPageView ? 1 : 0,
        isBot: isBot ? 1 : 0
      });
    } catch (err) {
      console.error('[TrafficTracker] Error logging request:', err.message);
    }
  });

  next();
}

module.exports = {
  trafficTracker,
  parseCookies,
  getDailySalt,
  anonymizeIp,
  isBotUserAgent,
  classifyDevice,
  isPageViewRequest,
  reloadDebounceMap,
  DEBOUNCE_WINDOW_MS
};
