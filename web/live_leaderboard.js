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
      this.localState = null;
      this.onUpdate = null;

      this.ws = null;
      this.connected = false;
      this.brokerIdx = 0;
      this.reconnectTimer = null;
      this.pingTimer = null;
      this.heartbeatTimer = null;
      this.publishDebounce = null;
      this.bc = null;

      this.loadCache();
    }

    ensureUid() {
      try {
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
            if (clean) this.players[clean.uid] = clean;
          });
        }
      } catch (_) {}
    }

    saveCache() {
      try {
        const arr = Object.values(this.players)
          .sort((a, b) => b.netWorth - a.netWorth)
          .slice(0, 80);
        localStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      } catch (_) {}
    }

    init(opts = {}) {
      this.onUpdate = typeof opts.onUpdate === "function" ? opts.onUpdate : null;

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
                this.saveCache();
                if (this.onUpdate) this.onUpdate();
              }
            }
          };
        } catch (_) {}
      }

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
          this.brokerIdx = (this.brokerIdx + 1) % BROKERS.length;
          this.reconnectTimer = setTimeout(() => this.connectNextBroker(), wasConnected ? 4000 : 7000);
        };
      } catch (_) {
        this.brokerIdx = (this.brokerIdx + 1) % BROKERS.length;
        this.reconnectTimer = setTimeout(() => this.connectNextBroker(), 9000);
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
        0x00, 0x2d // KeepAlive = 45s
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

    sendOfflineSignal() {
      if (this.connected) {
        this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "0", true);
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
            this.sendSubscribe(`${TOPIC_PREFIX}/#`);
            this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "1", true);
            if (this.localState) {
              this.sendPublish(`${TOPIC_PREFIX}/board/${this.uid}`, JSON.stringify(this.localState), true);
            }
            this.startKeepAliveLoops();
            if (this.onUpdate) this.onUpdate();
          }
        } else if (ptype === 3) {
          // PUBLISH
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
            this.handleMqttMessage(topic, payloadStr);
          }
        }

        offset = pktEnd;
      }
    }

    handleMqttMessage(topic, payloadStr) {
      const onlinePrefix = `${TOPIC_PREFIX}/online/`;
      const boardPrefix = `${TOPIC_PREFIX}/board/`;

      if (topic.startsWith(onlinePrefix)) {
        const uid = topic.slice(onlinePrefix.length).trim();
        if (uid) {
          this.onlineFlags[uid] = payloadStr.trim();
          if (this.onUpdate) this.onUpdate();
        }
      } else if (topic.startsWith(boardPrefix)) {
        try {
          const parsed = JSON.parse(payloadStr);
          const clean = sanitizeEntry(parsed);
          if (clean) {
            this.players[clean.uid] = clean;
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
      }, 25_000);

      this.heartbeatTimer = setInterval(() => {
        if (this.connected && this.localState) {
          this.localState.ts = Date.now();
          this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "1", true);
          this.sendPublish(`${TOPIC_PREFIX}/board/${this.uid}`, JSON.stringify(this.localState), true);
        }
      }, 30_000);
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
      this.saveCache();

      if (this.bc) {
        try {
          this.bc.postMessage({ type: "player", payload: candidate });
        } catch (_) {}
      }

      const doSend = () => {
        if (this.connected) {
          this.sendPublish(`${TOPIC_PREFIX}/online/${this.uid}`, "1", true);
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
        this.publishDebounce = setTimeout(doSend, 800);
      }
    }

    forceSync() {
      if (this.connected) {
        this.sendSubscribe(`${TOPIC_PREFIX}/#`);
        if (this.localState) this.publishPlayerState(this.localState, true);
      } else {
        this.connectNextBroker();
      }
    }

    getLeaderboardSnapshot() {
      const now = Date.now();
      const entries = Object.values(this.players).map((p) => {
        const isMe = p.uid === this.uid;
        const recent = (now - (p.ts || 0)) < 180_000;
        const isOnline = isMe || (this.onlineFlags[p.uid] === "1" && recent);
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
          isPlayer: isMe,
          isOnline
        };
      });

      entries.sort((a, b) => {
        if (b.netWorth !== a.netWorth) return b.netWorth - a.netWorth;
        return b.peakNetWorth - a.peakNetWorth;
      });

      const onlineCount = entries.filter((e) => e.isOnline).length;
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
