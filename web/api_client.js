// Zero to Billionaire Simulator — Cloud Persistence & Cross-Device Sync API Client (M3)
(function (global) {
  'use strict';

  const AUTH_TOKEN_KEY = 'ztb_auth_token';
  const PLAYER_ID_KEY = 'ztb_player_id';
  const SYNC_CODE_KEY = 'ztb_sync_code';
  const PENDING_SYNC_KEY = 'ztb_pending_sync';
  const LEGACY_MIGRATED_KEY = 'ztb_legacy_migrated';
  const SAVE_KEY = 'ztb_web_save_v2';

  class ApiClient {
    constructor() {
      this.apiBase = this.resolveApiBase();
      this.syncTimer = null;
      this.isSyncing = false;
      this.authPromise = null;

      this.bindEvents();
    }

    resolveApiBase() {
      if (typeof window === 'undefined') return '';
      if (window.ZTB_API_URL) return window.ZTB_API_URL;
      // If run directly from file:// or empty origin, fallback to local backend port 3000
      if (window.location.protocol === 'file:' || !window.location.host || window.location.origin === 'null') {
        return 'http://localhost:3000';
      }
      return '';
    }

    getToken() {
      try {
        return localStorage.getItem(AUTH_TOKEN_KEY) || '';
      } catch (_) {
        return '';
      }
    }

    getPlayerId() {
      try {
        return localStorage.getItem(PLAYER_ID_KEY) || '';
      } catch (_) {
        return '';
      }
    }

    getSyncCode() {
      try {
        return localStorage.getItem(SYNC_CODE_KEY) || '';
      } catch (_) {
        return '';
      }
    }

    setAuth(token, playerId, syncCode) {
      try {
        if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
        if (playerId) localStorage.setItem(PLAYER_ID_KEY, playerId);
        if (syncCode) localStorage.setItem(SYNC_CODE_KEY, syncCode);
      } catch (_) {}
      this.updateSyncCodeUI(syncCode);
    }

    clearAuth() {
      try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(PLAYER_ID_KEY);
        localStorage.removeItem(SYNC_CODE_KEY);
      } catch (_) {}
      this.updateSyncCodeUI('');
    }

    updateSyncCodeUI(code) {
      const display = document.getElementById('display-sync-code');
      if (display) {
        display.textContent = code || 'Chưa khởi tạo';
      }
    }

    updateSyncStatus(status) {
      const statusEl = document.getElementById('cloud-sync-status');
      if (!statusEl) return;

      if (status === 'syncing') {
        statusEl.innerHTML = '⏳ Đang đồng bộ...';
        statusEl.style.color = '#fbbf24';
      } else if (status === 'synced') {
        statusEl.innerHTML = '🟢 Đã đồng bộ đám mây';
        statusEl.style.color = '#34d399';
      } else if (status === 'offline') {
        statusEl.innerHTML = '🟡 Chờ kết nối mạng (Lưu cục bộ)';
        statusEl.style.color = '#f59e0b';
      } else if (status === 'error') {
        statusEl.innerHTML = '🔴 Lỗi đồng bộ đám mây';
        statusEl.style.color = '#f87171';
      }
    }

    async ensureAuth(charName) {
      if (this.authPromise) return this.authPromise;

      this.authPromise = (async () => {
        const existingToken = this.getToken();
        if (existingToken) {
          // If token exists but syncCode missing, retrieve profile from server
          if (!this.getSyncCode()) {
            try {
              const res = await fetch(`${this.apiBase}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${existingToken}` }
              });
              if (res.ok) {
                const data = await res.json();
                if (data.success && data.player) {
                  this.setAuth(existingToken, data.player.id, data.player.syncCode);
                }
              }
            } catch (_) {}
          }
          return {
            token: existingToken,
            playerId: this.getPlayerId(),
            syncCode: this.getSyncCode()
          };
        }

        // Initialize instant anonymous guest account
        const displayName = charName || (window.ZTBSim?.stats?.characterName) || 'Tỷ Phú Tương Lai';
        try {
          const res = await fetch(`${this.apiBase}/api/auth/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              this.setAuth(data.token, data.playerId, data.syncCode);
              // Check if legacy save needs migration
              this.migrateLegacySave();
              return {
                token: data.token,
                playerId: data.playerId,
                syncCode: data.syncCode
              };
            }
          }
        } catch (err) {
          console.warn('[ApiClient] Failed to register guest account:', err);
        }
        return null;
      })().finally(() => {
        this.authPromise = null;
      });

      return this.authPromise;
    }

    async syncDevice(syncCode) {
      const cleanCode = String(syncCode || '').trim().toUpperCase();
      if (!cleanCode || cleanCode.length < 6) {
        return {
          success: false,
          error: 'Mã đồng bộ không hợp lệ. Định dạng chuẩn: ZTB-XXXX-XXXX'
        };
      }

      try {
        const res = await fetch(`${this.apiBase}/api/auth/sync-device`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ syncCode: cleanCode })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          this.setAuth(data.token, data.playerId, data.syncCode);

          if (data.latestSave) {
            const raw = typeof data.latestSave.saveData === 'string'
              ? data.latestSave.saveData
              : JSON.stringify(data.latestSave.saveData);

            if (window.ZTBSim && typeof window.ZTBSim.restoreSnapshot === 'function') {
              window.ZTBSim.restoreSnapshot(raw);
              if (typeof window.ZTBSim.renderAll === 'function') {
                window.ZTBSim.renderAll();
              }
            }
            try {
              localStorage.setItem(SAVE_KEY, raw);
            } catch (_) {}
          }

          this.updateSyncStatus('synced');
          if (window.ZTBSim && typeof window.ZTBSim.showToast === 'function') {
            window.ZTBSim.showToast('🎉 Đồng bộ thiết bị thành công! Đã tải tiến trình đám mây.');
          }

          return { success: true, latestSave: data.latestSave };
        } else {
          const errMsg = data.error || 'Mã đồng bộ không tồn tại hoặc không hợp lệ';
          return { success: false, error: errMsg };
        }
      } catch (err) {
        return {
          success: false,
          error: 'Không thể kết nối đến máy chủ: ' + (err.message || 'Lỗi mạng')
        };
      }
    }

    scheduleCloudSync() {
      if (this.syncTimer) clearTimeout(this.syncTimer);
      this.syncTimer = setTimeout(() => {
        this.saveToCloud(false);
      }, 3500);
    }

    async saveToCloud(immediate = false) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer);
        this.syncTimer = null;
      }

      if (this.isSyncing && !immediate) return { success: false, pending: true };

      let charName = 'Tỷ Phú';
      let age = 18;
      let generation = 1;
      let currentJob = 'Chưa đi làm';
      let netWorth = 0;
      let peakNetWorth = 0;
      let isAlive = true;
      let saveData = null;

      if (window.ZTBSim && typeof window.ZTBSim.captureSnapshot === 'function') {
        const snapStr = window.ZTBSim.captureSnapshot();
        try {
          saveData = JSON.parse(snapStr);
        } catch (_) {
          saveData = snapStr;
        }
        const s = window.ZTBSim.stats || (saveData && saveData.stats) || {};
        charName = s.characterName || charName;
        age = Number(s.age !== undefined ? s.age : age);
        generation = Number(s.generation || generation);
        currentJob = s.currentJob || currentJob;
        netWorth = typeof window.ZTBSim.getNetWorth === 'function' ? window.ZTBSim.getNetWorth() : Number(s.cash || 0);
        peakNetWorth = Math.max(Number(s.peakNetWorth || 0), netWorth);
        isAlive = s.isAlive !== false;
      } else {
        const localRaw = localStorage.getItem(SAVE_KEY);
        if (!localRaw) return { success: false, error: 'Chưa có dữ liệu bản lưu' };
        try {
          saveData = JSON.parse(localRaw);
          const s = saveData.stats || {};
          charName = s.characterName || charName;
          age = Number(s.age !== undefined ? s.age : age);
          generation = Number(s.generation || generation);
          currentJob = s.currentJob || currentJob;
          netWorth = Number(s.cash || 0);
          peakNetWorth = Math.max(Number(s.peakNetWorth || 0), netWorth);
          isAlive = s.isAlive !== false;
        } catch (_) {
          saveData = localRaw;
        }
      }

      let token = this.getToken();
      if (!token) {
        const authRes = await this.ensureAuth(charName);
        token = authRes?.token || this.getToken();
      }

      if (!token) {
        try {
          localStorage.setItem(PENDING_SYNC_KEY, 'true');
        } catch (_) {}
        this.updateSyncStatus('offline');
        return { success: false, error: 'Chưa xác thực tài khoản' };
      }

      this.isSyncing = true;
      this.updateSyncStatus('syncing');

      const payload = {
        slot: 0,
        characterName: charName,
        age,
        generation,
        currentJob,
        netWorth,
        peakNetWorth,
        isAlive,
        saveData
      };

      const fetchOpts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      };

      if (immediate && typeof fetch !== 'undefined') {
        fetchOpts.keepalive = true;
      }

      try {
        const res = await fetch(`${this.apiBase}/api/save`, fetchOpts);
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          try {
            localStorage.removeItem(PENDING_SYNC_KEY);
          } catch (_) {}
          this.updateSyncStatus('synced');
          this.isSyncing = false;
          return { success: true, slot: 0 };
        } else {
          try {
            localStorage.setItem(PENDING_SYNC_KEY, 'true');
          } catch (_) {}
          this.updateSyncStatus('offline');
          this.isSyncing = false;
          return { success: false, error: data.error };
        }
      } catch (err) {
        try {
          localStorage.setItem(PENDING_SYNC_KEY, 'true');
        } catch (_) {}
        this.updateSyncStatus('offline');
        this.isSyncing = false;
        return { success: false, error: err.message };
      }
    }

    migrateLegacySave() {
      try {
        const localSave = localStorage.getItem(SAVE_KEY);
        const alreadyMigrated = localStorage.getItem(LEGACY_MIGRATED_KEY);
        if (localSave && !alreadyMigrated) {
          this.saveToCloud(false).then((res) => {
            if (res && res.success) {
              localStorage.setItem(LEGACY_MIGRATED_KEY, 'true');
            }
          });
        }
      } catch (_) {}
    }

    bindEvents() {
      if (typeof window === 'undefined') return;

      window.addEventListener('online', () => {
        try {
          if (localStorage.getItem(PENDING_SYNC_KEY) === 'true') {
            this.saveToCloud(true);
          }
        } catch (_) {}
      });

      const onInit = () => {
        this.updateSyncCodeUI(this.getSyncCode());
        const hasPending = localStorage.getItem(PENDING_SYNC_KEY) === 'true';
        this.updateSyncStatus(hasPending ? 'offline' : 'synced');

        // Ensure player is authenticated in background
        this.ensureAuth().then(() => {
          if (hasPending) {
            this.saveToCloud(false);
          } else {
            this.migrateLegacySave();
          }
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onInit);
      } else {
        setTimeout(onInit, 0);
      }
    }
  }

  const clientInstance = new ApiClient();
  global.apiClient = clientInstance;
  global.ZTB_API = clientInstance;

})(typeof window !== 'undefined' ? window : this);
