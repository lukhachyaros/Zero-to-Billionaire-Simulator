// Synthesized Web Audio SFX & Mobile Haptic Engine (Zero external audio files required)
(function () {
  class SoundHapticEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    ensureContext() {
      if (!this.enabled) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    vibrate(ms = 12) {
      if (!this.enabled) return;
      if (navigator && typeof navigator.vibrate === "function") {
        try { navigator.vibrate(ms); } catch (_) {}
      }
    }

    tone(freq, duration, type = "sine", gainVal = 0.08, slideTo = null, delay = 0) {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
      }

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(gainVal, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    }

    tap() {
      this.vibrate(8);
      this.tone(520, 0.055, "triangle", 0.05, 640);
    }

    ageUp() {
      this.vibrate(14);
      this.tone(440, 0.08, "triangle", 0.06, 554);
      this.tone(659, 0.11, "triangle", 0.06, 784, 0.055);
    }

    coin() {
      this.vibrate([12, 25, 18]);
      this.tone(987.77, 0.08, "sine", 0.08);
      this.tone(1318.5, 0.22, "sine", 0.09, null, 0.065);
    }

    success() {
      this.vibrate([15, 30, 20]);
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        this.tone(f, 0.16, "triangle", 0.07, null, idx * 0.06);
      });
    }

    warning() {
      this.vibrate([30, 40, 30]);
      this.tone(280, 0.14, "sawtooth", 0.05, 210);
      this.tone(210, 0.2, "sawtooth", 0.05, 165, 0.12);
    }
  }

  window.ZTBAudio = new SoundHapticEngine();
})();
