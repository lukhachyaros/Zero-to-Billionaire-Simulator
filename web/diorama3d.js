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
        intelligence: 55,
        vip: false,
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
      this.celestialMesh = null;

      this.hemiLight = null;
      this.dirLight = null;
      this.rimLight = null;
      this.accentLights = [];
      this.cityMaterials = [];
      this.fanBlades = null;
      this.poolWaterMesh = null;
      this.windowGlassMat = null;
      this.chibiRig = null;
      this.petRig = null;
      this.moodSprite = null;
      this.moodTextures = {};
      this.particleTextures = {};
      this.particles3D = [];
      this.ambientMotes = [];

      this.woodTex = null;
      this.marbleTex = null;
      this.windowGridTex = null;
      this.shadowDiscTex = null;
      this.moteTex = null;

      this._rafId = null;
      this._resizeObserver = null;
      this._clockPrev = performance.now();
      this._warmMaterials = [];
    }

    startRenderLoop() {
      if (this._rafId) return;
      this._clockPrev = performance.now();
      const tick = (now) => {
        const dt = Math.min(0.05, Math.max(0.001, (now - this._clockPrev) * 0.001));
        this._clockPrev = now;
        this.renderFrame(now * 0.001, dt);
        this._rafId = requestAnimationFrame(tick);
      };
      this._rafId = requestAnimationFrame(tick);
    }

    attachResizeAndEvents() {
      this.bindEvents();
      if (typeof ResizeObserver !== "undefined") {
        this._resizeObserver = new ResizeObserver(() => this.handleResize());
        this._resizeObserver.observe(this.canvas);
      } else {
        window.addEventListener("resize", () => this.handleResize());
      }
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

      this.attachResizeAndEvents();
      this.rebuildSceneIfNeeded(true);
      this.applyNightAtmosphere();
      this.startRenderLoop();
    }

    async initAsync(canvasOrId, onProgress) {
      const report = (pct, msg, stage) => {
        if (typeof onProgress === "function") {
          try { onProgress(pct, msg, stage); } catch (_) {}
        }
      };
      const waitFrame = (ms = 75) => new Promise((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, ms));
      });

      this.canvas = typeof canvasOrId === "string"
        ? document.getElementById(canvasOrId)
        : canvasOrId;

      if (!this.canvas) {
        report(100, "Sẵn sàng!", 4);
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(240, rect.width || 406);
      this.height = Math.max(160, rect.height || 260);

      report(14, "Đang khởi tạo Engine 3D WebGL & Ánh sáng PBR...", 0);
      await waitFrame(65);

      if (window.THREE) {
        try {
          this.initThreeWebGLCore();
          this.webglReady = true;
        } catch (err) {
          console.warn("[Diorama3D] WebGL unavailable, switching to 2D fallback:", err);
          this.webglReady = false;
        }
      }

      if (this.webglReady) {
        report(30, "Đang dệt vân gỗ, đá cẩm thạch & bầu trời thành phố...", 1);
        await waitFrame(70);
        this.prepareProceduralTextures();
        this.buildSkylineBackdrop();
        this.prepareEmojiTextures();
        this.buildAmbientMotes();
        this.pinWarmShaderMaterials();

        const prewarmConfigs = [
          { tier: 0, age: 3, gender: "Nam", intel: 55, vip: false, pct: 46, stage: 2, label: "Đang nạp mô hình Phòng Tuổi Thơ & Nhân vật nhí (1/5)..." },
          { tier: 1, age: 19, gender: "Nữ", intel: 80, vip: false, pct: 57, stage: 2, label: "Đang nạp mô hình Phòng Trọ 12m² & Góc PC (2/5)..." },
          { tier: 2, age: 28, gender: "Nam", intel: 82, vip: false, pct: 68, stage: 2, label: "Đang nạp mô hình Chung Cư & Thú cưng Corgi (3/5)..." },
          { tier: 3, age: 42, gender: "Nữ", intel: 88, vip: true, pct: 78, stage: 3, label: "Đang nạp mô hình Biệt Thự & Siêu xe 3D (4/5)..." },
          { tier: 4, age: 65, gender: "Nam", intel: 92, vip: true, pct: 88, stage: 3, label: "Đang biên dịch Shader Penthouse & Hồ bơi vô cực (5/5)..." }
        ];

        const savedState = Object.assign({}, this.state);
        for (let i = 0; i < prewarmConfigs.length; i++) {
          const cfg = prewarmConfigs[i];
          report(cfg.pct, cfg.label, cfg.stage);
          await waitFrame(75);
          this.roomTier = cfg.tier;
          this.state = Object.assign({}, savedState, {
            age: cfg.age,
            gender: cfg.gender,
            intelligence: cfg.intel,
            vip: cfg.vip,
            isAlive: true
          });
          this.buildThreeRoom();
          this.buildThreeChibi();
          this.applyNightAtmosphere();
          if (this.renderer && typeof this.renderer.compile === "function") {
            this.renderer.compile(this.scene, this.camera);
          }
          if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
          }
        }

        this.state = savedState;
        this.roomTier = this.computeRoomTier(this.state);
        this.builtSignature = "";
      }

      report(95, "Đang đồng bộ 170 sự kiện & Bảng Xếp Hạng Live...", 4);
      await waitFrame(65);

      this.attachResizeAndEvents();
      this.handleResize();
      this.rebuildSceneIfNeeded(true);
      this.applyNightAtmosphere();
      if (this.webglReady && this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
      this.startRenderLoop();
      report(100, "Sẵn sàng bước vào hành trình Tỷ Phú!", 4);
    }

    pinWarmShaderMaterials() {
      if (!this.webglReady || !window.THREE) return;
      const THREE = window.THREE;
      // Upload procedural textures to GPU upfront so switching rooms/moods never stutters
      if (this.renderer && typeof this.renderer.initTexture === "function") {
        [this.woodTex, this.marbleTex, this.windowGridTex, this.shadowDiscTex, this.moteTex].forEach((tex) => {
          if (tex) this.renderer.initTexture(tex);
        });
        Object.values(this.moodTextures || {}).forEach((tex) => {
          if (tex) this.renderer.initTexture(tex);
        });
      }
      // Retain 1 reference per PBR shader variant so WebGLProgram cache stays warm across clearGroup()
      const warmGroup = new THREE.Group();
      warmGroup.visible = true;
      warmGroup.position.set(0, -999, 0);
      const tinyGeo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
      const variants = [
        this.makeMat(0xffffff, 0.6, 0.1),
        this.makeMat(0xffffff, 0.58, 0.06, this.woodTex ? { map: this.woodTex } : {}),
        this.makeMat(0xffffff, 0.20, 0.22, this.marbleTex ? { map: this.marbleTex } : {}),
        this.makeMat(0x38bdf8, 0.2, 0.5, { emissive: 0x38bdf8, emissiveIntensity: 0.5 }),
        this.makeMat(0x06b6d4, 0.08, 0.15, { emissive: 0x0891b2, emissiveIntensity: 0.48, transparent: true, opacity: 0.86 })
      ];
      variants.forEach((mat) => {
        const m = new THREE.Mesh(tinyGeo, mat);
        m.frustumCulled = false;
        warmGroup.add(m);
      });
      this._warmMaterials = variants;
      this.scene.add(warmGroup);
      if (this.renderer && typeof this.renderer.compile === "function") {
        this.renderer.compile(this.scene, this.camera);
      }
      warmGroup.visible = false;
    }

    initThreeWebGL() {
      this.initThreeWebGLCore();
      this.prepareProceduralTextures();
      this.buildSkylineBackdrop();
      this.prepareEmojiTextures();
      this.buildAmbientMotes();
      this.pinWarmShaderMaterials();
    }

    initThreeWebGLCore() {
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
      this.renderer.toneMappingExposure = 1.06;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.scene = new THREE.Scene();

      const frustum = 6.05;
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
      this.camera.lookAt(0, 1.16, 0);

      // Ánh sáng 3 điểm PBR Cozy
      this.hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.82);
      this.scene.add(this.hemiLight);

      this.dirLight = new THREE.DirectionalLight(0xfff4d6, 1.35);
      this.dirLight.position.set(6.5, 11.2, 4.8);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 1;
      this.dirLight.shadow.camera.far = 26;
      const d = 4.4;
      this.dirLight.shadow.camera.left = -d;
      this.dirLight.shadow.camera.right = d;
      this.dirLight.shadow.camera.top = d;
      this.dirLight.shadow.camera.bottom = -d;
      this.dirLight.shadow.bias = -0.0008;
      this.scene.add(this.dirLight);

      this.rimLight = new THREE.DirectionalLight(0x60a5fa, 0.42);
      this.rimLight.position.set(-7.5, 5.2, -6.5);
      this.scene.add(this.rimLight);

      // Sao đêm 3D & Mặt trời / Mặt trăng
      const starGeo = new THREE.BufferGeometry();
      const starPos = [];
      for (let i = 0; i < 110; i++) {
        starPos.push((Math.random() - 0.5) * 18, 1.6 + Math.random() * 6.5, -4.5 - Math.random() * 6);
      }
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.085, transparent: true, opacity: 0 });
      this.starPoints = new THREE.Points(starGeo, starMat);
      this.scene.add(this.starPoints);

      this.celestialMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xfde047 })
      );
      this.celestialMesh.position.set(-4.2, 4.9, -6.8);
      this.scene.add(this.celestialMesh);

      this.dioramaGroup = new THREE.Group();
      this.scene.add(this.dioramaGroup);

      this.roomGroup = new THREE.Group();
      this.chibiGroup = new THREE.Group();
      this.cityGroup = new THREE.Group();
      this.dioramaGroup.add(this.cityGroup);
      this.dioramaGroup.add(this.roomGroup);
      this.dioramaGroup.add(this.chibiGroup);
    }

    prepareProceduralTextures() {
      const THREE = window.THREE;

      // 1. Sàn gỗ ấm PBR
      const wc = document.createElement("canvas");
      wc.width = 256;
      wc.height = 256;
      const wg = wc.getContext("2d");
      wg.fillStyle = "#c89660";
      wg.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 32) {
        wg.fillStyle = (y / 32) % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
        wg.fillRect(0, y, 256, 32);
        wg.fillStyle = "rgba(65,36,14,0.28)";
        wg.fillRect(0, y, 256, 2);
        const offset = ((y / 32) % 2) * 64;
        for (let x = offset; x < 256; x += 128) {
          wg.fillRect(x, y, 2, 32);
        }
        wg.strokeStyle = "rgba(92,51,23,0.12)";
        wg.lineWidth = 1;
        for (let k = 0; k < 5; k++) {
          wg.beginPath();
          wg.moveTo(0, y + 6 + k * 5);
          wg.lineTo(256, y + 7 + k * 5);
          wg.stroke();
        }
      }
      this.woodTex = new THREE.CanvasTexture(wc);
      this.woodTex.wrapS = THREE.RepeatWrapping;
      this.woodTex.wrapT = THREE.RepeatWrapping;
      this.woodTex.repeat.set(2, 2);
      this.woodTex.encoding = THREE.sRGBEncoding;

      // 2. Sàn đá cẩm thạch vân vàng Penthouse
      const mc = document.createElement("canvas");
      mc.width = 256;
      mc.height = 256;
      const mg = mc.getContext("2d");
      mg.fillStyle = "#f1f5f9";
      mg.fillRect(0, 0, 256, 256);
      mg.strokeStyle = "rgba(148,163,184,0.32)";
      mg.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        mg.beginPath();
        mg.moveTo(i * 44, 0);
        mg.bezierCurveTo(i * 44 + 28, 85, i * 44 - 24, 170, i * 44 + 16, 256);
        mg.stroke();
      }
      mg.strokeStyle = "rgba(245,158,11,0.38)";
      mg.lineWidth = 1.4;
      mg.beginPath();
      mg.moveTo(0, 72);
      mg.bezierCurveTo(90, 95, 175, 48, 256, 86);
      mg.stroke();
      mg.strokeStyle = "rgba(203,213,225,0.6)";
      mg.lineWidth = 2;
      for (let g = 64; g < 256; g += 64) {
        mg.strokeRect(0, g, 256, 64);
      }
      this.marbleTex = new THREE.CanvasTexture(mc);
      this.marbleTex.wrapS = THREE.RepeatWrapping;
      this.marbleTex.wrapT = THREE.RepeatWrapping;
      this.marbleTex.encoding = THREE.sRGBEncoding;

      // 3. Cửa sổ sáng đèn trên cao ốc Skyline
      const sc = document.createElement("canvas");
      sc.width = 128;
      sc.height = 256;
      const sg = sc.getContext("2d");
      sg.fillStyle = "#091122";
      sg.fillRect(0, 0, 128, 256);
      for (let row = 12; row < 244; row += 22) {
        for (let col = 10; col < 118; col += 20) {
          const lit = ((row * 7 + col * 13) % 10) > 3;
          if (lit) {
            sg.fillStyle = ((row + col) % 3 === 0) ? "#fde68a" : "#7dd3fc";
            sg.fillRect(col, row, 12, 13);
          } else {
            sg.fillStyle = "#162442";
            sg.fillRect(col, row, 12, 13);
          }
        }
      }
      this.windowGridTex = new THREE.CanvasTexture(sc);
      this.windowGridTex.encoding = THREE.sRGBEncoding;

      // 4. Bóng tiếp xúc mềm dưới chân nhân vật (Contact Shadow AO)
      const dc = document.createElement("canvas");
      dc.width = 128;
      dc.height = 128;
      const dg = dc.getContext("2d");
      const grad = dg.createRadialGradient(64, 64, 6, 64, 64, 58);
      grad.addColorStop(0, "rgba(2, 6, 23, 0.45)");
      grad.addColorStop(0.55, "rgba(2, 6, 23, 0.18)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      dg.fillStyle = grad;
      dg.fillRect(0, 0, 128, 128);
      this.shadowDiscTex = new THREE.CanvasTexture(dc);

      // 5. Hạt ánh sáng không khí lơ lửng
      const ac = document.createElement("canvas");
      ac.width = 32;
      ac.height = 32;
      const ag = ac.getContext("2d");
      const agr = ag.createRadialGradient(16, 16, 1, 16, 16, 15);
      agr.addColorStop(0, "rgba(255,255,255,0.95)");
      agr.addColorStop(0.45, "rgba(253,230,138,0.45)");
      agr.addColorStop(1, "rgba(255,255,255,0)");
      ag.fillStyle = agr;
      ag.fillRect(0, 0, 32, 32);
      this.moteTex = new THREE.CanvasTexture(ac);
    }

    buildAmbientMotes() {
      const THREE = window.THREE;
      this.ambientMotes = [];
      for (let i = 0; i < 16; i++) {
        const mat = new THREE.SpriteMaterial({
          map: this.moteTex,
          color: 0xfde68a,
          transparent: true,
          opacity: 0.42
        });
        const sp = new THREE.Sprite(mat);
        const bx = (Math.random() - 0.5) * 3.8;
        const by = 0.25 + Math.random() * 2.1;
        const bz = (Math.random() - 0.5) * 3.8;
        sp.position.set(bx, by, bz);
        const sc = 0.08 + Math.random() * 0.08;
        sp.scale.set(sc, sc, sc);
        this.dioramaGroup.add(sp);
        this.ambientMotes.push({
          sprite: sp,
          bx,
          by,
          bz,
          phase: Math.random() * Math.PI * 2,
          speed: 0.7 + Math.random() * 0.8
        });
      }
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
      const frustum = 6.05 / this.zoomFactor;
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

    addContactShadow(parent, x, z, radius = 0.42) {
      if (!this.shadowDiscTex) return;
      const THREE = window.THREE;
      const mat = new THREE.MeshBasicMaterial({
        map: this.shadowDiscTex,
        transparent: true,
        depthWrite: false
      });
      const disc = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), mat);
      disc.position.set(x, 0.036, z);
      disc.rotation.x = -Math.PI / 2;
      parent.add(disc);
    }

    buildSkylineBackdrop() {
      if (!this.cityGroup) return;
      const THREE = window.THREE;
      this.cityMaterials = [];
      const bColors = [0x0f172a, 0x162238, 0x0b1222, 0x1e293b];
      const buildings = [
        [-3.2, -3.6, 0.72, 2.9, 0.72],
        [-1.8, -4.1, 0.85, 3.8, 0.85],
        [-0.2, -3.8, 0.76, 3.1, 0.76],
        [1.3, -4.0, 0.90, 4.3, 0.90],
        [2.7, -3.5, 0.72, 3.2, 0.72],
        [-3.9, -1.9, 0.78, 3.0, 0.78],
        [-4.0, 0.1, 0.82, 3.7, 0.82],
        [-3.6, 2.0, 0.70, 2.6, 0.70]
      ];
      buildings.forEach(([x, z, w, height, d], idx) => {
        const geo = new THREE.BoxGeometry(w, height, d);
        const mat = this.makeMat(bColors[idx % bColors.length], 0.75, 0.2, {
          map: this.windowGridTex,
          emissive: 0xffffff,
          emissiveMap: this.windowGridTex,
          emissiveIntensity: 0.35
        });
        this.cityMaterials.push(mat);
        this.addMesh(this.cityGroup, geo, mat, x, height / 2 - 1.9, z, 0, 0, 0, false, false);
        if (height >= 3.5) {
          this.addMesh(
            this.cityGroup,
            new THREE.SphereGeometry(0.045, 8, 8),
            new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0xf43f5e : 0x38bdf8 }),
            x, height - 1.84, z, 0, 0, 0, false, false
          );
        }
      });
    }

    applyNightAtmosphere() {
      if (!this.canvas) return;
      if (this.nightMode) {
        this.canvas.style.background = "radial-gradient(circle at 50% 22%, #172554 0%, #050914 100%)";
      } else {
        this.canvas.style.background = "radial-gradient(circle at 50% 18%, #284b82 0%, #0f1933 100%)";
      }

      if (!this.webglReady) return;
      if (this.hemiLight) {
        this.hemiLight.intensity = this.nightMode ? 0.42 : 0.76;
        this.hemiLight.color.setHex(this.nightMode ? 0x60a5fa : 0xe0f2fe);
      }
      if (this.dirLight) {
        this.dirLight.intensity = this.nightMode ? 0.56 : 1.25;
        this.dirLight.color.setHex(this.nightMode ? 0x93c5fd : 0xfff5db);
      }
      if (this.rimLight) {
        this.rimLight.intensity = this.nightMode ? 0.55 : 0.38;
        this.rimLight.color.setHex(this.nightMode ? 0x38bdf8 : 0x93c5fd);
      }
      if (this.starPoints) {
        this.starPoints.material.opacity = this.nightMode ? 0.92 : 0.0;
      }
      if (this.celestialMesh) {
        this.celestialMesh.material.color.setHex(this.nightMode ? 0xe0f2fe : 0xfde047);
        this.celestialMesh.position.set(this.nightMode ? 3.9 : -4.2, 4.9, -6.8);
      }
      if (this.cityMaterials) {
        this.cityMaterials.forEach((m) => {
          m.emissiveIntensity = this.nightMode ? 0.88 : 0.25;
        });
      }
      if (this.windowGlassMat) {
        this.windowGlassMat.color.setHex(this.nightMode ? 0x1e3a8a : 0x7dd3fc);
        this.windowGlassMat.emissive.setHex(this.nightMode ? 0x1d4ed8 : 0x38bdf8);
        this.windowGlassMat.emissiveIntensity = this.nightMode ? 0.65 : 0.42;
      }
      this.accentLights.forEach((l) => {
        l.intensity = this.nightMode ? l.userData.nightIntensity : l.userData.dayIntensity;
      });
      this.ambientMotes.forEach((m) => {
        m.sprite.material.color.setHex(this.nightMode ? 0x38bdf8 : 0xfde68a);
        m.sprite.material.opacity = this.nightMode ? 0.55 : 0.36;
      });
    }

    rebuildSceneIfNeeded(force) {
      const s = this.state;
      const stageBucket = s.age < 6 ? "inf" : (s.age < 15 ? "kid" : (s.age < 18 ? "teen" : (s.age < 60 ? "adult" : "sen")));
      const glassesBucket = (s.intelligence || 0) >= 75 ? "g1" : "g0";
      const vipBucket = s.vip ? "vip1" : "vip0";
      const sig = `${this.roomTier}|${stageBucket}|${s.gender}|${s.isAlive}|${glassesBucket}|${vipBucket}`;
      if (!force && sig === this.builtSignature) return;
      this.builtSignature = sig;

      if (!this.webglReady) return;
      this.buildThreeRoom();
      this.buildThreeChibi();
      this.applyNightAtmosphere();
    }

    addAccentLight(color, dayIntensity, nightIntensity, x, y, z, distance = 4.5) {
      const pt = new window.THREE.PointLight(color, this.nightMode ? nightIntensity : dayIntensity, distance, 1.8);
      pt.position.set(x, y, z);
      pt.userData = { dayIntensity, nightIntensity };
      this.roomGroup.add(pt);
      this.accentLights.push(pt);
    }

    buildWallDecor(t, trimColor) {
      const THREE = window.THREE;
      // Tranh nghệ thuật treo tường trái
      const frameColor = t >= 3 ? 0xf59e0b : trimColor;
      const artColor = t === 4 ? 0x38bdf8 : (t === 3 ? 0xdc2626 : (t === 0 ? 0xf472b6 : 0x10b981));
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.05, 0.72, 0.98), this.makeMat(frameColor, 0.35, 0.5), -2.01, 1.52, -0.55);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.03, 0.56, 0.82), this.makeMat(artColor, 0.45, 0.1, { emissive: artColor, emissiveIntensity: 0.16 }), -1.99, 1.52, -0.55);

      // Đồng hồ treo tường nhỏ trên tường sau
      this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.22, 0.22, 0.05, 18), this.makeMat(frameColor, 0.4, 0.4), -1.12, 1.86, -2.01, Math.PI / 2, 0, 0);
      this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.17, 0.17, 0.06, 18), this.makeMat(0xf8fafc, 0.9), -1.12, 1.86, -2.00, Math.PI / 2, 0, 0);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.025, 0.11, 0.02), this.makeMat(0x0f172a), -1.12, 1.90, -1.96);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.09, 0.025, 0.02), this.makeMat(0x0f172a), -1.08, 1.86, -1.96);
    }

    buildPet(cx, cz) {
      const THREE = window.THREE;
      const petGroup = new THREE.Group();
      petGroup.position.set(cx, 0.03, cz);
      petGroup.rotation.y = 0.6;
      this.addContactShadow(this.roomGroup, cx, cz, 0.26);

      const furMat = this.makeMat(0xea580c, 0.8);
      const bellyMat = this.makeMat(0xfef3c7, 0.85);
      const darkMat = this.makeMat(0x0f172a, 0.2);

      // Thân & chân chú chó Corgi mini
      this.addMesh(petGroup, new THREE.BoxGeometry(0.22, 0.18, 0.34), furMat, 0, 0.16, 0);
      this.addMesh(petGroup, new THREE.BoxGeometry(0.16, 0.10, 0.24), bellyMat, 0, 0.10, 0.04);
      [[-0.07, 0.11], [0.07, 0.11], [-0.07, -0.11], [0.07, -0.11]].forEach(([lx, lz]) => {
        this.addMesh(petGroup, new THREE.BoxGeometry(0.06, 0.10, 0.06), bellyMat, lx, 0.05, lz);
      });

      const head = new THREE.Group();
      head.position.set(0, 0.28, 0.15);
      this.addMesh(head, new THREE.BoxGeometry(0.20, 0.18, 0.20), furMat, 0, 0, 0);
      this.addMesh(head, new THREE.BoxGeometry(0.12, 0.08, 0.08), bellyMat, 0, -0.04, 0.10);
      this.addMesh(head, new THREE.BoxGeometry(0.04, 0.03, 0.03), darkMat, 0, -0.02, 0.14);
      this.addMesh(head, new THREE.BoxGeometry(0.03, 0.03, 0.02), darkMat, -0.05, 0.03, 0.10);
      this.addMesh(head, new THREE.BoxGeometry(0.03, 0.03, 0.02), darkMat, 0.05, 0.03, 0.10);
      this.addMesh(head, new THREE.ConeGeometry(0.045, 0.10, 4), furMat, -0.07, 0.12, 0);
      this.addMesh(head, new THREE.ConeGeometry(0.045, 0.10, 4), furMat, 0.07, 0.12, 0);
      petGroup.add(head);

      const tail = this.addMesh(petGroup, new THREE.BoxGeometry(0.05, 0.12, 0.05), furMat, 0, 0.23, -0.18, -0.5, 0, 0);
      this.roomGroup.add(petGroup);
      this.petRig = { petGroup, head, tail };
    }

    buildSportsCarDisplay(cx, cz) {
      const THREE = window.THREE;
      // Bệ kính trưng bày siêu xe mô hình đẳng cấp
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.95, 0.08, 0.56), this.makeMat(0x1e293b, 0.2, 0.7), cx, 0.07, cz);
      const carColor = this.roomTier >= 4 ? 0xf59e0b : 0xef4444;
      const bodyMat = this.makeMat(carColor, 0.16, 0.78);
      const glassMat = this.makeMat(0x020617, 0.1, 0.9);
      const wheelMat = this.makeMat(0x0f172a, 0.6, 0.2);

      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.76, 0.14, 0.36), bodyMat, cx, 0.20, cz);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.38, 0.11, 0.30), glassMat, cx - 0.04, 0.31, cz);
      [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]].forEach(([wx, wz]) => {
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.07, 0.07, 0.05, 12), wheelMat, cx + wx, 0.15, cz + wz, Math.PI / 2, 0, 0);
      });
    }

    buildThreeRoom() {
      const THREE = window.THREE;
      this.clearGroup(this.roomGroup);
      this.accentLights = [];
      this.fanBlades = null;
      this.poolWaterMesh = null;
      this.petRig = null;

      const t = this.roomTier;
      const themes = [
        { floor: 0xdfb282, base: 0x8b5e34, wallBack: 0xf6e7d0, wallLeft: 0xebd6b7, trim: 0xc28550, useWood: true },
        { floor: 0x9aa5b4, base: 0x475569, wallBack: 0xe2e8f0, wallLeft: 0xcbd5e1, trim: 0x64748b, useWood: false },
        { floor: 0xd6ae80, base: 0x334155, wallBack: 0xf1f5f9, wallLeft: 0xe2e8f0, trim: 0x475569, useWood: true },
        { floor: 0x966742, base: 0x2b1d12, wallBack: 0xf5ebd6, wallLeft: 0xe8d9be, trim: 0xb48332, useWood: true },
        { floor: 0xffffff, base: 0x1e293b, wallBack: 0x1e293b, wallLeft: 0x162032, trim: 0xf59e0b, useMarble: true }
      ];
      const pal = themes[t];

      // Đế kiến trúc nổi + sàn PBR có vân gỗ / đá cẩm thạch
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.48, 0.14, 4.48), this.makeMat(0x0f172a, 0.7, 0.25), -0.06, -0.35, -0.06, 0, 0, 0, false, true);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.36, 0.28, 4.36), this.makeMat(pal.base, 0.72, 0.1), -0.06, -0.14, -0.06, 0, 0, 0, true, true);

      const floorExtras = {};
      if (pal.useWood && this.woodTex) floorExtras.map = this.woodTex;
      if (pal.useMarble && this.marbleTex) floorExtras.map = this.marbleTex;
      this.addMesh(
        this.roomGroup,
        new THREE.BoxGeometry(4.2, 0.04, 4.2),
        this.makeMat(pal.floor, t === 4 ? 0.20 : 0.58, t === 4 ? 0.22 : 0.06, floorExtras),
        0.02, 0.01, 0.02, 0, 0, 0, false, true
      );

      // 2 Tường Cutaway Isometric
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.36, 2.48, 0.20), this.makeMat(pal.wallBack, 0.85, 0.02), -0.06, 1.24, -2.14);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.20, 2.48, 4.20), this.makeMat(pal.wallLeft, 0.85, 0.02), -2.14, 1.24, -0.02);

      // Len chân tường (skirting)
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(4.16, 0.12, 0.04), this.makeMat(pal.trim, 0.45, 0.2), 0.04, 0.08, -2.02);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.04, 0.12, 4.10), this.makeMat(pal.trim, 0.45, 0.2), -2.02, 0.08, 0.04);

      // Cửa sổ kính & rèm vải
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.56, 1.12, 0.06), this.makeMat(pal.trim, 0.45, 0.25), 0.52, 1.45, -2.02);
      this.windowGlassMat = this.makeMat(this.nightMode ? 0x1e3a8a : 0x7dd3fc, 0.15, 0.1, {
        emissive: this.nightMode ? 0x1d4ed8 : 0x38bdf8,
        emissiveIntensity: 0.45
      });
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.40, 0.96, 0.04), this.windowGlassMat, 0.52, 1.45, -1.99, 0, 0, 0, false, false);
      const curtainMat = this.makeMat(t >= 3 ? 0x991b1b : 0x93c5fd, 0.9, 0.0);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 1.22, 0.09), curtainMat, -0.22, 1.43, -1.97);
      this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 1.22, 0.09), curtainMat, 1.26, 1.43, -1.97);

      this.buildWallDecor(t, pal.trim);

      if (t === 0) {
        // TIER 0: PHÒNG TUỔI THƠ ẤM ÁP
        this.buildBed(-1.25, -1.05, 1.15, 1.85, 0x9a6b42, 0x60a5fa, true);
        const bearMat = this.makeMat(0xb45309, 0.85);
        this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.11, 12, 12), bearMat, -1.25, 0.54, -1.52);
        this.addMesh(this.roomGroup, new THREE.SphereGeometry(0.08, 12, 12), bearMat, -1.25, 0.69, -1.52);

        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.82, 0.82, 0.02, 28), this.makeMat(0xf472b6, 0.92), 0.15, 0.04, 0.45, 0, 0, 0, false, true);
        this.buildDesk(1.0, -1.45, 1.35, 0.7, 0xc28550, 0xfbbf24);
        this.addAccentLight(0xfde047, 0.35, 1.45, 1.4, 1.15, -1.5);

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

        this.buildDesk(0.95, -1.45, 1.48, 0.74, 0x334155, null);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.92, 0.50, 0.05), this.makeMat(0x0f172a, 0.3, 0.5, { emissive: 0x10b981, emissiveIntensity: 0.75 }), 0.92, 0.96, -1.58);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.22, 0.44, 0.42), this.makeMat(0x1e293b, 0.4, 0.6, { emissive: 0x38bdf8, emissiveIntensity: 0.28 }), 1.54, 0.86, -1.42);
        this.addAccentLight(0x34d399, 0.42, 1.55, 0.92, 1.05, -1.25);

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

        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.45, 0.32, 0.34), this.makeMat(0xf97316, 0.75), -1.65, 0.19, 1.15);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.20, 0.23, 0.10, 16), this.makeMat(0xb45309, 0.5), -1.86, 0.36, 0.35, 0, 0, 1.35);
      } else if (t === 2) {
        // TIER 2: CĂN HỘ CHUNG CƯ HIỆN ĐẠI
        this.buildBed(-1.18, -1.02, 1.45, 1.92, 0x1e293b, 0x2563eb, false);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.45, 0.42, 0.45), this.makeMat(0x475569, 0.6), -0.18, 0.23, -1.68);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.14, 0.18, 0.24, 14), this.makeMat(0xfef08a, 0.3, 0, { emissive: 0xfbbf24, emissiveIntensity: 0.6 }), -0.18, 0.60, -1.68);
        this.addAccentLight(0xfde047, 0.35, 1.25, -0.18, 0.72, -1.55);

        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.75, 0.03, 1.55), this.makeMat(0xcbd5e1, 0.95), 0.95, 0.04, 0.75, 0, 0, 0, false, true);
        this.buildSofa(1.10, 1.25, 1.45, 0.68, 0xb45309);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.85, 0.28, 0.50), this.makeMat(0x94a3b8, 0.15, 0.6), 1.05, 0.18, 0.42);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.06, 0.76, 1.32), this.makeMat(0x020617, 0.2, 0.7, { emissive: 0x3b82f6, emissiveIntensity: 0.35 }), -2.01, 1.25, 0.85);
        this.buildPlant(-1.72, 1.62, 1.0);
        this.buildPet(-0.92, 1.22);
      } else if (t === 3) {
        // TIER 3: BIỆT THỰ PHỐ THƯỢNG LƯU
        this.buildBed(-1.12, -1.0, 1.58, 1.98, 0x78350f, 0x1e3a8a, false);
        this.buildDesk(1.02, -1.35, 1.45, 0.75, 0x451a03, 0xf59e0b);
        this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.08, 0.05, 0.24, 12), this.makeMat(0xfbbf24, 0.2, 0.9), 0.65, 0.78, -1.4);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.55, 1.75, 1.15), this.makeMat(0x451a03, 0.45, 0.2), -1.75, 0.90, 0.75);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.05, 1.42, 0.95), this.makeMat(0xfbbf24, 0.2, 0.4, { emissive: 0xf59e0b, emissiveIntensity: 0.6 }), -1.46, 0.92, 0.75);
        this.addAccentLight(0xf59e0b, 0.45, 1.5, -1.2, 1.1, 0.75);
        this.buildSofa(1.05, 1.22, 1.48, 0.70, 0x991b1b);
        this.addMesh(this.roomGroup, new THREE.TorusGeometry(0.36, 0.04, 10, 24), this.makeMat(0xfbbf24, 0.2, 0.85, { emissive: 0xfde047, emissiveIntensity: 0.5 }), 0.1, 2.25, 0.1, Math.PI / 2, 0, 0);
        this.addAccentLight(0xfef08a, 0.45, 1.45, 0.1, 2.05, 0.1, 6.0);
        this.buildPet(-0.92, 1.22);
        this.buildSportsCarDisplay(-0.78, 1.72);
      } else {
        // TIER 4: PENTHOUSE ĐỈNH THÁP & HỒ BƠI VÔ CỰC
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(3.8, 0.012, 0.06), this.makeMat(0xf59e0b, 0.2, 0.9), 0.02, 0.034, 1.95, 0, 0, 0, false, true);
        this.buildBed(-1.18, -1.05, 1.55, 1.95, 0xf59e0b, 0x334155, false);

        const pianoMat = this.makeMat(0x090d16, 0.12, 0.55);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.15, 0.22, 0.95), pianoMat, 1.05, 0.62, -1.18);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.02, 0.04, 0.88), pianoMat, 1.05, 0.94, -1.24, -0.38, 0, 0);
        this.addMesh(this.roomGroup, new THREE.BoxGeometry(0.95, 0.05, 0.18), this.makeMat(0xffffff, 0.3), 1.05, 0.62, -0.66);
        [[-0.45, -0.35], [0.45, -0.35], [0, 0.35]].forEach(([lx, lz]) => {
          this.addMesh(this.roomGroup, new THREE.CylinderGeometry(0.04, 0.03, 0.54, 10), pianoMat, 1.05 + lx, 0.28, -1.18 + lz);
        });

        this.addMesh(this.roomGroup, new THREE.BoxGeometry(1.92, 0.16, 1.52), this.makeMat(0xe2e8f0, 0.3, 0.2), 1.02, 0.10, 1.18);
        this.poolWaterMesh = this.addMesh(
          this.roomGroup,
          new THREE.BoxGeometry(1.72, 0.12, 1.32),
          this.makeMat(0x06b6d4, 0.08, 0.15, { emissive: 0x0891b2, emissiveIntensity: 0.48, transparent: true, opacity: 0.86 }),
          1.02, 0.16, 1.18, 0, 0, 0, false, true
        );
        this.addMesh(this.roomGroup, new THREE.TorusGeometry(0.19, 0.065, 12, 20), this.makeMat(0xf43f5e, 0.35, 0.1), 1.25, 0.23, 1.25, Math.PI / 2, 0, 0);
        this.addAccentLight(0x22d3ee, 0.58, 1.85, 1.02, 0.65, 1.18, 5.2);
        this.buildPlant(-1.72, 1.58, 1.35);
        this.buildPet(-0.92, 1.18);
        this.buildSportsCarDisplay(-0.78, 1.72);
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

      this.addContactShadow(this.chibiGroup, -0.08, 0.12, 0.42);

      if (!this.state.isAlive) {
        this.addMesh(this.chibiGroup, new THREE.BoxGeometry(0.66, 0.14, 0.52), this.makeMat(0x475569, 0.8), -0.1, 0.10, 0.1);
        this.addMesh(this.chibiGroup, new THREE.BoxGeometry(0.42, 0.72, 0.14), this.makeMat(0x94a3b8, 0.65), -0.1, 0.50, 0.06);
        this.addMesh(this.chibiGroup, new THREE.CylinderGeometry(0.07, 0.05, 0.14, 12), this.makeMat(0xf59e0b, 0.25, 0.8), -0.1, 0.24, 0.24);
        return;
      }

      const age = this.state.age || 0;
      const t = this.roomTier;
      const charScale = age < 6 ? 0.64 : (age < 12 ? 0.78 : (age < 18 ? 0.91 : (age >= 60 ? 0.96 : 1.0)));

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

      const skinMat = this.makeMat(0xfcd5b5, 0.72);
      const hairColor = age >= 60 ? 0xdbeafe : (this.state.gender === "Nữ" ? 0x292524 : 0x18181b);
      const hairMat = this.makeMat(hairColor, 0.68);
      const shirtMat = this.makeMat(shirtColor, 0.62);
      const pantsMat = this.makeMat(pantsColor, 0.72);
      const shoeMat = this.makeMat(0x0f172a, 0.45, 0.2);

      // Giày & Chân
      this.addMesh(rigRoot, new THREE.BoxGeometry(0.15, 0.07, 0.19), shoeMat, -0.09, 0.04, 0.02);
      this.addMesh(rigRoot, new THREE.BoxGeometry(0.15, 0.07, 0.19), shoeMat, 0.09, 0.04, 0.02);
      const leftLeg = this.addMesh(rigRoot, new THREE.BoxGeometry(0.14, 0.30, 0.14), pantsMat, -0.09, 0.21, 0);
      const rightLeg = this.addMesh(rigRoot, new THREE.BoxGeometry(0.14, 0.30, 0.14), pantsMat, 0.09, 0.21, 0);

      // Thân & Bàn tay
      this.addMesh(rigRoot, new THREE.BoxGeometry(0.36, 0.46, 0.24), shirtMat, 0, 0.57, 0);
      this.addMesh(rigRoot, new THREE.BoxGeometry(0.24, 0.06, 0.25), this.makeMat(0xffffff, 0.8), 0, 0.78, 0.01);

      const leftArm = this.addMesh(rigRoot, new THREE.BoxGeometry(0.11, 0.32, 0.12), shirtMat, -0.25, 0.58, 0);
      this.addMesh(leftArm, new THREE.BoxGeometry(0.09, 0.08, 0.09), skinMat, 0, -0.18, 0);
      const rightArm = this.addMesh(rigRoot, new THREE.BoxGeometry(0.11, 0.32, 0.12), shirtMat, 0.25, 0.58, 0);
      this.addMesh(rightArm, new THREE.BoxGeometry(0.09, 0.08, 0.09), skinMat, 0, -0.18, 0);

      // Phụ kiện theo giai đoạn: Khăn quàng đỏ / Cà vạt
      if (age >= 6 && age <= 14) {
        this.addMesh(rigRoot, new THREE.BoxGeometry(0.30, 0.08, 0.26), this.makeMat(0xef4444, 0.6), 0, 0.77, 0.01);
        this.addMesh(rigRoot, new THREE.ConeGeometry(0.09, 0.24, 4), this.makeMat(0xef4444, 0.6), 0, 0.64, 0.14, Math.PI, 0, 0);
      } else if (age >= 18) {
        const tieColor = (t >= 3 || this.state.vip) ? 0xf59e0b : 0x2563eb;
        this.addMesh(rigRoot, new THREE.BoxGeometry(0.06, 0.24, 0.04), this.makeMat(tieColor, 0.3, 0.5), 0, 0.62, 0.13);
      }

      // Đầu, mắt sáng, má hồng, tóc mái & kính trí thức
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.04, 0);
      rigRoot.add(headGroup);

      this.addMesh(headGroup, new THREE.BoxGeometry(0.46, 0.44, 0.44), skinMat, 0, 0, 0);
      const eyeMat = this.makeMat(0x0f172a, 0.2, 0.2);
      const leftEye = this.addMesh(headGroup, new THREE.BoxGeometry(0.06, 0.075, 0.03), eyeMat, -0.10, 0.02, 0.22);
      const rightEye = this.addMesh(headGroup, new THREE.BoxGeometry(0.06, 0.075, 0.03), eyeMat, 0.10, 0.02, 0.22);
      const blushMat = this.makeMat(0xfb7185, 0.9);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.07, 0.035, 0.02), blushMat, -0.15, -0.05, 0.22);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.07, 0.035, 0.02), blushMat, 0.15, -0.05, 0.22);

      // Kính tri thức khi Trí tuệ >= 75
      if ((this.state.intelligence || 0) >= 75 && age >= 10) {
        const glassFrameMat = this.makeMat(0xf59e0b, 0.25, 0.85);
        this.addMesh(headGroup, new THREE.BoxGeometry(0.11, 0.09, 0.02), glassFrameMat, -0.10, 0.02, 0.235);
        this.addMesh(headGroup, new THREE.BoxGeometry(0.11, 0.09, 0.02), glassFrameMat, 0.10, 0.02, 0.235);
        this.addMesh(headGroup, new THREE.BoxGeometry(0.08, 0.02, 0.02), glassFrameMat, 0, 0.03, 0.235);
      }

      // Tóc nhiều lớp
      this.addMesh(headGroup, new THREE.BoxGeometry(0.50, 0.18, 0.48), hairMat, 0, 0.21, -0.01);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.50, 0.12, 0.12), hairMat, 0, 0.16, 0.21);
      this.addMesh(headGroup, new THREE.BoxGeometry(0.50, 0.32, 0.14), hairMat, 0, 0.04, -0.18);
      if (this.state.gender === "Nữ") {
        this.addMesh(headGroup, new THREE.BoxGeometry(0.54, 0.38, 0.18), hairMat, 0, -0.09, -0.17);
      }

      // Vương miện vàng khi đạt VIP hoặc Penthouse
      if (this.state.vip || (t >= 4 && age >= 18)) {
        this.addMesh(headGroup, new THREE.ConeGeometry(0.09, 0.16, 5), this.makeMat(0xfbbf24, 0.18, 0.92, { emissive: 0xf59e0b, emissiveIntensity: 0.28 }), 0, 0.37, 0);
      }

      // Sprite bong bóng cảm xúc 3D
      const emoji = this.state.stress >= 75 ? "😰" : (this.state.netWorth >= 1_000_000_000 ? "🤑" : (this.state.happiness >= 75 ? "😄" : "🙂"));
      const moodTex = this.moodTextures[emoji] || this.moodTextures["🙂"];
      if (moodTex) {
        this.moodSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: moodTex, transparent: true }));
        this.moodSprite.position.set(0, 1.58, 0);
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
        this.chibiRig.rigRoot.position.y = 0.03 + Math.sin(t * 3.0) * 0.018 + jump;
        this.chibiRig.headGroup.rotation.y = Math.sin(t * 1.25) * 0.14;
        this.chibiRig.leftArm.rotation.z = 0.08 + Math.sin(t * 3.0) * 0.06 + (this.celebrateTimer > 0 ? 0.65 : 0);
        this.chibiRig.rightArm.rotation.z = -0.08 - Math.sin(t * 3.0) * 0.06 - (this.celebrateTimer > 0 ? 0.65 : 0);

        this.blinkTimer += dt;
        const isBlinking = (this.blinkTimer % 3.4) > 3.24;
        const eyeScaleY = isBlinking ? 0.15 : 1.0;
        this.chibiRig.leftEye.scale.y = eyeScaleY;
        this.chibiRig.rightEye.scale.y = eyeScaleY;
      }

      if (this.petRig) {
        this.petRig.tail.rotation.z = Math.sin(t * 10.0) * 0.45;
        this.petRig.head.position.y = 0.28 + Math.sin(t * 3.6) * 0.015;
      }

      if (this.moodSprite) {
        this.moodSprite.position.y = 1.58 + Math.sin(t * 2.5) * 0.05;
      }

      for (let i = 0; i < this.ambientMotes.length; i++) {
        const m = this.ambientMotes[i];
        m.sprite.position.x = m.bx + Math.sin(t * 0.8 + m.phase) * 0.18;
        m.sprite.position.y = m.by + ((t * 0.18 * m.speed + m.phase) % 0.9);
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
