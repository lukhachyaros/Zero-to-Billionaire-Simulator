/**
 * Zero to Billionaire Simulator — Admin Traffic & Analytics Dashboard Script
 */

(function () {
  'use strict';

  // State
  let adminToken = localStorage.getItem('ztb_admin_token') || null;
  let refreshTimer = null;
  let clockTimer = null;
  let isPolling = false;
  const POLL_INTERVAL_MS = 4000; // 4 seconds

  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('admin-password');
  const loginError = document.getElementById('login-error');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const btnLogout = document.getElementById('btn-logout');
  const btnRefresh = document.getElementById('btn-refresh');
  const liveClockEl = document.getElementById('live-clock');
  const syncStatusText = document.getElementById('sync-status-text');

  // KPI elements
  const elActiveSessions = document.getElementById('kpi-active-sessions');
  const elUniqueVisitors = document.getElementById('kpi-unique-visitors');
  const elPageViews = document.getElementById('kpi-page-views');
  const elTotalRequests = document.getElementById('kpi-total-requests');
  const elAvgLatency = document.getElementById('kpi-avg-latency');
  const elErrorRate = document.getElementById('kpi-error-rate');
  const elBotRequests = document.getElementById('kpi-bot-requests');

  // SVG Chart
  const svgChart = document.getElementById('traffic-svg-chart');
  const chartTooltip = document.getElementById('chart-tooltip');
  const chartContainer = document.getElementById('chart-container');

  // Breakdown elements
  const labelPctDesktop = document.getElementById('label-pct-desktop');
  const labelPctMobile = document.getElementById('label-pct-mobile');
  const labelPctTablet = document.getElementById('label-pct-tablet');
  const barDesktop = document.getElementById('bar-desktop');
  const barMobile = document.getElementById('bar-mobile');
  const barTablet = document.getElementById('bar-tablet');
  const referrerListContainer = document.getElementById('referrer-list-container');

  // Logs table
  const liveLogsTbody = document.getElementById('live-logs-tbody');
  const logsCountLabel = document.getElementById('logs-count-label');

  /**
   * Helper for authenticated API calls
   */
  async function apiFetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (adminToken) {
      headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Unauthorized');
    }

    return response;
  }

  /**
   * Handle unauthenticated session
   */
  function handleUnauthorized() {
    adminToken = null;
    localStorage.removeItem('ztb_admin_token');
    stopPolling();
    loginSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
    btnLogout.style.display = 'none';
    syncStatusText.textContent = 'Yêu cầu đăng nhập';
  }

  /**
   * Handle authenticated session
   */
  function handleAuthenticated(token) {
    if (token) {
      adminToken = token;
      localStorage.setItem('ztb_admin_token', token);
    }
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    btnLogout.style.display = 'inline-flex';
    syncStatusText.textContent = 'Trực tuyến (3s)';
    startPolling();
    refreshAllData();
  }

  /**
   * Clock update ticker
   */
  function updateLiveClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false });
    const dateStr = now.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    if (liveClockEl) {
      liveClockEl.textContent = `${timeStr} — ${dateStr}`;
    }
  }

  /**
   * Login Form Submission
   */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    loginError.textContent = '';
    btnSubmitLogin.disabled = true;
    btnSubmitLogin.textContent = 'Đang xác thực...';

    const password = passwordInput.value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        passwordInput.value = '';
        handleAuthenticated(data.token);
      } else {
        loginError.style.display = 'block';
        if (res.status === 429) {
          loginError.textContent = data.error || 'Tài khoản bị tạm khóa. Vui lòng thử lại sau.';
        } else {
          loginError.textContent = data.error || 'Mật khẩu quản trị viên không chính xác.';
        }
      }
    } catch (err) {
      loginError.style.display = 'block';
      loginError.textContent = 'Không thể kết nối đến máy chủ: ' + err.message;
    } finally {
      btnSubmitLogin.disabled = false;
      btnSubmitLogin.textContent = 'Đăng Nhập Quản Trị';
    }
  });

  /**
   * Logout Button
   */
  btnLogout.addEventListener('click', async () => {
    try {
      await apiFetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      // Ignore
    }
    handleUnauthorized();
  });

  /**
   * Manual Refresh Button
   */
  btnRefresh.addEventListener('click', () => {
    btnRefresh.textContent = 'Đang tải...';
    refreshAllData().finally(() => {
      setTimeout(() => {
        btnRefresh.textContent = '↻ Làm mới';
      }, 500);
    });
  });

  /**
   * Start periodic background polling
   */
  function startPolling() {
    if (isPolling) return;
    isPolling = true;
    refreshTimer = setInterval(() => {
      refreshAllData();
    }, POLL_INTERVAL_MS);
  }

  /**
   * Stop background polling
   */
  function stopPolling() {
    isPolling = false;
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  /**
   * Refresh all dashboard telemetry data
   */
  async function refreshAllData() {
    if (!adminToken) return;

    try {
      await Promise.all([
        loadSummary(),
        loadTimeseries(),
        loadBreakdown(),
        loadLiveLogs()
      ]);
      syncStatusText.textContent = 'Trực tuyến (3s)';
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        syncStatusText.textContent = 'Lỗi kết nối';
      }
    }
  }

  /**
   * 1. Load KPI Summary
   */
  async function loadSummary() {
    const res = await apiFetch('/api/admin/traffic/summary');
    const data = await res.json();
    if (!data.success) return;

    elActiveSessions.textContent = (data.activeSessions || 0).toLocaleString('vi-VN');
    elUniqueVisitors.textContent = (data.uniqueVisitorsToday || 0).toLocaleString('vi-VN');
    elPageViews.textContent = (data.pageViewsToday || 0).toLocaleString('vi-VN');
    elTotalRequests.textContent = `${(data.totalRequestsToday || 0).toLocaleString('vi-VN')} tổng requests`;
    elAvgLatency.textContent = data.avgLatencyMs || '0';
    elErrorRate.textContent = `${data.errorRatePct || 0}%`;
    elBotRequests.textContent = (data.botRequestCount || 0).toLocaleString('vi-VN');
  }

  /**
   * 2. Load 24-Hour Timeseries Chart
   */
  async function loadTimeseries() {
    const res = await apiFetch('/api/admin/traffic/timeseries?hours=24');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.timeseries)) return;

    renderSvgChart(data.timeseries);
  }

  /**
   * Render Pure Responsive SVG Chart (Page Views & Unique Visitors)
   */
  function renderSvgChart(series) {
    if (!series || series.length === 0) return;

    const width = 1000;
    const height = 260;
    const padLeft = 50;
    const padRight = 30;
    const padTop = 20;
    const padBottom = 40;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    // Find max value for scaling (at least 10 for clean look)
    let maxVal = 10;
    for (const pt of series) {
      if (pt.pageViews > maxVal) maxVal = pt.pageViews;
      if (pt.uniqueVisitors > maxVal) maxVal = pt.uniqueVisitors;
    }
    // Round up maxVal to a pleasing integer
    maxVal = Math.ceil(maxVal * 1.15);

    const n = series.length;
    const stepX = plotWidth / Math.max(n - 1, 1);

    // Compute coordinate points
    const pvPoints = [];
    const uvPoints = [];

    series.forEach((pt, idx) => {
      const x = padLeft + idx * stepX;
      const yPv = padTop + plotHeight - (pt.pageViews / maxVal) * plotHeight;
      const yUv = padTop + plotHeight - (pt.uniqueVisitors / maxVal) * plotHeight;
      pvPoints.push({ x, y: yPv, data: pt });
      uvPoints.push({ x, y: yUv, data: pt });
    });

    // Build SVG paths
    const pvLinePath = pvPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const pvAreaPath = `${pvLinePath} L ${pvPoints[pvPoints.length - 1].x.toFixed(1)} ${padTop + plotHeight} L ${padLeft} ${padTop + plotHeight} Z`;

    const uvLinePath = uvPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const uvAreaPath = `${uvLinePath} L ${uvPoints[uvPoints.length - 1].x.toFixed(1)} ${padTop + plotHeight} L ${padLeft} ${padTop + plotHeight} Z`;

    // Horizontal Gridlines & Y-axis labels
    let gridHtml = '';
    const gridLevels = 4;
    for (let i = 0; i <= gridLevels; i++) {
      const y = padTop + (plotHeight / gridLevels) * i;
      const val = Math.round(maxVal - (maxVal / gridLevels) * i);
      gridHtml += `
        <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="rgba(51, 65, 85, 0.4)" stroke-dasharray="4" />
        <text x="${padLeft - 10}" y="${y + 4}" fill="#64748b" font-size="11" text-anchor="end">${val}</text>
      `;
    }

    // X-axis Hour Labels (show every 3-4 hours)
    let xLabelsHtml = '';
    const labelStep = Math.max(1, Math.floor(n / 6));
    series.forEach((pt, idx) => {
      if (idx % labelStep === 0 || idx === n - 1) {
        const x = padLeft + idx * stepX;
        const timePart = pt.hour ? pt.hour.split(' ')[1] : '';
        xLabelsHtml += `
          <line x1="${x}" y1="${padTop + plotHeight}" x2="${x}" y2="${padTop + plotHeight + 6}" stroke="#475569" />
          <text x="${x}" y="${padTop + plotHeight + 20}" fill="#94a3b8" font-size="11" text-anchor="middle">${timePart}</text>
        `;
      }
    });

    // Interactive Hover Circles
    let interactiveCirclesHtml = '';
    pvPoints.forEach((p, idx) => {
      const hourLabel = p.data.hour || '';
      const pv = p.data.pageViews || 0;
      const uv = p.data.uniqueVisitors || 0;
      const reqs = p.data.requests || 0;
      interactiveCirclesHtml += `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#fbbf24" stroke="#070b18" stroke-width="2" class="chart-point" data-hour="${hourLabel}" data-pv="${pv}" data-uv="${uv}" data-reqs="${reqs}" style="cursor: pointer;" />
      `;
    });

    // Assemble full SVG
    svgChart.innerHTML = `
      <defs>
        <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Grid -->
      ${gridHtml}
      ${xLabelsHtml}

      <!-- Page Views Area & Line (Gold) -->
      <path d="${pvAreaPath}" fill="url(#goldAreaGrad)" />
      <path d="${pvLinePath}" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Unique Visitors Area & Line (Cyan) -->
      <path d="${uvAreaPath}" fill="url(#cyanAreaGrad)" />
      <path d="${uvLinePath}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Data Dots -->
      ${interactiveCirclesHtml}
    `;

    // Tooltip event handlers
    const circles = svgChart.querySelectorAll('.chart-point');
    circles.forEach(c => {
      c.addEventListener('mouseenter', (e) => {
        const hour = c.getAttribute('data-hour');
        const pv = c.getAttribute('data-pv');
        const uv = c.getAttribute('data-uv');
        const reqs = c.getAttribute('data-reqs');

        chartTooltip.innerHTML = `
          <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">🕒 ${hour}</div>
          <div style="color: #fbbf24;">👁️ Lượt xem: <strong>${pv}</strong></div>
          <div style="color: #38bdf8;">👥 Khách duy nhất: <strong>${uv}</strong></div>
          <div style="color: #94a3b8; font-size: 0.75rem; margin-top: 2px;">⚡ Tổng requests: ${reqs}</div>
        `;
        chartTooltip.style.display = 'block';

        const rect = chartContainer.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        chartTooltip.style.left = `${Math.min(clientX + 10, rect.width - 150)}px`;
        chartTooltip.style.top = `${Math.max(clientY - 60, 10)}px`;
      });

      c.addEventListener('mouseleave', () => {
        chartTooltip.style.display = 'none';
      });
    });
  }

  /**
   * 3. Load Breakdown (Devices & Top Referrers)
   */
  async function loadBreakdown() {
    const res = await apiFetch('/api/admin/traffic/breakdown');
    const data = await res.json();
    if (!data.success) return;

    // Devices
    const dPct = data.desktopPct || 0;
    const mPct = data.mobilePct || 0;
    const tPct = data.tabletPct || 0;
    const counts = data.devices || {};

    labelPctDesktop.textContent = `${dPct}% (${(counts.desktop || 0).toLocaleString()})`;
    labelPctMobile.textContent = `${mPct}% (${(counts.mobile || 0).toLocaleString()})`;
    labelPctTablet.textContent = `${tPct}% (${(counts.tablet || 0).toLocaleString()})`;

    barDesktop.style.width = `${dPct}%`;
    barMobile.style.width = `${mPct}%`;
    barTablet.style.width = `${tPct}%`;

    // Referrers
    const referrers = data.referrers || [];
    if (referrers.length === 0) {
      referrerListContainer.innerHTML = `
        <li class="referrer-item">
          <span class="referrer-name" style="color: var(--text-muted);">Chưa có dữ liệu nguồn truy cập</span>
          <span class="referrer-count">0</span>
        </li>
      `;
    } else {
      referrerListContainer.innerHTML = referrers.map(r => `
        <li class="referrer-item">
          <span class="referrer-name" title="${escapeHtml(r.referrer)}">🔗 ${escapeHtml(r.referrer)}</span>
          <span class="referrer-count">${r.count.toLocaleString()}</span>
        </li>
      `).join('');
    }
  }

  /**
   * 4. Load Live Request Stream
   */
  async function loadLiveLogs() {
    const res = await apiFetch('/api/admin/traffic/live-logs?limit=50');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.logs)) return;

    logsCountLabel.textContent = `${data.logs.length} yêu cầu`;

    if (data.logs.length === 0) {
      liveLogsTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Chưa có yêu cầu nào được ghi nhận.</td>
        </tr>
      `;
      return;
    }

    liveLogsTbody.innerHTML = data.logs.map(log => {
      // Status badge class
      let statusClass = 'badge-status-2xx';
      if (log.statusCode >= 500) statusClass = 'badge-status-5xx';
      else if (log.statusCode >= 400) statusClass = 'badge-status-4xx';
      else if (log.statusCode >= 300) statusClass = 'badge-status-3xx';

      // Method badge class
      const methodClass = log.method === 'POST' ? 'badge-method-post' : 'badge-method-get';

      // Device badge
      const deviceBadge = log.isBot 
        ? `<span class="badge badge-bot">🤖 Bot</span>` 
        : `<span class="badge badge-device">${escapeHtml(log.deviceType)}</span>`;

      return `
        <tr>
          <td>${log.timeStr || '--:--:--'}</td>
          <td><span class="badge ${methodClass}">${escapeHtml(log.method)}</span></td>
          <td class="url-text" title="${escapeHtml(log.path)}">${escapeHtml(truncateString(log.path, 40))}</td>
          <td><span class="badge ${statusClass}">${log.statusCode}</span></td>
          <td>${log.latencyMs ? log.latencyMs + ' ms' : '< 1 ms'}</td>
          <td>${deviceBadge}</td>
          <td class="ip-snippet">${escapeHtml(log.ipHashSnippet || '')}</td>
        </tr>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function truncateString(str, maxLen) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 3) + '...';
  }

  // Initial Boot
  function init() {
    updateLiveClock();
    clockTimer = setInterval(updateLiveClock, 1000);

    // If existing token, check validity
    if (adminToken) {
      apiFetch('/api/admin/me')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.authenticated) {
            handleAuthenticated();
          } else {
            handleUnauthorized();
          }
        })
        .catch(() => {
          handleUnauthorized();
        });
    } else {
      handleUnauthorized();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
