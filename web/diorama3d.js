// Three.js WebGL PBR Stylized Cozy Isometric Diorama Engine (with safe 2D fallback)
(function () {
  const ROOM_LABELS = [
    "🏠 Phòng Tuổi Thơ Ấm Áp",
    "🛏️ Phòng Trọ Sinh Viên 12m²",
    "🏢 Căn Hộ Chung Cư Hiện Đại",
    "🏡 Biệt Thự Phố Thượng Lưu",
    "👑 Penthouse Đỉnh Tháp & Hồ Bơi"
  ];

  class ThreeDioramaEngine {
    constructor() {
      this.canvas = null;
      this.width = 406;
      this.height = 260;

      this.targetYaw = 0;
      this.currentYaw = 0;
      this.zoomFactor = 1.0;
      this.isDragging = false;
      this.lastPointerX = 0;
      this.nightMode = false;

      this.state = {
        age: 0,
        gender: "Nam",
        netWorth: 0,
        realEstateTier: 0,
        happiness: 80,
        stress: 10,
        isAlive: true
      };

      this.roomTier = 0;
      this.builtSignature = "";
      this.celebrateTimer = 0;
      this.blinkTimer = 0;

      this.webglReady = false;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.dioramaGroup = null;
      this.roomGroup = null;
      this.chibiGroup = null;
      this.cityGroup = null;
      this.starPoints = null;

      this.hemiLight = null;
      this.dirLight = null;
      this.accentLights = [];
      this.fanBlades = null;
      this.poolWaterMesh = null;
      this.windowGlassMat = null;
      this.chibiRig = null;
      this.moodSprite = null;
      this.moodTextures = {};
      this.particleTextures = {};
      this.particles3D = [];

      this._rafId = null;
      this._resizeObserver = null;
      this._clockPrev = performance.now();
    }

    init(canvasOrId) {
      this.canvas = typeof canvasOrId === "string"
        ? document.getElementById(canvasOrId)
        : canvasOrId;

      if (!this.canvas) return;

      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(240, rect.width || 406);
      this.height = Math.max(160, rect.height || 260);

      if (window.THREE) {
        try {
          this.initThreeWebGL();
          this.webglReady = true;
        } catch (err) {
          console.warn("[Diorama3D] WebGL unavailable, switching to 2D fallback:", err);
          this.webglReady = false;
        }
      }

      this.bindEvents();

      if (typeof ResizeObserver !== "undefined") {
        this._resizeObserver = new ResizeObserver(() => this.handleResize());
        this._resizeObserver.observe(this.canvas);
      } else {
        window.addEventListener("resize", () => this.handleResize());
      }

      this.rebuildSceneIfNeeded(true);
      this.applyNightAtmosphere();

      if (!this._rafId) {
        const tick = (now) => {
          const dt = Math.min(0.05, Math.max(0.001, (now - this._clockPrev) * 0.001));
          this._clockPrev = now;
          this.renderFrame(now * 0.001, dt);
          this._rafId = requestAnimationFrame(tick);
        };
        this._rafId = requestAnimationFrame(tick);
      }
    }

    initThreeWebGL() {
      const THREE = window.THREE;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(this.width, this.height, false);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.0;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.scene = new THREE.Scene();

      const frustum = 5.3;
      const aspect = this.width / this.height;
      this.camera = new THREE.OrthographicCamera(
        (-frustum * aspect) / 2,
        (frustum * aspect) / 2,
        frustum / 2,
        -frustum / 2,
        0.1,
        50
      );
      this.camera.position.set(8.6, 7.2, 8.6);
      this.camera.lookAt(0, 0.85, 0);

      // Ánh sáng nền Cozy PBR
      this.hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.85);
      this.scene.add(this.hemiLight);

      this.dirLight = new THREE.DirectionalLight(0xfff4d6, 1.35);
      this.dirLight.position.set(6.5, 11.0, 4.5);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 1;
      this.dirLight.shadow.camera.far = 26;
      const d = 4.2;
      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;
      this.dirLight.shadow.bias = -0.0008;
      this.scene.add(this.dirLight);

      // Sao đêm 3D
      const starGeo = new THREE.BufferGeometry();
      const starPos = [];
      for (let i = 0; i < 90; i++) {
        starPos.push((Math.random() - 0.5) * 16, 1.5 + Math.random() * 6, -4.5 - Math.random() * 6);
      }
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.08, transparent: true, opacity: 0 });
      this.starPoints = new THREE.Points(starGeo, starMat);
      this.scene.add(this.starPoints);

      this.dioramaGroup = new THREE.Group();
      this.scene.add(this.dioramaGroup);

      this.roomGroup = new THREE.Group();
      this.chibiGroup = new THREE.Group();
      this.cityGroup = new THREE.Group();
      this.dioramaGroup.add(this.cityGroup);
      this.dioramaGroup.add(this.roomGroup);
      this.dioramaGroup.add(this.chibiGroup);

      this.buildSkylineBackdrop();
      this.prepareEmojiTextures();
    }

    handleResize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      this.width = rect.width;
      this.height = rect.height;

      if (this.webglReady && this.renderer && this.camera) {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.setSize(this.width, this.height, false);
        this.updateCameraFrustum();
      } else {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(this.width * dpr);
        this.canvas.height = Math.round(this.height * dpr);
      }
    }

    updateCameraFrustum() {
      if (!this.camera) return;
      const frustum = 5.3 / this.zoomFactor;
      const aspect = this.width / this.height;
      this.camera.left = (-frustum * aspect) / 2;
      this.camera.right = (frustum * aspect) / 2;
      this.camera.top = frustum / 2;
      this.camera.bottom = -frustum / 2;
      this.camera.updateProjectionMatrix();
    }

    bindEvents() {
      const startDrag = (x) => {
        this.isDragging = true;
        this.lastPointerX = x;
      };
      const moveDrag = (x) => {
        if (!this.isDragging) return;
        const dx = x - this.lastPointerX;
        this.lastPointerX = x;
        this.targetYaw = Math.max(-0.72, Math.min(0.72, this.targetYaw + dx * 0.0075));
      };
      const endDrag = () => {
        this.isDragging = false;
      };

      this.canvas.addEventListener("mousedown", (e) => startDrag(e.clientX));
      window.addEventListener("mousemove", (e) => moveDrag(e.clientX));
      window.addEventListener("mouseup", endDrag);

      this.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();
        this.zoomFactor = Math.max(0.84, Math.min(1.30, this.zoomFactor - e.deltaY * 0.0008));
        this.updateCameraFrustum();
      }, { passive: false });

      this.canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX);
      }, { passive: true });
      this.canvas.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX);
      }, { passive: true });
      this.canvas.addEventListener("touchend", endDrag);
      this.canvas.addEventListener("touchcancel", endDrag);
    }

    computeRoomTier(s) {
      const age = s.age || 0;
      const netWorth = s.netWorth || 0;
      const reTier = s.realEstateTier || 0;

      if (age < 18 && reTier < 2) return 0;
      if (netWorth >= 60_000_000_000 || reTier >= 4) return 4;
      if (netWorth >= 10_000_000_000 || reTier >= 3) return 3;
      if (netWorth >= 800_000_000 || reTier >= 1) return 2;
      return 1;
    }

    updateState(nextState) {
      this.state = Object.assign({}, this.state, nextState || {});
      this.roomTier = this.computeRoomTier(this.state);
      this.rebuildSceneIfNeeded(false);
      this.updateMoodSprite();
    }

    getRoomTierLabel() {
      return ROOM_LABELS[this.roomTier] || ROOM_LABELS[0];
    }

    setNightMode(isNight) {
      this.nightMode = !!isNight;
      this.applyNightAtmosphere();
    }

    toggleNightMode() {
      this.nightMode = !this.nightMode;
      this.applyNightAtmosphere();
      return this.nightMode;
    }

    isNightMode() {
      return this.nightMode;
    }

    resetCamera() {
      this.targetYaw = 0;
      this.zoomFactor = 1.0;
      this.updateCameraFrustum();
    }

    prepareEmojiTextures() {
      const makeTex = (glyph, size = 96) => {
        const c = document.createElement("canvas");
        c.width = size;
        c.height = size;
        const g = c.getContext("2d");
        g.font = `${Math.round(size * 0.68)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(glyph, size / 2, size / 2 + 2);
        const tex = new window.THREE.CanvasTexture(c);
        tex.encoding = window.THREE.sRGBEncoding;
        return tex;
      };

      ["😄", "🙂", "😰", "🤑", "💰", "💎", "✨", "🎉", "💔", "💧"].forEach((em) => {
        const tex = makeTex(em);
        this.moodTextures[em] = tex;
        this.particleTextures[em] = tex;
      });
    }

    triggerCelebration(kind = "happy") {
      this.celebrateTimer = kind === "sad" ? 0.5 : 1.5;
      if (!this.webglReady || !this.dioramaGroup) return;

      const THREE = window.THREE;
      const glyphs = kind === "coin"
        ? ["💰", "💎", "✨"]
        : (kind === "sad" ? ["💔", "💧"] : ["🎉", "✨"]);

      for (let i = 0; i < 12; i++) {
        const tex = this.particleTextures[glyphs[i % glyphs.length]];
        if (!tex) continue;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1 });
        const sprite = new THREE.Sprite(mat);
        sprite.position.set((Math.random() - 0.5) * 1.6, 0.9 + Math.random() * 0.6, (Math.random() - 0.5) * 1.6);
        sprite.scale.set(0.42, 0.42, 0.42);
        this.dioramaGroup.add(sprite);
        this.particles3D.push({
          sprite,
          vx: (Math.random() - 0.5) * 1.3,
          vy: 1.5 + Math.random() * 1.1,
          vz: (Math.random() - 0.5) * 1.3,
          life: 1.0,
          decay: 0.65 + Math.random() * 0.4
        });
      }
    }

    clearGroup(group) {
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        child.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
    }

    makeMat(color, roughness = 0.68, metalness = 0.08, extra = {}) {
      return new window.THREE.MeshStandardMaterial(Object.assign({
        color,
        roughness,
        metalness
      }, extra));
    }

    addMesh(parent, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, cast = true, recv = true) {
      const m = new window.THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      m.castShadow = cast;
      m.receiveShadow = recv;
      parent.add(m);
      return m;
    }

    buildSkylineBackdrop() {
      if (!this.cityGroup) return;
      const THREE = window.THREE;
      const bColors = [0x0f172a, 0x162238, 0x0b1222, 0x1e293b];
      const buildings = [
        [-2.8, 2.2, -3.5, 0.7, 2.6, 0.7],
        [-1.3, 2.8, -3.9, 0.8, 3.4, 0.8],
        [0.4, 2.5, -3.7, 0.75, 2.9, 0.75],
        [1.8, 3.1, -3.8, 0.85, 3.9, 0.85],
        [-3.7, 2.4, -1.6, 0.75, 2.7, 0.75],
        [-3.8, 2.9, 0.3, 0.8, 3.5, 0.8]
      ];
      buildings.forEach(([x, h, z, w, height, d], idx) => {
        const geo = new THREE.BoxGeometry(w, height, d);
        const mat = this.makeMat(bColors[idx % bColors.length], 0.85, 0.1, {
          emissive: 0x0f172a,
          emissiveIntensity: 0.35
        });
        this.addMesh(this.cityGroup, geo, mat, x, height / 2 - 1.9, z, 0, 0, 0, false, false);
      });
    }

    applyNightAtmosphere() {
      if (!this.canvas) return;
      if (this.nightMode) {
        this.canvas.style.background = "radial-gradient(circle at 50% 25%, #162244 0%, #070b18 100%)";
      } else {
        this.canvas.style.background = "radial-gradient(circle at 50% 20%, #244070 0%, #101b36 100%)";
      }

      if (!this.webglReady) return;
      if (this.hemiLight) {
        this.hemiLight.intensity = this.nightMode ? 0.42 : 0.68;
        this.hemiLight.color.setHex(this.nightMode ? 0x60a5fa : 0xe0f2fe);
      }
      if (this.dirLight) {
        this.dirLight.intensity = this.nightMode ? 0.58 : 1.12;
        this.dirLight.color.setHex(this.nightMode ? 0x93c5fd : 0xfff5db);
      }
      if (this.starPoints) {
        this.starPoints.material.opacity = this.nightMode ? 0.9 : 0.0;
      }
      if (this.windowGlassMat) {
        this.windowGlassMat.color.setHex(this.nightMode ? 0x1e3a8a : 0x7dd3fc);
        this.windowGlassMat.emissive.setHex(this.nightMode ? 0x1d4ed8 : 0x38bdf8);
        this.windowGlassMat.emissiveIntensity = this.nightMode ? 0.55 : 0.40;
      }
      this.accentLights.forEach((l) => {
        l.intensity = this.nightMode ? l.userData.nightIntensity : l.userData.dayIntensity;
      });
    }

    rebuildSceneIfNeeded(force) {
      const stageBucket = this.state.age < 6 ? "inf" : (this.state.age < 15 ? "kid" : (this.state.age < 18 ? "teen" : (this.state.age < 60 ? "adult" : "sen")));
      const sig = `${this.roomTier}|${stageBucket}|${this.state.gender}|${this.state.isAlive}`;
      if (!force && sig === this.builtSignature) return;
      this.builtSignature = sig;

      if (!this.webglReady) return;
      this.buildThreeRoom();
      this.buildThreeChibi();
      this.applyNightAtmosphere();
    }

    addAccentLight(color, dayIntensity, nightIntensity, x, y, z, distance = 4.2) {
      const pt = new window.THREE.PointLight(color, this.nightMode ? nightIntensity : dayIntensity, distance, 1.8);
      pt.position.set(x, y, z);
      pt.userData = { dayIntensity, nightIntensity };
      this.roomGroup.add(pt);
      this.accentLights.push(pt);
    }

    buildThreeRoom() {
      const THREE = window.THREE;
      this.clearGroup(this.roomGroup);
      this.accentLights = [];
      this.fanBlades = null;
      this.poolWaterMesh = null;

      const t = this.roomTier;
      const themes = [
        { floor: 0xd9a066, base: 0x8b5e34, wallBack: 0xf6e7d0, wallLeft: 0xebd6b7, trim: 0xc28550 },
        { floor: 0x9aa5b4, base: 0x475569, wallBack: 0xe2e8f0, wallLeft: 0xcbd5e1, trim: 0x64748b },
        { floor: 0xc89a6b, base: 0x334155, wallBack: 0xf1f5f9, wallLeft: 0xe2e8f0, trim: 0x475569 },
        { floor: 0x6e472b, base: 0x2b1d12, wallBack: 0xf5ebd6, wallLeft: 0xe8d9be, trim: 0xb48332 },
        { floor: 0xf1f5f9, base: 0x1e293b, wallBack: 0x1e293b, wallLeft: 0x162032, trim: 0xf59e0b }
      ];
      const pal = themes[t];

      // Đế kiến trúc nổi + sàn phòng
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.44, 0.14, 4.44), this.makeMat(0x0f172a, 0.7, 0.25), -0.06, -0.35, -0.06, 0, 0, 0, false, true);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.36, 0.28, 4.36), this.makeMat(pal.base, 0.72, 0.1), -0.06, -0.14, -0.06, 0, 0, 0, true, true);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.2, 0.04, 4.2), this.makeMat(pal.floor, t === 4 ? 0.25 : 0.65, t === 4 ? 0.2 : 0.05), 0.02, 0.01, 0.02, 0, 0, 0, false, true);

      // Các đường gạch/sàn gỗ nổi khối nhẹ
      for (let i = -1.6; i <= 1.65; i += 0.8) {
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.15, 0.008, 0.02), this.makeMat(pal.base, 0.8, 0.05), 0.02, 0.032, i, 0, 0, 0, false, true);
      }

      // 2 Tường Cutaway Isometric
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.36, 2.48, 0.20), this.makeMat(pal.wallBack, 0.85, 0.02), -0.06, 1.24, -2.14);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.20, 2.48, 4.20), this.makeMat(pal.wallLeft, 0.85, 0.02), -2.14, 1.24, -0.02);

      // Len chân tường (skirting)
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.16, 0.12, 0.04), this.makeMat(pal.trim, 0.5, 0.15), 0.04, 0.08, -2.02);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.04, 0.12, 4.10), this.makeMat(pal.trim, 0.5, 0.15), -2.02, 0.08, 0.04);

      // Cửa sổ kính & rèm vải
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.56, 1.12, 0.06), this.makeMat(pal.trim, 0.5, 0.2), 0.52, 1.45, -2.02);
      this.windowGlassMat = this.makeMat(this.nightMode ? 0x1e3a8a : 0x7dd3fc, 0.15, 0.1, {
        emissive: this.nightMode ? 0x1d4ed8 : 0x38bdf8,
        emissiveIntensity: 0.45
      });
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.40, 0.96, 0.04), this.windowGlassMat, 0.52, 1.45, -1.99, 0, 0, 0, false, false);
      // Rèm 2 bên
      const curtainMat = this.makeMat(t >= 3 ? 0x991b1b : 0x93c5fd, 0.9, 0.0);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 1.22, 0.09), curtainMat, -0.22, 1.43, -1.97);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 1.22, 0.09), curtainMat, 1.26, 1.43, -1.97);

      if (t === 0) {
        // TIER 0: PHÒNG TUỔI THƠ ẤM ÁP
        this.buildBed(-1.25, -1.05, 1.15, 1.85, 0x9a6b42, 0x60a5fa, true);
        // Gấu bông nhỏ trên giường
        const bearMat = this.makeMat(0xb45309, 0.85);
        this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.11, 12, 12), bearMat, -1.25, 0.54, -1.52);
        this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.08, 12, 12), bearMat, -1.25, 0.69, -1.52);

        // Thảm tròn pastel ấm
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.78, 0.78, 0.02, 28), this.makeMat(0xf472b6, 0.92), 0.15, 0.04, 0.45, 0, 0, 0, false, true);

        // Bàn học & đèn bàn ấm
        this.buildDesk(1.0, -1.45, 1.35, 0.7, 0xc28550, 0xfbbf24);
        this.addAccentLight(0xfde047, 0.3, 1.4, 1.4, 1.15, -1.5);

        // Giá sách màu sắc & khối đồ chơi
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.45, 1.35, 1.15), this.makeMat(0xa16207, 0.7), -1.78, 0.70, 0.85);
        [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b].forEach((c, idx) => {
          this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.28, 0.22, 0.16), this.makeMat(c, 0.6), -1.72, 0.95, 0.5 + idx * 0.22);
        });
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.28, 0.28, 0.28), this.makeMat(0xf87171, 0.5), -1.1, 0.17, 1.25);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.24, 0.24, 0.24), this.makeMat(0x34d399, 0.5), -0.78, 0.15, 1.36);
      } else if (t === 1) {
        // TIER 1: PHÒNG TRỌ SINH VIÊN 12M2
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.12, 0.16, 1.85), this.makeMat(0x475569, 0.85), -1.32, 0.11, -0.95);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.92, 0.09, 0.38), this.makeMat(0xf1f5f9, 0.9), -1.32, 0.23, -1.62);

        // Bàn PC code + màn hình phát sáng + PC tower
        this.buildDesk(0.95, -1.45, 1.48, 0.74, 0x334155, null);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.92, 0.50, 0.05), this.makeMat(0x0f172a, 0.3, 0.5, { emissive: 0x10b981, emissiveIntensity: 0.75 }), 0.92, 0.96, -1.58);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 0.44, 0.42), this.makeMat(0x1e293b, 0.4, 0.6, { emissive: 0x38bdf8, emissiveIntensity: 0.25 }), 1.54, 0.86, -1.42);
        this.addAccentLight(0x34d399, 0.4, 1.5, 0.92, 1.05, -1.25);

        // Quạt đứng quay cánh
        const fanBase = this.makeMat(0x64748b, 0.4, 0.5);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.24, 0.26, 0.06, 16), fanBase, 1.55, 0.06, 1.15);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.035, 0.04, 0.95, 10), fanBase, 1.55, 0.54, 1.15);
        this.fanBlades = new THREE.Group();
        this.fanBlades.position.set(1.55, 1.02, 1.15);
        this.fanBlades.rotation.y = -0.65;
        const bladeMat = this.makeMat(0x38bdf8, 0.35, 0.2);
        this.addMesh(this.fanBlades, new THREE.BoxGeometry(0.46, 0.08, 0.02), bladeMat, 0, 0, 0.04);
        this.addMesh(this.fanBlades, new THREE.BoxGeometry(0.08, 0.46, 0.02), bladeMat, 0, 0, 0.04);
        this.roomGroup.add(this.fanBlades);

        // Thùng mì tôm + Đàn guitar
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.45, 0.32, 0.34), this.makeMat(0xf97316, 0.75), -1.65, 0.19, 1.15);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.20, 0.23, 0.10, 16), this.makeMat(0xb45309, 0.5), -1.86, 0.36, 0.35, 0, 0, 1.35);
      } else if (t === 2) {
        // TIER 2: CĂN HỘ CHUNG CƯ HIỆN ĐẠI
        this.buildBed(-1.18, -1.02, 1.45, 1.92, 0x1e293b, 0x2563eb, false);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.45, 0.42, 0.45), this.makeMat(0x475569, 0.6), -0.18, 0.23, -1.68);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.14, 0.18, 0.24, 14), this.makeMat(0xfef08a, 0.3, 0, { emissive: 0xfbbf24, emissiveIntensity: 0.6 }), -0.18, 0.60, -1.68);
        this.addAccentLight(0xfde047, 0.35, 1.2, -0.18, 0.72, -1.55);

        // Thảm + Sofa da + Bàn trà kính + TV treo tường
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.75, 0.03, 1.55), this.makeMat(0xcbd5e1, 0.95), 0.95, 0.04, 0.75, 0, 0, 0, false, true);
        this.buildSofa(1.10, 1.25, 1.45, 0.68, 0xb45309);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.85, 0.28, 0.50), this.makeMat(0x94a3b8, 0.15, 0.6), 1.05, 0.18, 0.42);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.06, 0.76, 1.32), this.makeMat(0x020617, 0.2, 0.7, { emissive: 0x3b82f6, emissiveIntensity: 0.35 }), -2.01, 1.25, 0.85);
        this.buildPlant(-1.72, 1.62, 1.0);
      } else if (t === 3) {
        // TIER 3: BIỆT THỰ PHỐ THƯỢNG LƯU
        this.buildBed(-1.12, -1.0, 1.58, 1.98, 0x78350f, 0x1e3a8a, false);
        // Bàn giám đốc + cúp vàng
        this.buildDesk(1.02, -1.35, 1.45, 0.75, 0x451a03, 0xf59e0b);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.08, 0.05, 0.24, 12), this.makeMat(0xfbbf24, 0.2, 0.9), 0.65, 0.78, -1.4);
        // Tủ rượu phát sáng
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.55, 1.75, 1.15), this.makeMat(0x451a03, 0.45, 0.2), -1.75, 0.90, 0.75);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.05, 1.42, 0.95), this.makeMat(0xfbbf24, 0.2, 0.4, { emissive: 0xf59e0b, emissiveIntensity: 0.6 }), -1.46, 0.92, 0.75);
        this.addAccentLight(0xf59e0b, 0.45, 1.5, -1.2, 1.1, 0.75);
        // Sofa nhung + đèn chùm
        this.buildSofa(1.05, 1.22, 1.48, 0.70, 0x991b1b);
        this.addMesh(this.roomGroup, new THREE.TorusGeometry(0.36, 0.04, 10, 24), this.makeMat(0xfbbf24, 0.2, 0.85, { emissive: 0xfde047, emissiveIntensity: 0.5 }), 0.1, 2.25, 0.1, Math.PI / 2, 0, 0);
        this.addAccentLight(0xfef08a, 0.4, 1.4, 0.1, 2.05, 0.1, 6.0);
      } else {
        // TIER 4: PENTHOUSE ĐỈNH THÁP & HỒ BƠI VÔ CỰC
        // Viền vàng trên sàn đá cẩm thạch
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(3.8, 0.01, 0.05), this.makeMat(0xf59e0b, 0.2, 0.9), 0.02, 0.033, 1.95, 0, 0, 0, false, true);
        this.buildBed(-1.18, -1.05, 1.55, 1.95, 0xf59e0b, 0x334155, false);

        // Đại dương cầm (Grand Piano)
        const pianoMat = this.makeMat(0x090d16, 0.12, 0.55);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.15, 0.22, 0.95), pianoMat, 1.05, 0.62, -1.18);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.02, 0.04, 0.88), pianoMat, 1.05, 0.94, -1.24, -0.38, 0, 0);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.95, 0.05, 0.18), this.makeMat(0xffffff, 0.3), 1.05, 0.62, -0.66);
        [[-0.45, -0.35], [0.45, -0.35], [0, 0.35]].forEach(([lx, lz]) => {
          this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.04, 0.03, 0.54, 10), pianoMat, 1.05 + lx, 0.28, -1.18 + lz);
        });

        // Hồ bơi vô cực + Phao bơi + Cây cọ
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.92, 0.16, 1.52), this.makeMat(0xe2e8f0, 0.3, 0.2), 1.02, 0.10, 1.18);
        this.poolWaterMesh = this.addMesh(
          this.roomGroup,
          new THREE.BoxGeometry(1.72, 0.12, 1.32),
          this.makeMat(0x06b6d4, 0.08, 0.15, { emissive: 0x0891b2, emissiveIntensity: 0.45, transparent: true, opacity: 0.84 }),
          1.02, 0.16, 1.18, 0, 0, 0, false, true
        );
        this.addMesh(this.roomGroup, new THREE.TorusGeometry(0.19, 0.065, 12, 20), this.makeMat(0xf43f5e, 0.35, 0.1), 1.25, 0.23, 1.25, Math.PI / 2, 0, 0);
        this.addAccentLight(0x22d3ee, 0.55, 1.8, 1.02, 0.65, 1.18, 5.0);
        this.buildPlant(-1.72, 1.58, 1.35);
      }
    }

    buildBed(cx, cz, w, l, frameColor, duvetColor, isKid) {
      const THREE = window.THREE;
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w, 0.24, l), this.makeMat(frameColor, 0.6), cx, 0.14, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w, 0.68, 0.12), this.makeMat(frameColor, 0.6), cx, 0.38, cz - l / 2 + 0.06);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w - 0.1, 0.18, l - 0.12), this.makeMat(0xffffff, 0.85), cx, 0.32, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w - 0.06, 0.12, l * 0.66), this.makeMat(duvetColor, 0.8), cx, 0.39, cz + l * 0.14);
      const pillowW = isKid ? w * 0.55 : w * 0.38;
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(pillowW, 0.09, 0.28), this.makeMat(0xf8fafc, 0.9), cx, 0.44, cz - l / 2 + 0.28);
    }

    buildDesk(cx, cz, w, d, woodColor, lampColor) {
      const THREE = window.THREE;
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w, 0.07, d), this.makeMat(woodColor, 0.55), cx, 0.66, cz);
      const legMat = this.makeMat(woodColor, 0.65);
      [[-w / 2 + 0.07, -d / 2 + 0.07], [w / 2 - 0.07, -d / 2 + 0.07], [-w / 2 + 0.07, d / 2 - 0.07], [w / 2 - 0.07, d / 2 - 0.07]].forEach(([lx, lz]) => {
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.07, 0.64, 0.07), legMat, cx + lx, 0.32, cz + lz);
      });
      if (lampColor) {
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.03, 0.06, 0.25, 10), this.makeMat(0x475569, 0.4, 0.5), cx + w * 0.34, 0.80, cz - d * 0.22);
        this.addMesh(this.roomGroup, new THREE.ConeGeometry(0.14, 0.18, 12), this.makeMat(lampColor, 0.3, 0, { emissive: lampColor, emissiveIntensity: 0.55 }), cx + w * 0.34, 0.98, cz - d * 0.22);
      }
    }

    buildSofa(cx, cz, w, d, color) {
      const THREE = window.THREE;
      const mat = this.makeMat(color, 0.72, 0.08);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w, 0.28, d), mat, cx, 0.18, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(w, 0.56, 0.16), mat, cx, 0.36, cz + d / 2 - 0.08);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.16, 0.42, d), mat, cx - w / 2 + 0.08, 0.28, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.16, 0.42, d), mat, cx + w / 2 - 0.08, 0.28, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.28, 0.22, 0.12), this.makeMat(0xfde68a, 0.9), cx - 0.32, 0.38, cz + 0.12, 0, 0.2, 0);
    }

    buildPlant(cx, cz, scale = 1.0) {
      const THREE = window.THREE;
      this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.18 * scale, 0.13 * scale, 0.32 * scale, 14), this.makeMat(0x9a3412, 0.7), cx, 0.18 * scale, cz);
      const leafMat = this.makeMat(0x16a34a, 0.65);
      this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.24 * scale, 12, 12), leafMat, cx, 0.52 * scale, cz);
      this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.18 * scale, 12, 12), leafMat, cx + 0.12 * scale, 0.62 * scale, cz - 0.08 * scale);
      this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.16 * scale, 12, 12), leafMat, cx - 0.12 * scale, 0.60 * scale, cz + 0.08 * scale);
    }

    buildThreeChibi() {
      const THREE = window.THREE;
      this.clearGroup(this.chibiGroup);
      this.chibiRig = null;
      this.moodSprite = null;

      if (!this.state.isAlive) {
        // Bia tưởng niệm trang trọng
        this.addMesh(this.chibiGroup, new THREE.BoxGeometry(0.66, 0.14, 0.52), this.makeMat(0x475569, 0.8), -0.1, 0.10, 0.1);
        this.addMesh(this.chibiGroup, new THREE.BoxGeometry(0.42, 0.72, 0.14), this.makeMat(0x94a3b8, 0.65), -0.1, 0.50, 0.06);
        this.addMesh(this.chibiGroup, new THREE.CylinderGeometry(0.07, 0.05, 0.14, 12), this.makeMat(0xf59e0b, 0.25, 0.8), -0.1, 0.24, 0.24);
        return;
      }

      const age = this.state.age || 0;
      const t = this.roomTier;
      const charScale = age < 6 ? 0.62 : (age < 12 ? 0.76 : (age < 18 ? 0.90 : (age >= 60 ? 0.95 : 1.0)));

      const rigRoot = new THREE.Group();
      rigRoot.position.set(-0.08, 0.03, 0.12);
      rigRoot.scale.setScalar(charScale);
      this.chibiGroup.add(rigRoot);

      let shirtColor = 0x3b82f6;
      let pantsColor = 0x1e293b;
      if (age < 6) {
        shirtColor = 0xfbbf24;
        pantsColor = 0xf59e0b;
      } else if (age < 18) {
        shirtColor = 0xf8fafc;
        pantsColor = 0x1e3a8a;
      } else if (t >= 3) {
        shirtColor = 0x1e293b;
        pantsColor = 0x0f172a;
      } else if (t === 2) {
        shirtColor = 0x0284c7;
        pantsColor = 0x1e293b;
      }

      const skinMat = this.makeMat(0xfcd5b5, 0.75);
      const hairColor = age >= 60 ? 0xdbeafe : (this.state.gender === "Nữ" ? 0x292524 : 0x18181b);
      const hairMat = this.makeMat(hairColor, 0.7);
      const shirtMat = this.makeMat(shirtColor, 0.65);
      const pantsMat = this.makeMat(pantsColor, 0.75);

      const leftLeg = this.addMesh(rigRoot, new THREE.BoxGeometry(0.14, 0.34, 0.14), pantsMat, -0.09, 0.19, 0);
      const rightLeg = this.addMesh(rigRoot, new THREE.BoxGeometry(0.14, 0.34, 0.14), pantsMat, 0.09, 0.19, 0);
      this.addMesh(rigRoot, new THREE.BoxGeometry(0.36, 0.46, 0.24), shirtMat, 0, 0.56, 0);

      const leftArm = this.addMesh(rigRoot, new THREE.BoxGeometry(0.11, 0.36, 0.12), shirtMat, -0.25, 0.56, 0);
      const rightArm = this.addMesh(rigRoot, new THREE.BoxGeometry(0.11, 0.36, 0.12), shirtMat, 0.25, 0.56, 0);

      // Phụ kiện: Khăn quàng đỏ (6-14 tuổi), Cà vạt (trưởng thành), Pin vàng (tỷ phú)
      if (age >= 6 && age <= 14) {
        this.addMesh(rigRoot, new THREE.BoxGeometry(0.30, 0.08, 0.26), this.makeMat(0xef4444, 0.6), 0, 0.77, 0.01);
        this.addMesh(rigRoot, new THREE.ConeGeometry(0.09, 0.24, 4), this.makeMat(0xef4444, 0.6), 0, 0.64, 0.14, Math.PI, 0, 0);
      } else if (age >= 18) {
        const tieColor = t >= 3 ? 0xf59e0b : 0x2563eb;
        this.addMesh(rigRoot, new THREE.BoxGeometry(0.06, 0.24, 0.04), this.makeMat(tieColor, 0.35, 0.4), 0, 0.62, 0.13);
      }

      // Đầu, mắt, má hồng & tóc
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.03, 0);
      rigRoot.add(headGroup);

      this.addMesh(headGroup, new THREE.BoxGeometry(0.46, 0.44, 0.44), skinMat, 0, 0, 0);
      const eyeMat = this.makeMat(0x0f172a, 0.2, 0.2);
      const leftEye = this.addMesh(headGroup, new THREE.BoxGeometry(0.06, 0.07, 0.03), eyeMat, -0.10, 0.02, 0.22);
      const rightEye = this.addMesh(headGroup, new THREE.BoxGeometry(0.06, 0.07, 0.03), eyeMat, 0.10, 0.02, 0.22);
      const blushMat = this.makeMat(0xfb7185, 0.9);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.07, 0.035, 0.02), blushMat, -0.15, -0.05, 0.22);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.07, 0.035, 0.02), blushMat, 0.15, -0.05, 0.22);

      // Tóc
      this.addMesh(headGroup, new THREE.BoxGeometry(0.50, 0.18, 0.48), hairMat, 0, 0.21, -0.01);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.50, 0.32, 0.14), hairMat, 0, 0.04, -0.18);
      if (this.state.gender === "Nữ") {
        this.addMesh(headGroup, new THREE.BoxGeometry(0.52, 0.36, 0.18), hairMat, 0, -0.08, -0.17);
      }
      if (t >= 4 && age >= 18) {
        this.addMesh(headGroup, new THREE.ConeGeometry(0.08, 0.14, 5), this.makeMat(0xfbbf24, 0.2, 0.9), 0, 0.36, 0);
      }

      // Sprite bong bóng cảm xúc 3D
      const emoji = this.state.stress >= 75 ? "😰" : (this.state.netWorth >= 1_000_000_000 ? "🤑" : (this.state.happiness >= 75 ? "😄" : "🙂"));
      const moodTex = this.moodTextures[emoji] || this.moodTextures["🙂"];
      if (moodTex) {
        this.moodSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: moodTex, transparent: true }));
        this.moodSprite.position.set(0, 1.56, 0);
        this.moodSprite.scale.set(0.38, 0.38, 0.38);
        rigRoot.add(this.moodSprite);
      }

      this.chibiRig = { rigRoot, leftLeg, rightLeg, leftArm, rightArm, headGroup, leftEye, rightEye };
    }

    updateMoodSprite() {
      if (!this.moodSprite || !this.moodSprite.material) return;
      const emoji = this.state.stress >= 75 ? "😰" : (this.state.netWorth >= 1_000_000_000 ? "🤑" : (this.state.happiness >= 75 ? "😄" : "🙂"));
      const tex = this.moodTextures[emoji] || this.moodTextures["🙂"];
      if (tex && this.moodSprite.material.map !== tex) {
        this.moodSprite.material.map = tex;
        this.moodSprite.material.needsUpdate = true;
      }
    }

    renderFrame(t, dt) {
      if (this.celebrateTimer > 0) {
        this.celebrateTimer = Math.max(0, this.celebrateTimer - dt);
      }

      this.currentYaw += (this.targetYaw - this.currentYaw) * 0.14;

      if (!this.webglReady) {
        this.renderFallback2D(t);
        return;
      }

      if (this.dioramaGroup) {
        this.dioramaGroup.rotation.y = this.currentYaw;
      }

      if (this.fanBlades) {
        this.fanBlades.rotation.z += dt * 11.5;
      }

      if (this.poolWaterMesh) {
        this.poolWaterMesh.position.y = 0.16 + Math.sin(t * 2.6) * 0.015;
      }

      if (this.chibiRig) {
        const jump = this.celebrateTimer > 0 ? Math.abs(Math.sin(t * 14)) * 0.28 : 0;
        this.chibiRig.rigRoot.position.y = 0.03 + Math.sin(t * 3.0) * 0.02 + jump;
        this.chibiRig.leftArm.rotation.z = 0.08 + Math.sin(t * 3.0) * 0.06 + (this.celebrateTimer > 0 ? 0.65 : 0);
        this.chibiRig.rightArm.rotation.z = -0.08 - Math.sin(t * 3.0) * 0.06 - (this.celebrateTimer > 0 ? 0.65 : 0);

        this.blinkTimer += dt;
        const isBlinking = (this.blinkTimer % 3.4) > 3.24;
        const eyeScaleY = isBlinking ? 0.15 : 1.0;
        this.chibiRig.leftEye.scale.y = eyeScaleY;
        this.chibiRig.rightEye.scale.y = eyeScaleY;
      }

      if (this.moodSprite) {
        this.moodSprite.position.y = 1.56 + Math.sin(t * 2.5) * 0.05;
      }

      for (let i = this.particles3D.length - 1; i >= 0; i--) {
        const pt = this.particles3D[i];
        pt.sprite.position.x += pt.vx * dt;
        pt.sprite.position.y += pt.vy * dt;
        pt.sprite.position.z += pt.vz * dt;
        pt.vy -= 1.2 * dt;
        pt.life -= pt.decay * dt;
        pt.sprite.material.opacity = Math.max(0, pt.life);
        if (pt.life <= 0) {
          this.dioramaGroup.remove(pt.sprite);
          pt.sprite.material.dispose();
          this.particles3D.splice(i, 1);
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    renderFallback2D(t) {
      const ctx = this.canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "600 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.getRoomTierLabel(), this.width / 2, this.height / 2 + Math.sin(t * 2) * 3);
      ctx.restore();
    }
  }

  window.Diorama3D = new ThreeDioramaEngine();
})();
