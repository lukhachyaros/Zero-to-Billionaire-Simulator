// Real-Time Cross-Player Leaderboard via MQTT over Secure WebSockets + BroadcastChannel + Offline Cache
(function () {
  const UID_KEY = "ztb_player_uid_v1";
  const CACHE_KEY = "ztb_online_players_cache_v2";
  const TOPIC_PREFIX = "ztb/lukhachyaros/v2";
  const BROKERS = [
    "wss://broker.emqx.io:8084/mqtt",
    "wss://broker.hivemq.com:8884/mqtt"
  ];

  const encoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder() : null;

  function toUtf8(str) {
    if (encoder) return encoder.encode(String(str || ""));
    const raw = unescape(encodeURIComponent(String(str || "")));
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function fromUtf8(bytes) {
    if (decoder) return decoder.decode(bytes);
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    try {
      return decodeURIComponent(escape(s));
    } catch (_) {
      return s;
    }
  }

  function encodeMqttString(str) {
    const b = toUtf8(str);
    const out = new Uint8Array(2 + b.length);
    out[0] = (b.length >> 8) & 0xff;
    out[1] = b.length & 0xff;
    out.set(b, 2);
    return out;
  }

  function buildMqttPacket(headerByte, parts) {
    let payloadLen = 0;
    for (let i = 0; i < parts.length; i++) payloadLen += parts[i].length;
    const remBytes = [];
    let x = payloadLen;
    do {
      let digit = x & 0x7f;
      x >>= 7;
      if (x > 0) digit |= 0x80;
      remBytes.push(digit);
    } while (x > 0);

    const pkt = new Uint8Array(1 + remBytes.length + payloadLen);
    pkt[0] = headerByte;
    let pos = 1;
    for (let i = 0; i < remBytes.length; i++) pkt[pos++] = remBytes[i];
    for (let i = 0; i < parts.length; i++) {
      pkt.set(parts[i], pos);
      pos += parts[i].length;
    }
    return pkt;
  }

  function sanitizeEntry(raw) {
    if (!raw || typeof raw !== "object") return null;
    const uid = typeof raw.uid === "string" ? raw.uid.trim().slice(0, 48) : "";
    if (!uid || !/^[a-zA-Z0-9_-]+$/.test(uid)) return null;

    const name = typeof raw.name === "string" ? raw.name.trim().slice(0, 30) : "Ẩn danh";
    if (!name) return null;

    const net = Number(raw.netWorth);
    if (!Number.isFinite(net)) return null;
    const peak = Number.isFinite(Number(raw.peakNetWorth)) ? Number(raw.peakNetWorth) : net;

    return {
      uid,
      name,
      age: Math.max(0, Math.min(130, Math.round(Number(raw.age) || 0))),
      gen: Math.max(1, Math.min(999, Math.round(Number(raw.gen) || 1))),
      job: typeof raw.job === "string" ? raw.job.trim().slice(0, 44) : "Tự do",
      netWorth: Math.max(-1e15, Math.min(1e16, Math.round(net))),
      peakNetWorth: Math.max(-1e15, Math.min(1e16, Math.round(Math.max(peak, net)))),
      vip: !!raw.vip,
      alive: raw.alive !== false,
      ts: Number.isFinite(Number(raw.ts)) ? Number(raw.ts) : Date.now()
    };
  }

  class LiveLeaderboardClient {
    constructor() {
      this.uid = this.ensureUid();
      this.players = {};
      this.onlineFlags = {};
      this.lastSeenLocal = {};
      this.localState = null;
      this.onUpdate = null;

      this.ws = null;
      this.connected = false;
      this.brokerIdx = 0;
      this.failStreak = 0;
      this.reconnectTimer = null;
      this.pingTimer = null;
      this.heartbeatTimer = null;
      this.pruneTimer = null;
      this.publishDebounce = null;
      this.bc = null;

      this.loadCache();
    }

    ensureUid() {
      try {
        if (typeof window !== "undefined" && window.location && window.location.search) {
          const params = new URLSearchParams(window.location.search);
          const peerSlot = params.get("peer");
          if (peerSlot && /^[a-zA-Z0-9_-]{1,20}$/.test(peerSlot)) {
            const skey = `${UID_KEY}_peer_${peerSlot}`;
            const sExisting = sessionStorage.getItem(skey);
            if (sExisting && /^[a-zA-Z0-9_-]{6,48}$/.test(sExisting)) return sExisting;
            const sFresh = `p_${peerSlot}_${Math.random().toString(36).slice(2, 8)}`;
            sessionStorage.setItem(skey, sFresh);
            return sFresh;
          }
        }
        const existing = localStorage.getItem(UID_KEY);
        if (existing && /^[a-zA-Z0-9_-]{6,48}$/.test(existing)) return existing;
        const fresh = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem(UID_KEY, fresh);
        return fresh;
      } catch (_) {
        return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      }
    }

    getPlayerId() {
      return this.uid;
    }

    setPlayerId(nextUid) {
      if (typeof nextUid !== "string") return;
      const cleaned = nextUid.trim().slice(0, 48);
      if (!cleaned || !/^[a-zA-Z0-9_-]+$/.test(cleaned)) return;
      this.uid = cleaned;
      try {
        localStorage.setItem(UID_KEY, cleaned);
      } catch (_) {}
      this.onlineFlags[this.uid] = "1";
    }

    loadCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          arr.forEach((item) => {
            const clean = sanitizeEntry(item);
            if (clean && (clean.uid === this.uid || clean.netWorth > 0 || clean.age > 0)) {
              this.players[clean.uid] = clean;
            }
          });
        }
      } catch (_) {}
    }

    saveCache() {
      try {
        const arr = Object.values(this.players)
          .filter((p) => p.uid === this.uid || p.netWorth > 0 || p.age > 0)
          .sort((a, b) => b.netWorth - a.netWorth)
          .slice(0, 80);
        localStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      } catch (_) {}
    }

    init(opts = {}) {
      this.onUpdate = typeof opts.onUpdate === "function" ? opts.onUpdate : null;
      this.lastSeenLocal[this.uid] = Date.now();
      this.onlineFlags[this.uid] = "1";

      if (typeof BroadcastChannel !== "undefined") {
        try {
          this.bc = new BroadcastChannel("ztb_live_players_v2");
          this.bc.onmessage = (ev) => {
            const data = ev.data;
            if (!data || typeof data !== "object") return;
            if (data.type === "player" && data.payload) {
              const clean = sanitizeEntry(data.payload);
              if (clean) {
                this.players[clean.uid] = clean;
                this.onlineFlags[clean.uid] = "1";
                this.lastSeenLocal[clean.uid] = Date.now();
                this.saveCache();
                if (this.onUpdate) this.onUpdate();
              }
            } else if (data.type === "ping" && data.uid !== this.uid && this.localState) {
              try {
                this.bc.postMessage({ type: "player", payload: this.localState });
              } catch (_) {}
            } else if (data.type === "offline" && data.uid) {
              this.onlineFlags[data.uid] = "0";
              delete this.lastSeenLocal[data.uid];
              if (this.onUpdate) this.onUpdate();
            }
          };
          this.bc.postMessage({ type: "ping", uid: this.uid });
        } catch (_) {}
      }

      if (this.pruneTimer) clearInterval(this.pruneTimer);
      this.pruneTimer = setInterval(() => {
        if (this.onUpdate) this.onUpdate();
      }, 15_000);

      if (typeof window !== "undefined") {
        window.addEventListener("pagehide", () => this.sendOfflineSignal());
        window.addEventListener("beforeunload", () => this.sendOfflineSignal());
        window.addEventListener("online", () => {
          if (!this.connected) this.connectNextBroker();
        });
      }

      this.connectNextBroker();
    }

    clearTimers() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    }

    connectNextBroker() {
      this.clearTimers();
      if (typeof WebSocket === "undefined") return;
      if (typeof navigator !== "undefined" && navigator.onLine === false) return;

      if (this.ws) {
        try {
          this.ws.onopen = null;
          this.ws.onmessage = null;
          this.ws.onerror = null;
          this.ws.onclose = null;
          this.ws.close();
        } catch (_) {}
        this.ws = null;
      }

      this.connected = false;
      const url = BROKERS[this.brokerIdx % BROKERS.length];
      try {
        const ws = new WebSocket(url, "mqtt");
        ws.binaryType = "arraybuffer";
        this.ws = ws;

        ws.onopen = () => {
          this.sendConnectPacket();
        };

        ws.onmessage = (ev) => {
          this.handleIncomingBytes(ev.data);
        };

        ws.onerror = () => {
          // Wait for onclose to schedule reconnect on alternate broker
        };

        ws.onclose = () => {
          const wasConnected = this.connected;
          this.connected = false;
          this.clearTimers();
          if (this.onUpdate && wasConnected) this.onUpdate();
          this.failStreak += 1;
          if (this.failStreak >= 2) {
            this.brokerIdx = (this.brokerIdx + 1) % BROKERS.length;
            this.failStreak = 0;
          }
          this.reconnectTimer = setTimeout(() => this.connectNextBroker(), wasConnected ? 3500 : 6000);
        };
      } catch (_) {
        this.brokerIdx = (this.brokerIdx + 1) % BROKERS.length;
        this.reconnectTimer = setTimeout(() => this.connectNextBroker(), 8000);
      }
    }

    sendRaw(bytes) {
      if (!this.ws || this.ws.readyState !== 1) return false;
      try {
        this.ws.send(bytes);
        return true;
      } catch (_) {
        return false;
      }
    }

    sendConnectPacket() {
      const clientId = `ztb_${this.uid.slice(-14)}_${Math.floor(Math.random() * 90 + 10)}`;
      const willTopic = `${TOPIC_PREFIX}/online/${this.uid}`;
      const fixedProto = new Uint8Array([
        0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, // "MQTT"
        0x04, // Level 4 (3.1.1)
        0x26, // CleanSession(0x02) + WillFlag(0x04) + WillRetain(0x20)
        0x00, 0x28 // KeepAlive = 40s
      ]);
      const pkt = buildMqttPacket(0x10, [
        fixedProto,
        encodeMqttString(clientId),
        encodeMqttString(willTopic),
        encodeMqttString("0")
      ]);
      this.sendRaw(pkt);
    }

    sendSubscribe(topicFilter) {
      const pid = new Uint8Array([0x00, 0x01]);
      const qos = new Uint8Array([0x00]);
      const pkt = buildMqttPacket(0x82, [pid, encodeMqttString(topicFilter), qos]);
      this.sendRaw(pkt);
    }

    sendPublish(topic, message, retain = true) {
      const hdr = retain ? 0x31 : 0x30;
      const pkt = buildMqttPacket(hdr, [encodeMqttString(topic), toUtf8(message)]);
      return this.sendRaw(pkt);
    }

    announceHeartbeat() {
      if (!this.connected) return;
      this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "1", true);
      this.sendPublish(`${TOPIC_PREFIX}/heartbeat/${this.uid}`, "1", false);
      if (this.localState) {
        this.sendPublish(`${TOPIC_PREFIX}/board/${this.uid}`, JSON.stringify(this.localState), true);
      }
    }

    sendOfflineSignal() {
      if (this.bc) {
        try {
          this.bc.postMessage({ type: "offline", uid: this.uid });
        } catch (_) {}
      }
      if (this.connected) {
        this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "0", true);
        this.sendPublish(`${TOPIC_PREFIX}/heartbeat/${this.uid}`, "0", false);
        this.sendRaw(new Uint8Array([0xe0, 0x00]));
      }
    }

    handleIncomingBytes(data) {
      if (!(data instanceof ArrayBuffer)) return;
      const buf = new Uint8Array(data);
      let offset = 0;

      while (offset < buf.length) {
        const hdr = buf[offset++];
        const ptype = hdr >> 4;
        let mult = 1;
        let remLen = 0;
        let b = 0;
        let malformed = false;
        do {
          if (offset >= buf.length) {
            malformed = true;
            break;
          }
          b = buf[offset++];
          remLen += (b & 0x7f) * mult;
          mult *= 128;
        } while ((b & 0x80) !== 0);

        if (malformed) break;
        const pktEnd = Math.min(buf.length, offset + remLen);

        if (ptype === 2) {
          // CONNACK
          if (offset + 1 < pktEnd && buf[offset + 1] === 0) {
            this.connected = true;
            this.failStreak = 0;
            this.sendSubscribe(`${TOPIC_PREFIX}/#`);
            this.announceHeartbeat();
            // Ping all currently active peers across devices so onlineCount syncs immediately
            this.sendPublish(`${TOPIC_PREFIX}/ping`, this.uid, false);
            this.startKeepAliveLoops();
            if (this.onUpdate) this.onUpdate();
          }
        } else if (ptype === 3) {
          // PUBLISH
          const retainFlag = (hdr & 0x01) === 1;
          const qos = (hdr >> 1) & 0x03;
          if (offset + 2 <= pktEnd) {
            const topicLen = (buf[offset] << 8) | buf[offset + 1];
            offset += 2;
            const topicEnd = Math.min(pktEnd, offset + topicLen);
            const topic = fromUtf8(buf.subarray(offset, topicEnd));
            offset = topicEnd;
            if (qos > 0 && offset + 2 <= pktEnd) {
              offset += 2; // Skip Packet Identifier on QoS 1/2 deliveries
            }
            const payloadStr = fromUtf8(buf.subarray(offset, pktEnd));
            this.handleMqttMessage(topic, payloadStr, retainFlag);
          }
        }

        offset = pktEnd;
      }
    }

    handleMqttMessage(topic, payloadStr, isRetained = false) {
      const onlinePrefix = `${TOPIC_PREFIX}/online/`;
      const hbPrefix = `${TOPIC_PREFIX}/heartbeat/`;
      const boardPrefix = `${TOPIC_PREFIX}/board/`;
      const pingTopic = `${TOPIC_PREFIX}/ping`;

      if (topic === pingTopic) {
        const sender = payloadStr.trim();
        if (sender && sender !== this.uid) {
          this.onlineFlags[sender] = "1";
          this.lastSeenLocal[sender] = Date.now();
          this.announceHeartbeat();
          if (this.onUpdate) this.onUpdate();
        }
      } else if (topic.startsWith(hbPrefix)) {
        const uid = topic.slice(hbPrefix.length).trim();
        if (!uid) return;
        const val = payloadStr.trim();
        if (val === "0") {
          this.onlineFlags[uid] = "0";
          delete this.lastSeenLocal[uid];
        } else {
          this.onlineFlags[uid] = "1";
          this.lastSeenLocal[uid] = Date.now();
        }
        if (this.onUpdate) this.onUpdate();
      } else if (topic.startsWith(onlinePrefix)) {
        const uid = topic.slice(onlinePrefix.length).trim();
        if (uid) {
          const flag = payloadStr.trim();
          this.onlineFlags[uid] = flag;
          if (flag === "0") {
            delete this.lastSeenLocal[uid];
          } else if (!isRetained) {
            // Live (non-retained) online="1" arrived right now -> mark active on local clock
            this.lastSeenLocal[uid] = Date.now();
          }
          if (this.onUpdate) this.onUpdate();
        }
      } else if (topic.startsWith(boardPrefix)) {
        try {
          const parsed = JSON.parse(payloadStr);
          const clean = sanitizeEntry(parsed);
          if (clean) {
            this.players[clean.uid] = clean;
            if (!isRetained && this.onlineFlags[clean.uid] !== "0") {
              this.lastSeenLocal[clean.uid] = Date.now();
            }
            this.saveCache();
            if (this.onUpdate) this.onUpdate();
          }
        } catch (_) {}
      }
    }

    startKeepAliveLoops() {
      if (this.pingTimer) clearInterval(this.pingTimer);
      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

      this.pingTimer = setInterval(() => {
        if (this.connected) this.sendRaw(new Uint8Array([0xc0, 0x00]));
      }, 22_000);

      this.heartbeatTimer = setInterval(() => {
        if (this.connected) {
          if (this.localState) this.localState.ts = Date.now();
          this.announceHeartbeat();
        }
        if (this.bc && this.localState) {
          try {
            this.bc.postMessage({ type: "player", payload: this.localState });
          } catch (_) {}
        }
      }, 20_000);
    }

    publishPlayerState(state, immediate = false) {
      const candidate = sanitizeEntry(Object.assign({}, state, {
        uid: this.uid,
        ts: Date.now()
      }));
      if (!candidate) return;

      this.localState = candidate;
      this.players[this.uid] = candidate;
      this.onlineFlags[this.uid] = "1";
      this.lastSeenLocal[this.uid] = Date.now();
      this.saveCache();

      if (this.bc) {
        try {
          this.bc.postMessage({ type: "player", payload: candidate });
        } catch (_) {}
      }

      const doSend = () => {
        if (this.connected) {
          this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "1", true);
          this.sendPublish(`${TOPIC_PREFIX}/heartbeat/${this.uid}`, "1", false);
          this.sendPublish(`${TOPIC_PREFIX}/board/${this.uid}`, JSON.stringify(candidate), true);
        }
      };

      if (immediate) {
        if (this.publishDebounce) {
          clearTimeout(this.publishDebounce);
          this.publishDebounce = null;
        }
        doSend();
      } else {
        if (this.publishDebounce) clearTimeout(this.publishDebounce);
        this.publishDebounce = setTimeout(doSend, 700);
      }
    }

    forceSync() {
      if (this.bc) {
        try {
          this.bc.postMessage({ type: "ping", uid: this.uid });
        } catch (_) {}
      }
      if (this.connected) {
        this.sendSubscribe(`${TOPIC_PREFIX}/#`);
        this.sendPublish(`${TOPIC_PREFIX}/ping`, this.uid, false);
        if (this.localState) this.publishPlayerState(this.localState, true);
      } else {
        this.connectNextBroker();
      }
    }

    getLeaderboardSnapshot() {
      const now = Date.now();
      const rawEntries = Object.values(this.players).map((p) => {
        const isMe = p.uid === this.uid;
        const seenAt = this.lastSeenLocal[p.uid] || 0;
        const freshLocal = seenAt > 0 && (now - seenAt) < 65_000;
        const isOnline = isMe || (this.onlineFlags[p.uid] !== "0" && freshLocal);
        return {
          uid: p.uid,
          name: p.name,
          age: p.age,
          gen: p.gen,
          job: p.job,
          netWorth: p.netWorth,
          peakNetWorth: p.peakNetWorth,
          vip: !!p.vip,
          alive: p.alive !== false,
          ts: p.ts || now,
          lastSeenLocal: seenAt,
          isPlayer: isMe,
          isOnline
        };
      });

      // Filter out unplayed dummy entries (netWorth <= 0 && age === 0 && !isPlayer)
      const validEntries = rawEntries.filter((e) => {
        if (!e.isPlayer && e.netWorth <= 0 && e.age === 0) return false;
        return true;
      });

      // Deduplicate entries by normalized player name (name.trim().toLowerCase())
      // Prioritize the current player's own record (isPlayer).
      // For duplicate names, retain entry with highest netWorth and most recent timestamp ts.
      const dedupedMap = new Map();
      for (const entry of validEntries) {
        const normKey = (entry.name || "").trim().toLowerCase();
        if (!normKey) continue;
        if (!dedupedMap.has(normKey)) {
          dedupedMap.set(normKey, entry);
          continue;
        }

        const existing = dedupedMap.get(normKey);

        // 1. Prioritize current player's own record
        if (entry.isPlayer && !existing.isPlayer) {
          entry.isOnline = entry.isOnline || existing.isOnline;
          dedupedMap.set(normKey, entry);
          continue;
        }
        if (existing.isPlayer && !entry.isPlayer) {
          existing.isOnline = existing.isOnline || entry.isOnline;
          continue;
        }

        // 2. Tie-break: highest netWorth, then peakNetWorth, then most recent ts
        let pickNew = false;
        if (entry.netWorth > existing.netWorth) {
          pickNew = true;
        } else if (entry.netWorth === existing.netWorth) {
          if (entry.peakNetWorth > existing.peakNetWorth) {
            pickNew = true;
          } else if (entry.peakNetWorth === existing.peakNetWorth) {
            if (entry.ts > existing.ts) {
              pickNew = true;
            }
          }
        }

        if (pickNew) {
          entry.isOnline = entry.isOnline || existing.isOnline;
          dedupedMap.set(normKey, entry);
        } else {
          existing.isOnline = existing.isOnline || entry.isOnline;
        }
      }

      const entries = Array.from(dedupedMap.values());
      entries.sort((a, b) => {
        if (b.netWorth !== a.netWorth) return b.netWorth - a.netWorth;
        return b.peakNetWorth - a.peakNetWorth;
      });

      const onlineCount = Math.max(1, entries.filter((e) => e.isOnline).length);
      const activeUrl = BROKERS[this.brokerIdx % BROKERS.length];
      let brokerHost = "local";
      try {
        brokerHost = new URL(activeUrl).hostname;
      } catch (_) {}

      return {
        connected: this.connected,
        brokerHost,
        onlineCount,
        totalPlayers: entries.length,
        entries
      };
    }
  }

  window.ZTBLiveBoard = new LiveLeaderboardClient();
})();
