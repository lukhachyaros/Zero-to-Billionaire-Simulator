// Zero to Billionaire Simulator — Interactive Web Client Controller
(function () {
  const SAVE_KEY = "ztb_web_save_v2";
  const HALL_OF_FAME_KEY = "ztb_hall_of_fame_v1";
  const USD_BILLION_VND = 25_000_000_000_000; // 25.000 Tỷ VNĐ (~ $1B)
  const MAX_ACTIVITIES_PER_YEAR = 2;
  const MAX_TIME_MACHINE = 5;
  const ANNUAL_LOAN_RATE = 0.085;

  const FAMILY_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
  const MALE_MIDDLE = ["Gia", "Minh", "Đức", "Quốc", "Tuấn", "Hoàng", "Thành"];
  const MALE_GIVEN = ["Huy", "Khang", "Bảo", "Phúc", "An", "Khoa", "Đạt", "Long", "Nam", "Việt"];
  const FEMALE_MIDDLE = ["Ngọc", "Phương", "Thanh", "Bảo", "Minh", "Khánh", "Thảo"];
  const FEMALE_GIVEN = ["Linh", "Anh", "Vy", "Châu", "Ngân", "Trang", "Mai", "Hà", "Nhi", "Tâm"];

  const EDU_RANKS = {
    "Chưa đi học": 0,
    "Mầm non": 0,
    "Tiểu học": 1,
    "THCS": 2,
    "THPT": 3,
    "Học nghề": 4,
    "Đại học": 5
  };

  const MACRO_CYCLES = [
    { id: "Boom", label: "📈 Kinh tế Hưng thịnh", mult: 1.45, weight: 0.22 },
    { id: "Expansion", label: "🌤️ Tăng trưởng Ổn định", mult: 1.0, weight: 0.43 },
    { id: "Inflation", label: "🔥 Lạm phát Thắt chặt", mult: 0.75, weight: 0.20 },
    { id: "Recession", label: "🌧️ Suy thoái Phòng thủ", mult: -0.35, weight: 0.15 }
  ];

  const ACHIEVEMENTS = [
    { id: "ms_first_job", title: "💼 Lao Động Tự Lập", desc: "Nhận công việc chính thức đầu tiên." },
    { id: "ms_100m", title: "🏅 Tích Lũy 100 Triệu", desc: "Tài sản ròng chạm mốc 100 Triệu VNĐ." },
    { id: "ms_1b", title: "🏆 Tỷ Phú Tiền Đồng", desc: "Tài sản ròng đạt 1 Tỷ VNĐ." },
    { id: "ms_realestate", title: "🏢 Ông Trùm Nhà Đất", desc: "Sở hữu bất động sản từ Chung cư cao cấp trở lên." },
    { id: "ms_100b", title: "💎 Đại Gia Trăm Tỷ", desc: "Tài sản ròng vượt ngưỡng 100 Tỷ VNĐ." },
    { id: "ms_dynasty", title: "👑 Gia Tộc Truyền Đời", desc: "Kế thừa di sản sang thế hệ con cháu thứ 2+." },
    { id: "ms_longevity", title: "🍵 Bách Niên Giai Lão", desc: "Sống thọ và mạnh khỏe đến mốc 80 tuổi." },
    { id: "ms_usd_billionaire", title: "🌍 TỶ PHÚ ĐÔ LA THẾ GIỚI", desc: "Đạt 25.000 Tỷ VNĐ (~1 Tỷ USD)!" }
  ];

  const DATA = window.ZTB_DATA || {
    backgrounds: [],
    careers: [],
    assets: [],
    milestoneEvents: [],
    randomEvents: [],
    leaderboardRivals: []
  };

  const ALL_EVENTS = [...(DATA.milestoneEvents || []), ...(DATA.randomEvents || [])];

  const el = (id) => document.getElementById(id);

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatVND(amount) {
    const abs = Math.abs(amount || 0);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 1_000_000_000_000) {
      return `${sign}${(abs / 1_000_000_000_000).toFixed(2).replace(/\.?0+$/, "")} Nghìn Tỷ đ`;
    }
    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")} Tỷ đ`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")} Triệu đ`;
    }
    return `${Math.round(amount || 0).toLocaleString("en-US")} đ`;
  }

  function generateVietnameseName(gender, preferredSurname = "") {
    const surname = preferredSurname || FAMILY_NAMES[randInt(0, FAMILY_NAMES.length - 1)];
    if (gender === "Nữ") {
      return `${surname} ${FEMALE_MIDDLE[randInt(0, FEMALE_MIDDLE.length - 1)]} ${FEMALE_GIVEN[randInt(0, FEMALE_GIVEN.length - 1)]}`;
    }
    return `${surname} ${MALE_MIDDLE[randInt(0, MALE_MIDDLE.length - 1)]} ${MALE_GIVEN[randInt(0, MALE_GIVEN.length - 1)]}`;
  }

  class WebLifeSimulator {
    constructor() {
      this.stats = this.createBlankStats();
      this.portfolio = [];
      this.relationships = [];
      this.cashflowHistory = [];
      this.rivals = this.createInitialRivals();
      this.bestRank = 21;
      this.lifeLog = [];
      this.triggeredEvents = {};
      this.flags = {};
      this.achievements = {};
      this.queuedEvents = [];
      this.macroCycle = MACRO_CYCLES[1];
      this.activitiesLeft = MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = false;
      this.pendingEvent = null;
      this.timeMachine = [];
      this.activeTab = "life";
      this.assetFilter = "all";
      this.ledgerFilter = "all";
      this.toastTimer = null;

      // Modal states
      this.selectedGender = "Nam";
      this.selectedBackgroundId = (DATA.backgrounds[1] && DATA.backgrounds[1].backgroundId) || "bg_working_class";
    }

    createInitialRivals() {
      return (DATA.leaderboardRivals || []).map((r) => ({
        rivalId: r.rivalId,
        name: r.name,
        title: r.title,
        avatar: r.avatar,
        netWorth: r.baseNetWorth,
        lastGrowthPct: 0
      }));
    }

    createBlankStats() {
      return {
        lifeId: `life_${Date.now()}_${randInt(100, 999)}`,
        generation: 1,
        backgroundId: "bg_working_class",
        backgroundName: "Gia Đình Lao Động Bình Dân",
        characterName: "Nguyễn Gia Huy",
        gender: "Nam",
        age: 0,
        isAlive: true,
        causeOfDeath: "",
        health: 90,
        intelligence: 55,
        appearance: 60,
        happiness: 80,
        discipline: 50,
        stress: 10,
        luck: 50,
        parentRelationship: 80,
        socialStatus: 20,
        charisma: 45,
        financialLiteracy: 20,
        practicalSkills: 20,
        businessAcuity: 20,
        karma: 50,
        cash: 0,
        trustFund: 0,
        debt: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        pocketMoneyChild: 200000,
        pocketMoneyTeen: 1200000,
        comingOfAgeGrant: 8000000,
        familyAllowancePerYear: 4000000,
        peakNetWorth: 0,
        educationLevel: "Chưa đi học",
        currentCareerId: "",
        currentJob: "Trẻ nhỏ",
        yearsInCurrentJob: 0,
        isRetired: false,
        maritalStatus: "Độc thân",
        spouseName: "",
        childrenCount: 0
      };
    }

    init() {
      if (window.Diorama3D) {
        window.Diorama3D.init("diorama-canvas");
      }

      this.bindStaticUI();

      const loaded = this.loadFromStorage();
      if (loaded) {
        this.showToast(`📂 Chào mừng ${this.stats.characterName} trở lại!`);
        this.renderAll();
        if (!this.stats.isAlive) {
          this.openGameOverModal();
        }
      } else {
        this.startNewLife("Nguyễn Gia Huy", "Nam", this.selectedBackgroundId, true);
        this.openNewLifeModal();
      }
    }

    bindStaticUI() {
      // Tabs
      const tabContainer = el("bottom-tabs");
      if (tabContainer) {
        tabContainer.querySelectorAll(".tab-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (window.ZTBAudio) window.ZTBAudio.tap();
            this.switchTab(btn.dataset.tab);
          });
        });
      }

      el("btn-age-up").addEventListener("click", () => this.ageUp());
      el("hud-rank").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.switchTab("leaderboard");
      });
      el("money-chip-cash").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.switchTab("assets");
      });

      el("btn-day-night").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        const isNight = window.Diorama3D ? window.Diorama3D.toggleNightMode() : false;
        el("btn-day-night").textContent = isNight ? "🌙" : "☀️";
      });

      el("btn-sound").addEventListener("click", () => {
        if (!window.ZTBAudio) return;
        window.ZTBAudio.enabled = !window.ZTBAudio.enabled;
        el("btn-sound").textContent = window.ZTBAudio.enabled ? "🔊" : "🔇";
        if (window.ZTBAudio.enabled) window.ZTBAudio.tap();
      });

      el("btn-time-machine").addEventListener("click", () => this.useTimeMachine());
      el("btn-new-life-top").addEventListener("click", () => this.openNewLifeModal());
      el("btn-new-life-profile").addEventListener("click", () => this.openNewLifeModal());

      el("btn-manual-save").addEventListener("click", () => {
        this.saveToStorage();
        if (window.ZTBAudio) window.ZTBAudio.coin();
        this.showToast("💾 Đã lưu tiến trình vào bộ nhớ máy!");
      });

      el("btn-wipe-save").addEventListener("click", () => {
        localStorage.removeItem(SAVE_KEY);
        this.showToast("🗑️ Đã xóa dữ liệu lưu cũ. Đang tạo cuộc đời mới...");
        this.openNewLifeModal();
      });

      // New Life Modal
      el("btn-random-name").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        el("input-char-name").value = generateVietnameseName(this.selectedGender);
      });

      el("btn-gender-male").addEventListener("click", () => {
        this.selectedGender = "Nam";
        el("btn-gender-male").classList.add("active");
        el("btn-gender-female").classList.remove("active");
        el("input-char-name").value = generateVietnameseName("Nam");
      });

      el("btn-gender-female").addEventListener("click", () => {
        this.selectedGender = "Nữ";
        el("btn-gender-female").classList.add("active");
        el("btn-gender-male").classList.remove("active");
        el("input-char-name").value = generateVietnameseName("Nữ");
      });

      el("btn-start-new-life").addEventListener("click", () => {
        const chosenName = el("input-char-name").value.trim() || generateVietnameseName(this.selectedGender);
        el("new-life-modal").classList.remove("open");
        this.startNewLife(chosenName, this.selectedGender, this.selectedBackgroundId, false);
      });

      el("btn-close-new-life").addEventListener("click", () => {
        el("new-life-modal").classList.remove("open");
      });

      el("btn-gameover-new-life").addEventListener("click", () => {
        el("gameover-modal").classList.remove("open");
        this.openNewLifeModal();
      });
    }

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === `tab-${tabId}`);
      });
      el("bottom-tabs").querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tabId);
      });
      this.renderCurrentTab();
    }

    showToast(msg) {
      const box = el("toast-notification");
      box.textContent = msg;
      box.classList.add("show");
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => box.classList.remove("show"), 3200);
    }

    clampStats() {
      const keys = [
        "health", "intelligence", "appearance", "happiness", "discipline", "stress",
        "luck", "parentRelationship", "socialStatus", "charisma",
        "financialLiteracy", "practicalSkills", "businessAcuity", "karma"
      ];
      for (const k of keys) {
        this.stats[k] = clamp(Math.round(this.stats[k] || 0), 0, 100);
      }

      if (this.stats.cash < 0) {
        this.stats.debt += -this.stats.cash;
        this.stats.cash = 0;
      }
      if (this.stats.debt < 0) this.stats.debt = 0;

      if (this.stats.health <= 0 && this.stats.isAlive) {
        this.stats.isAlive = false;
        if (!this.stats.causeOfDeath) {
          this.stats.causeOfDeath = this.stats.age >= 75
            ? "Tuổi cao sức yếu, ra đi thanh thản bên con cháu"
            : "Sức khỏe suy kiệt vì bệnh tật và áp lực kéo dài";
        }
      }
    }

    applyStatModifiers(mods) {
      if (!mods) return;
      const numericKeys = [
        "health", "intelligence", "appearance", "happiness", "discipline", "stress",
        "luck", "parentRelationship", "socialStatus", "charisma",
        "financialLiteracy", "practicalSkills", "businessAcuity", "karma"
      ];
      for (const k of numericKeys) {
        if (typeof mods[k] === "number") {
          this.stats[k] += mods[k];
        }
      }
      this.stats.cash += (mods.cash || 0) + (mods.money || 0);
      this.stats.debt += (mods.debt || 0);
      this.clampStats();
    }

    getPortfolioValue() {
      return this.portfolio.reduce((sum, item) => sum + item.currentUnitValue * item.quantity, 0);
    }

    getMonthlyPassiveIncome() {
      return this.portfolio.reduce((sum, item) => sum + item.monthlyPassivePerUnit * item.quantity, 0);
    }

    getHighestRealEstateTier() {
      let maxTier = 0;
      for (const item of this.portfolio) {
        if (item.category === "real_estate" && item.tier > maxTier) {
          maxTier = item.tier;
        }
      }
      return maxTier;
    }

    getNetWorth() {
      return this.stats.cash + (this.stats.trustFund || 0) + this.getPortfolioValue() - this.stats.debt;
    }

    addLog(message, kind = "normal") {
      this.lifeLog.push({ text: message, kind });
      if (this.lifeLog.length > 220) {
        this.lifeLog.shift();
      }
    }

    initFamilyForNewLife() {
      this.relationships = [];
      const surname = (this.stats.characterName || "Nguyễn").split(" ")[0];

      if (this.stats.backgroundId !== "bg_orphan") {
        this.relationships.push({
          npcId: "npc_father",
          fullName: generateVietnameseName("Nam", surname),
          role: "Cha",
          age: randInt(26, 34),
          closeness: this.stats.parentRelationship,
          isAlive: true
        });
        this.relationships.push({
          npcId: "npc_mother",
          fullName: generateVietnameseName("Nữ"),
          role: "Mẹ",
          age: randInt(24, 31),
          closeness: Math.min(100, this.stats.parentRelationship + 5),
          isAlive: true
        });
      }

      this.relationships.push({
        npcId: "npc_bestfriend",
        fullName: generateVietnameseName(Math.random() > 0.5 ? "Nam" : "Nữ"),
        role: "Bạn thân",
        age: this.stats.age,
        closeness: 72,
        isAlive: true
      });
    }

    openNewLifeModal() {
      el("input-char-name").value = generateVietnameseName(this.selectedGender);
      const list = el("backgrounds-list");
      list.innerHTML = "";

      (DATA.backgrounds || []).forEach((bg) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "bg-card" + (bg.backgroundId === this.selectedBackgroundId ? " selected" : "");
        card.innerHTML = `
          <div class="bg-card-head">
            <span>${escapeHtml(bg.name)}</span>
            <span style="font-size:11px; color:#93c5fd;">${escapeHtml(bg.badge)}</span>
          </div>
          <div class="bg-card-sub">${escapeHtml(bg.subtitle)} • Khởi đầu: 0 đ • Quỹ tuổi 18: ${formatVND(bg.comingOfAgeGrant || 0)}</div>
          <div class="bg-card-desc">${escapeHtml(bg.description)}</div>
        `;
        card.addEventListener("click", () => {
          if (window.ZTBAudio) window.ZTBAudio.tap();
          this.selectedBackgroundId = bg.backgroundId;
          list.querySelectorAll(".bg-card").forEach((c) => c.classList.remove("selected"));
          card.classList.add("selected");
        });
        list.appendChild(card);
      });

      el("new-life-modal").classList.add("open");
    }

    startNewLife(name, gender, backgroundId, silentMode = false) {
      const bg = (DATA.backgrounds || []).find((b) => b.backgroundId === backgroundId) || DATA.backgrounds[1];
      this.stats = this.createBlankStats();
      this.stats.generation = 1;
      this.stats.characterName = name;
      this.stats.gender = gender;
      this.stats.health = randInt(82, 96);
      this.stats.intelligence = randInt(44, 72);
      this.stats.appearance = randInt(48, 82);
      this.stats.luck = randInt(35, 78);
      this.stats.charisma = randInt(40, 70);

      if (bg) {
        this.stats.backgroundId = bg.backgroundId;
        this.stats.backgroundName = bg.name;
        this.stats.cash = 0;
        this.stats.trustFund = 0;
        this.stats.pocketMoneyChild = bg.pocketMoneyChild || 0;
        this.stats.pocketMoneyTeen = bg.pocketMoneyTeen || 0;
        this.stats.comingOfAgeGrant = bg.comingOfAgeGrant || 0;
        this.stats.familyAllowancePerYear = bg.familyAllowancePerYear || 0;
        this.applyStatModifiers(bg.statBonuses);
      }

      this.portfolio = [];
      this.cashflowHistory = [];
      this.rivals = this.createInitialRivals();
      this.bestRank = this.rivals.length + 1;
      this.lifeLog = [];
      this.triggeredEvents = {};
      this.flags = {};
      this.achievements = {};
      this.queuedEvents = [];
      this.timeMachine = [];
      this.pendingEvent = null;
      this.activitiesLeft = MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = false;
      this.macroCycle = MACRO_CYCLES[1];

      if (bg && Array.isArray(bg.startingFlags)) {
        bg.startingFlags.forEach((f) => { this.flags[f] = true; });
      }

      this.initFamilyForNewLife();
      this.addLog(`👶 Đời thứ 1: ${this.stats.characterName} (${this.stats.gender}) chào đời — [${this.stats.backgroundName}].`, "milestone");

      if (!silentMode) {
        if (window.ZTBAudio) window.ZTBAudio.success();
        this.triggerYearEvent();
      }
      this.saveToStorage();
      this.renderAll();
    }

    captureSnapshot() {
      return JSON.stringify({
        stats: this.stats,
        portfolio: this.portfolio,
        relationships: this.relationships,
        cashflowHistory: this.cashflowHistory,
        rivals: this.rivals,
        bestRank: this.bestRank,
        lifeLog: this.lifeLog,
        triggeredEvents: this.triggeredEvents,
        flags: this.flags,
        achievements: this.achievements,
        queuedEvents: this.queuedEvents,
        macroCycleId: this.macroCycle.id,
        activitiesLeft: this.activitiesLeft,
        courseTakenThisYear: this.courseTakenThisYear
      });
    }

    restoreSnapshot(jsonStr) {
      const snap = JSON.parse(jsonStr);
      this.stats = snap.stats;
      if (!this.stats.lifeId) this.stats.lifeId = `life_${Date.now()}_${randInt(100, 999)}`;
      this.portfolio = snap.portfolio || [];
      this.relationships = snap.relationships || [];
      this.cashflowHistory = snap.cashflowHistory || [];
      this.rivals = (snap.rivals && snap.rivals.length > 0) ? snap.rivals : this.createInitialRivals();
      this.bestRank = typeof snap.bestRank === "number" ? snap.bestRank : (this.rivals.length + 1);
      this.lifeLog = snap.lifeLog || [];
      this.triggeredEvents = snap.triggeredEvents || {};
      this.flags = snap.flags || {};
      this.achievements = snap.achievements || {};
      this.queuedEvents = snap.queuedEvents || [];
      this.macroCycle = MACRO_CYCLES.find((m) => m.id === snap.macroCycleId) || MACRO_CYCLES[1];
      this.activitiesLeft = typeof snap.activitiesLeft === "number" ? snap.activitiesLeft : MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = !!snap.courseTakenThisYear;
      this.pendingEvent = null;
      el("event-sheet-backdrop").classList.remove("open");
      el("gameover-modal").classList.remove("open");
    }

    pushTimeMachine() {
      this.timeMachine.push(this.captureSnapshot());
      if (this.timeMachine.length > MAX_TIME_MACHINE) {
        this.timeMachine.shift();
      }
    }

    useTimeMachine() {
      if (this.timeMachine.length === 0) return;
      const snap = this.timeMachine.pop();
      this.restoreSnapshot(snap);
      if (window.ZTBAudio) window.ZTBAudio.success();
      if (window.Diorama3D) window.Diorama3D.triggerCelebration("happy");
      this.addLog(`⏪ Cỗ Máy Thời Gian: Quay lại năm ${this.stats.age} tuổi!`, "milestone");
      this.showToast(`⏪ Đã quay ngược về năm ${this.stats.age} tuổi!`);
      this.saveToStorage();
      this.renderAll();
    }

    ageUp() {
      if (!this.stats.isAlive || this.pendingEvent) return;

      this.pushTimeMachine();
      if (window.ZTBAudio) window.ZTBAudio.ageUp();

      this.stats.age += 1;
      this.activitiesLeft = MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = false;

      this.addLog(`📅 Năm ${this.stats.age} tuổi:`, "age-header");

      this.processAnnualCareer();
      this.processAnnualEconomy();
      this.processAnnualRelationships();
      this.processAnnualHealth();
      this.checkAchievements();

      if (!this.stats.isAlive) {
        const finalNet = this.getNetWorth();
        this.addLog(
          `🪦 ${this.stats.characterName} qua đời ở tuổi ${this.stats.age} (${this.stats.causeOfDeath}). Tổng di sản: ${formatVND(finalNet)}.`,
          "danger"
        );
        if (window.ZTBAudio) window.ZTBAudio.warning();
        if (window.Diorama3D) window.Diorama3D.triggerCelebration("sad");
        this.saveToStorage();
        this.renderAll();
        this.openGameOverModal();
        return;
      }

      this.triggerYearEvent();
      this.saveToStorage();
      this.renderAll();
    }

    processAnnualCareer() {
      if (!this.stats.currentCareerId) {
        if (this.stats.age < 6) this.stats.currentJob = "Trẻ nhỏ";
        else if (this.stats.age <= 18) this.stats.currentJob = `Học sinh (${this.stats.educationLevel})`;
        else if (!this.stats.isRetired) this.stats.currentJob = "Tự do / Tìm việc";
        return;
      }

      const career = (DATA.careers || []).find((c) => c.careerId === this.stats.currentCareerId);
      if (!career) return;

      this.stats.yearsInCurrentJob += 1;
      this.stats.stress += Math.max(0, career.annualStressDelta - Math.floor(this.stats.discipline / 20));
      this.stats.practicalSkills += 2;

      const perf = 0.72 + (this.stats.discipline + this.stats.intelligence) / 200;
      const raise = Math.round(this.stats.monthlyIncome * career.annualRaiseRate * perf);
      this.stats.monthlyIncome += raise;

      if (career.promotionCareerId && career.yearsForPromotion > 0 && this.stats.yearsInCurrentJob >= career.yearsForPromotion) {
        const nextJob = (DATA.careers || []).find((c) => c.careerId === career.promotionCareerId);
        if (nextJob && this.stats.intelligence >= nextJob.minIntelligence - 8 && this.stats.discipline >= nextJob.minDiscipline - 8) {
          this.stats.currentCareerId = nextJob.careerId;
          this.stats.currentJob = nextJob.title;
          this.stats.monthlyIncome = Math.max(Math.round(this.stats.monthlyIncome * 1.25), nextJob.monthlySalary);
          this.stats.yearsInCurrentJob = 0;
          this.stats.happiness += 12;
          this.stats.socialStatus += 10;
          this.addLog(`🚀 Thăng chức lên ${nextJob.title} (${formatVND(this.stats.monthlyIncome)}/tháng)!`, "milestone");
          this.showToast(`🚀 Thăng chức: ${nextJob.title}!`);
        }
      }

      if (this.stats.age >= 62 && !this.stats.isRetired && this.stats.age > career.maxAge) {
        const pension = Math.round(this.stats.monthlyIncome * 0.45);
        this.stats.currentCareerId = "";
        this.stats.isRetired = true;
        this.stats.currentJob = "Hưu trí an nhàn";
        this.stats.monthlyIncome = pension;
        this.stats.stress -= 25;
        this.addLog(`🍵 Nghỉ hưu ở tuổi ${this.stats.age} với lương hưu ${formatVND(pension)}/tháng.`, "normal");
      }

      this.clampStats();
    }

    recordCashflow(delta, category, title) {
      const rounded = Math.round(delta || 0);
      if (rounded === 0) return;
      this.cashflowHistory.push({
        age: this.stats.age,
        delta: rounded,
        category,
        title,
        balanceAfter: Math.round(this.stats.cash || 0)
      });
      if (this.cashflowHistory.length > 120) {
        this.cashflowHistory.shift();
      }
    }

    getPlayerRank(netWorth = this.getNetWorth()) {
      let higher = 0;
      for (const r of this.rivals) {
        if (r.netWorth > netWorth) higher += 1;
      }
      return higher + 1;
    }

    loadHallOfFame() {
      try {
        const raw = localStorage.getItem(HALL_OF_FAME_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }

    updateHallOfFame() {
      try {
        const list = this.loadHallOfFame();
        const net = Math.max(this.getNetWorth(), this.stats.peakNetWorth || 0);
        const entry = {
          lifeId: this.stats.lifeId,
          name: this.stats.characterName,
          generation: this.stats.generation,
          age: this.stats.age,
          isAlive: this.stats.isAlive,
          peakNetWorth: net,
          job: this.stats.currentJob
        };
        const idx = list.findIndex((x) => x.lifeId === entry.lifeId);
        if (idx >= 0) list[idx] = entry;
        else list.push(entry);

        list.sort((a, b) => b.peakNetWorth - a.peakNetWorth);
        localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(list.slice(0, 10)));
      } catch (_) {}
    }

    processAnnualEconomy() {
      // Chọn pha kinh tế vĩ mô
      const roll = Math.random();
      let acc = 0;
      for (const cyc of MACRO_CYCLES) {
        acc += cyc.weight;
        if (roll <= acc) {
          this.macroCycle = cyc;
          break;
        }
      }

      // Tiền tiêu vặt & Quỹ trưởng thành theo từng độ tuổi thực tế
      if (this.stats.age >= 6 && this.stats.age <= 11 && (this.stats.pocketMoneyChild || 0) > 0) {
        this.stats.cash += this.stats.pocketMoneyChild;
        this.recordCashflow(this.stats.pocketMoneyChild, "family", "Tiền tiêu vặt tuổi tiểu học");
        this.addLog(`🪙 Tiền tiêu vặt & quà ngoan ngoãn tuổi tiểu học: +${formatVND(this.stats.pocketMoneyChild)}.`);
      } else if (this.stats.age >= 12 && this.stats.age <= 17 && (this.stats.pocketMoneyTeen || 0) > 0) {
        this.stats.cash += this.stats.pocketMoneyTeen;
        this.recordCashflow(this.stats.pocketMoneyTeen, "family", "Tiền tiêu vặt học sinh");
        this.addLog(`🎒 Tiền tiêu vặt học sinh năm ${this.stats.age} tuổi: +${formatVND(this.stats.pocketMoneyTeen)}.`);
      } else if (this.stats.age === 18) {
        if ((this.stats.comingOfAgeGrant || 0) > 0) {
          this.stats.cash += this.stats.comingOfAgeGrant;
          this.recordCashflow(this.stats.comingOfAgeGrant, "family", "Quỹ hành trang tuổi 18");
          this.addLog(`🎁 Tròn 18 tuổi! Gia đình trao cho bạn khoản hành trang vào đời: +${formatVND(this.stats.comingOfAgeGrant)}.`, "milestone");
          this.showToast(`🎁 Quà tuổi 18 từ gia đình: +${formatVND(this.stats.comingOfAgeGrant)}!`);
        }
        if ((this.stats.trustFund || 0) > 0) {
          const unlocked = this.stats.trustFund;
          this.stats.cash += unlocked;
          this.stats.trustFund = 0;
          this.recordCashflow(unlocked, "family", "Mở khóa Quỹ Ủy Thác Thừa Kế");
          this.addLog(`🔓 Quỹ Ủy Thác Thừa Kế mở khóa khi bạn đủ 18 tuổi: +${formatVND(unlocked)}!`, "milestone");
        }
      }

      if (this.stats.age >= 18 && this.stats.age <= 21 && !this.stats.currentCareerId && (this.stats.familyAllowancePerYear || 0) > 0) {
        this.stats.cash += this.stats.familyAllowancePerYear;
        this.recordCashflow(this.stats.familyAllowancePerYear, "family", "Trợ cấp học tập từ gia đình");
      }

      // Tách dòng tiền thụ động dương & chi phí bảo dưỡng (xe/du thuyền)
      let posPassiveMonthly = 0;
      let negUpkeepMonthly = 0;
      for (const item of this.portfolio) {
        const line = item.monthlyPassivePerUnit * item.quantity;
        if (line >= 0) posPassiveMonthly += line;
        else negUpkeepMonthly += -line;
      }

      // Chỉ tính sinh hoạt phí tỉ lệ thuận khi thực sự có thu nhập; chưa đi làm/đang học = 0 đ để không tụt tiền vô lý
      const grossMonthlyInflow = this.stats.monthlyIncome + posPassiveMonthly;
      if (this.stats.age >= 18 && grossMonthlyInflow > 0) {
        const rawLiving = Math.round(this.stats.monthlyIncome * 0.28 + posPassiveMonthly * 0.12) + this.stats.childrenCount * 1_500_000;
        this.stats.monthlyExpense = Math.min(rawLiving, Math.round(grossMonthlyInflow * 0.65));
      } else {
        this.stats.monthlyExpense = 0;
      }

      if (this.stats.monthlyIncome > 0) {
        const annualSalary = this.stats.monthlyIncome * 12;
        this.stats.cash += annualSalary;
        this.recordCashflow(annualSalary, "salary", `Lương cả năm (${this.stats.currentJob})`);
      }

      if (posPassiveMonthly > 0) {
        const annualPassiveIn = posPassiveMonthly * 12;
        this.stats.cash += annualPassiveIn;
        this.recordCashflow(annualPassiveIn, "passive", "Thu nhập thụ động BĐS, Cổ tức & KD");
      }

      if (this.stats.monthlyExpense > 0) {
        const annualLiving = this.stats.monthlyExpense * 12;
        this.stats.cash -= annualLiving;
        this.recordCashflow(-annualLiving, "living", "Chi phí sinh hoạt cả năm");
      }

      if (negUpkeepMonthly > 0) {
        const annualUpkeep = negUpkeepMonthly * 12;
        this.stats.cash -= annualUpkeep;
        this.recordCashflow(-annualUpkeep, "upkeep", "Bảo dưỡng Xe & Du thuyền");
      }

      for (const item of this.portfolio) {
        const def = (DATA.assets || []).find((a) => a.assetId === item.assetId);
        const baseRate = def ? def.annualAppreciationRate : 0.06;
        const vol = def ? def.volatility : 0.05;
        const skillEdge = (this.stats.financialLiteracy + this.stats.businessAcuity) * 0.0004;
        const swing = (Math.random() * 2 - 1) * vol;
        const effective = baseRate >= 0
          ? (baseRate * this.macroCycle.mult + swing + skillEdge)
          : (baseRate + swing * 0.5);

        item.currentUnitValue = Math.max(1_000_000, Math.round(item.currentUnitValue * (1 + effective)));
      }

      if (this.stats.debt > 0) {
        const interest = Math.round(this.stats.debt * ANNUAL_LOAN_RATE);
        if (this.stats.cash >= interest) {
          this.stats.cash -= interest;
          this.recordCashflow(-interest, "bank", "Trả lãi vay ngân hàng (8.5%)");
        } else {
          const paidCash = this.stats.cash;
          this.stats.debt += (interest - paidCash);
          this.stats.cash = 0;
          if (paidCash > 0) {
            this.recordCashflow(-paidCash, "bank", "Trả một phần lãi vay ngân hàng");
          }
          this.stats.stress += 10;
          this.addLog(`⚠️ Lãi vay dồn vào nợ gốc! Tổng nợ: ${formatVND(this.stats.debt)}.`, "danger");
        }
      }

      this.clampStats();
      const net = this.getNetWorth();
      if (net > this.stats.peakNetWorth) {
        this.stats.peakNetWorth = net;
      }

      // Cập nhật tài sản các Đại gia trên Bảng Phú Hào
      if (this.rivals.length === 0) this.rivals = this.createInitialRivals();
      for (const rival of this.rivals) {
        const growth = 0.04 * this.macroCycle.mult + (Math.random() * 0.08 - 0.03);
        rival.lastGrowthPct = Number((growth * 100).toFixed(1));
        rival.netWorth = Math.max(10_000_000, Math.round(rival.netWorth * (1 + growth)));
      }

      const rankNow = this.getPlayerRank(net);
      if (rankNow < this.bestRank && rankNow <= 18) {
        this.bestRank = rankNow;
        this.addLog(`🏆 Bứt phá Bảng Phú Hào: Vươn lên Hạng #${rankNow}!`, "milestone");
        this.showToast(`🏆 Vượt bậc trên Bảng Phú Hào: Hạng #${rankNow}!`);
      }
    }

    processAnnualRelationships() {
      // Đồng bộ nếu kết hôn hoặc sinh con qua Event
      if (this.stats.maritalStatus === "Đã kết hôn" && !this.relationships.some((r) => r.role === "Vợ/Chồng")) {
        const partnerGender = this.stats.gender === "Nam" ? "Nữ" : "Nam";
        const spouseName = generateVietnameseName(partnerGender);
        this.stats.spouseName = spouseName;
        this.relationships.push({
          npcId: "npc_spouse_evt",
          fullName: spouseName,
          role: "Vợ/Chồng",
          age: this.stats.age,
          closeness: 90,
          isAlive: true
        });
      }

      let childNpcs = this.relationships.filter((r) => r.role === "Con").length;
      const surname = (this.stats.characterName || "Nguyễn").split(" ")[0];
      while (childNpcs < this.stats.childrenCount) {
        childNpcs += 1;
        this.relationships.push({
          npcId: `npc_child_${childNpcs}`,
          fullName: generateVietnameseName(Math.random() > 0.5 ? "Nam" : "Nữ", surname),
          role: "Con",
          age: 0,
          closeness: 95,
          isAlive: true
        });
      }

      for (const npc of this.relationships) {
        if (!npc.isAlive) continue;
        npc.age += 1;
        if ((npc.role === "Cha" || npc.role === "Mẹ") && npc.age > 78 && Math.random() < 0.14) {
          npc.isAlive = false;
          this.stats.happiness -= 18;
          this.addLog(`🕯️ ${npc.role} (${npc.fullName}) qua đời ở tuổi ${npc.age}.`, "danger");
        }
      }

      this.clampStats();
    }

    processAnnualHealth() {
      if (this.stats.stress >= 85) {
        this.stats.health -= 6;
        this.stats.happiness -= 8;
        this.addLog("⚠️ Căng thẳng kéo dài đang bào mòn sức khỏe của bạn!", "danger");
      }

      if (this.stats.age > 50) {
        const decay = this.stats.age > 75 ? randInt(3, 8) : randInt(1, 4);
        this.stats.health -= decay;
      }

      if (this.stats.age >= 85 && Math.random() < (this.stats.age - 80) * 0.04) {
        this.stats.health = 0;
        this.stats.causeOfDeath = "Ra đi thanh thản ở tuổi đại thọ bên con cháu";
      }

      this.clampStats();
    }

    // Event Engine Parity
    getNumericField(field) {
      if (field === "netWorth") return this.getNetWorth();
      if (field === "money") return this.stats.cash;
      return typeof this.stats[field] === "number" ? this.stats[field] : 0;
    }

    compareNum(actual, op, target) {
      switch (op) {
        case "==": return actual === target;
        case ">=": return actual >= target;
        case "<=": return actual <= target;
        case ">": return actual > target;
        case "<": return actual < target;
        case "!=": return actual !== target;
        default: return true;
      }
    }

    checkConditions(conditions) {
      if (!conditions || conditions.length === 0) return true;
      for (const c of conditions) {
        const op = c.operatorType || c.operator || "==";
        if (c.field === "hasFlag") {
          if (!this.flags[c.stringValue]) return false;
        } else if (c.field === "notHasFlag") {
          if (this.flags[c.stringValue]) return false;
        } else if (c.field === "gender") {
          if (op === "!=" ? this.stats.gender === c.stringValue : this.stats.gender !== c.stringValue) return false;
        } else if (c.field === "educationLevel") {
          if (op === "!=" ? this.stats.educationLevel === c.stringValue : this.stats.educationLevel !== c.stringValue) return false;
        } else {
          const val = typeof c.numberValue === "number" ? c.numberValue : (c.value || 0);
          if (!this.compareNum(this.getNumericField(c.field), op, val)) return false;
        }
      }
      return true;
    }

    evaluateFormula(formula) {
      if (!formula) return true;
      const m = formula.trim().match(/^([a-zA-Z_]+)\s*(>=|<=|==|!=|>|<)\s*(-?\d+)$/);
      if (!m) return true;
      return this.compareNum(this.getNumericField(m[1]), m[2], parseInt(m[3], 10));
    }

    triggerYearEvent() {
      while (this.queuedEvents.length > 0) {
        const nextId = this.queuedEvents.shift();
        const chained = ALL_EVENTS.find((e) => e.eventId === nextId);
        if (chained) {
          this.presentEvent(chained);
          return;
        }
      }

      const eligible = ALL_EVENTS.filter((evt) => {
        const oneTime = evt.isOneTime !== false;
        const lastAge = this.triggeredEvents[evt.eventId];
        if (oneTime && lastAge !== undefined) return false;
        if (!oneTime && lastAge !== undefined && this.stats.age - lastAge < 3) return false;
        if (this.stats.age < evt.minAge || this.stats.age > evt.maxAge) return false;
        return this.checkConditions(evt.conditions);
      }).sort((a, b) => (b.priority || 50) - (a.priority || 50));

      if (eligible.length === 0) return;

      const topPrio = eligible[0].priority || 50;
      const pool = eligible.filter((e) => (e.priority || 50) >= topPrio - 12);
      const chosen = pool[randInt(0, pool.length - 1)];
      this.presentEvent(chosen);
    }

    presentEvent(evt) {
      this.triggeredEvents[evt.eventId] = this.stats.age;
      this.pendingEvent = evt;

      el("event-category-badge").textContent = (evt.category || "life").toUpperCase();
      el("event-title").textContent = evt.title;
      el("event-description").textContent = evt.description;

      const container = el("event-options-list");
      container.innerHTML = "";

      (evt.options || []).forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "event-option-btn";
        btn.textContent = opt.label;
        btn.addEventListener("click", () => this.resolveEventOption(opt));
        container.appendChild(btn);
      });

      el("event-sheet-backdrop").classList.add("open");
      this.renderHUD();
    }

    resolveEventOption(opt) {
      const outcomes = opt.outcomes || [];
      if (outcomes.length === 0) {
        this.pendingEvent = null;
        el("event-sheet-backdrop").classList.remove("open");
        this.renderAll();
        return;
      }

      const weights = outcomes.map((o) => {
        let w = Math.max(0.01, o.probability || 1.0);
        const formula = o.conditionFormula || o.condition;
        if (formula) {
          const passed = this.evaluateFormula(formula);
          w *= passed ? (1.25 + (this.stats.luck - 50) * 0.004) : 0.45;
        }
        return Math.max(0.01, w);
      });

      const totalW = weights.reduce((a, b) => a + b, 0);
      let roll = Math.random() * totalW;
      let chosen = outcomes[0];
      for (let i = 0; i < outcomes.length; i++) {
        roll -= weights[i];
        if (roll <= 0) {
          chosen = outcomes[i];
          break;
        }
      }

      const eventTitle = this.pendingEvent ? this.pendingEvent.title : "Sự kiện cuộc đời";
      this.applyStatModifiers(chosen.statModifiers);

      const mods = chosen.statModifiers || {};
      const cashDelta = (mods.cash || 0) + (mods.money || 0);
      if (cashDelta !== 0) {
        this.recordCashflow(cashDelta, "event", `Sự kiện: ${eventTitle}`);
      }

      if (chosen.educationSet && (EDU_RANKS[chosen.educationSet] || 0) >= (EDU_RANKS[this.stats.educationLevel] || 0)) {
        this.stats.educationLevel = chosen.educationSet;
        if (!this.stats.currentCareerId && this.stats.age >= 6 && this.stats.age <= 18) {
          this.stats.currentJob = `Học sinh (${this.stats.educationLevel})`;
        }
      }
      if (chosen.maritalStatusSet) {
        this.stats.maritalStatus = chosen.maritalStatusSet;
      }
      if (chosen.childrenDelta > 0) {
        this.stats.childrenCount += chosen.childrenDelta;
      }
      if (Array.isArray(chosen.unlockedFlags)) {
        chosen.unlockedFlags.forEach((f) => { this.flags[f] = true; });
      }
      if (chosen.nextEventId) {
        this.queuedEvents.push(chosen.nextEventId);
      }

      this.pendingEvent = null;
      el("event-sheet-backdrop").classList.remove("open");

      const isPositive = cashDelta >= 0 && (mods.happiness || 0) >= 0;

      if (window.ZTBAudio) {
        if (cashDelta > 0) window.ZTBAudio.coin();
        else if (isPositive) window.ZTBAudio.success();
        else window.ZTBAudio.warning();
      }
      if (window.Diorama3D) {
        window.Diorama3D.triggerCelebration(cashDelta > 0 ? "coin" : (isPositive ? "happy" : "sad"));
      }

      this.addLog(`👉 ${opt.label} ➔ ${chosen.message}`, isPositive ? "normal" : "danger");
      this.showToast(chosen.message);
      this.checkAchievements();
      this.saveToStorage();
      this.renderAll();
    }

    performActivity(actId) {
      if (!this.stats.isAlive || this.stats.age < 6 || this.activitiesLeft <= 0) return;

      let msg = "";
      if (actId === "exercise") {
        this.stats.health += 6;
        this.stats.appearance += 3;
        this.stats.stress -= 8;
        msg = "🏃 Chạy bộ & Gym (+6 Khỏe, +3 Ngoại hình, -8 Lo âu).";
      } else if (actId === "read") {
        this.stats.intelligence += 4;
        this.stats.financialLiteracy += 5;
        this.stats.businessAcuity += 3;
        msg = "📚 Đọc sách kinh doanh (+4 Trí tuệ, +5 Tài chính, +3 Kinh doanh).";
      } else if (actId === "meditate") {
        this.stats.stress -= 16;
        this.stats.happiness += 8;
        this.stats.karma += 3;
        msg = "🧘 Thiền định chữa lành (-16 Lo âu, +8 Hạnh phúc, +3 Phúc đức).";
      } else if (actId === "sidehustle") {
        if (this.stats.age < 15) {
          this.showToast("Cần đủ 15 tuổi để nhận việc làm thêm ngoài giờ.");
          return;
        }
        const earned = 2_000_000 + (this.stats.practicalSkills + this.stats.intelligence) * 120_000;
        this.stats.cash += earned;
        this.recordCashflow(earned, "salary", "Làm dự án tự do ngoài giờ");
        this.stats.practicalSkills += 4;
        this.stats.stress += 7;
        msg = `💻 Làm dự án tự do ngoài giờ (+${formatVND(earned)}).`;
      } else if (actId === "socialize") {
        this.stats.charisma += 5;
        this.stats.socialStatus += 3;
        this.stats.happiness += 5;
        msg = "🤝 Mở rộng mạng lưới quan hệ (+5 Giao tiếp, +3 Địa vị).";
      }

      this.activitiesLeft -= 1;
      this.clampStats();
      this.addLog(msg);
      this.showToast(msg);
      if (window.ZTBAudio) window.ZTBAudio.tap();
      if (window.Diorama3D && actId === "sidehustle") window.Diorama3D.triggerCelebration("coin");
      this.saveToStorage();
      this.renderAll();
    }

    takeCourse(course) {
      if (this.courseTakenThisYear) {
        this.showToast("Bạn đã học 1 khóa nâng cấp trong năm nay rồi!");
        return;
      }
      if (this.stats.age < course.minAge) {
        this.showToast(`Cần đủ ${course.minAge} tuổi để đăng ký.`);
        return;
      }
      if (this.stats.cash < course.cost) {
        this.showToast(`Cần ${formatVND(course.cost)} học phí.`);
        return;
      }

      this.stats.cash -= course.cost;
      this.recordCashflow(-course.cost, "education", `Học phí: ${course.title}`);
      this.courseTakenThisYear = true;
      if (course.setEdu && (EDU_RANKS[course.setEdu] || 0) > (EDU_RANKS[this.stats.educationLevel] || 0)) {
        this.stats.educationLevel = course.setEdu;
      }
      this.applyStatModifiers(course.mods);
      this.addLog(`🎓 Hoàn thành [${course.title}].`, "milestone");
      this.showToast(`🎓 Đã hoàn thành ${course.title}!`);
      if (window.ZTBAudio) window.ZTBAudio.success();
      this.saveToStorage();
      this.renderAll();
    }

    applyForCareer(career) {
      if (this.stats.age < career.minAge || this.stats.age > career.maxAge) {
        this.showToast(`Độ tuổi yêu cầu: ${career.minAge} - ${career.maxAge}`);
        return;
      }
      if ((EDU_RANKS[this.stats.educationLevel] || 0) < (EDU_RANKS[career.requiredEducation] || 0)) {
        this.showToast(`Cần bằng cấp tối thiểu: ${career.requiredEducation}`);
        return;
      }
      if (this.stats.intelligence < career.minIntelligence || this.stats.discipline < career.minDiscipline || this.stats.charisma < career.minCharisma) {
        this.showToast(`Chưa đạt ngưỡng Trí tuệ ${career.minIntelligence} / Kỷ luật ${career.minDiscipline} / Giao tiếp ${career.minCharisma}`);
        return;
      }

      const chance = clamp(
        0.62 + (this.stats.charisma - career.minCharisma) * 0.005 + (this.stats.intelligence - career.minIntelligence) * 0.004,
        0.4, 0.98
      );

      if (Math.random() <= chance) {
        this.stats.currentCareerId = career.careerId;
        this.stats.currentJob = career.title;
        this.stats.monthlyIncome = career.monthlySalary;
        this.stats.yearsInCurrentJob = 0;
        this.stats.isRetired = false;
        this.stats.happiness += 8;
        this.stats.socialStatus += 5;
        this.clampStats();
        this.achievements.ms_first_job = true;
        this.addLog(`💼 Trúng tuyển ${career.title} (${formatVND(career.monthlySalary)}/tháng)!`, "milestone");
        this.showToast(`💼 Trúng tuyển: ${career.title}!`);
        if (window.ZTBAudio) window.ZTBAudio.success();
        if (window.Diorama3D) window.Diorama3D.triggerCelebration("happy");
      } else {
        this.stats.stress += 5;
        this.clampStats();
        this.showToast("😓 Phỏng vấn chưa đạt, thử lại sau khi tăng chỉ số nhé!");
        if (window.ZTBAudio) window.ZTBAudio.warning();
      }
      this.saveToStorage();
      this.renderAll();
    }

    quitJob() {
      if (!this.stats.currentCareerId) return;
      this.addLog(`📄 Bạn đã nghỉ việc tại vị trí ${this.stats.currentJob}.`);
      this.stats.currentCareerId = "";
      this.stats.currentJob = "Tự do / Tìm việc";
      this.stats.monthlyIncome = 0;
      this.stats.yearsInCurrentJob = 0;
      this.showToast("📄 Đã nộp đơn xin nghỉ việc.");
      this.saveToStorage();
      this.renderAll();
    }

    buyAsset(def) {
      if (this.stats.age < 18) {
        this.showToast("Cần đủ 18 tuổi để đứng tên mua tài sản.");
        return;
      }
      if (this.stats.cash < def.cost) {
        this.showToast(`Không đủ tiền mặt! Cần ${formatVND(def.cost)}.`);
        return;
      }

      this.stats.cash -= def.cost;
      this.recordCashflow(-def.cost, "asset", `Mua: ${def.name}`);
      const existing = this.portfolio.find((p) => p.assetId === def.assetId);
      if (existing) {
        existing.quantity += 1;
        existing.totalInvestedCost += def.cost;
      } else {
        this.portfolio.push({
          assetId: def.assetId,
          name: def.name,
          category: def.category,
          tier: def.tier,
          quantity: 1,
          totalInvestedCost: def.cost,
          currentUnitValue: def.cost,
          monthlyPassivePerUnit: def.monthlyPassiveIncome
        });
      }

      this.stats.happiness += def.happinessBonus;
      this.stats.socialStatus += def.socialStatusBonus;
      this.stats.financialLiteracy += 3;
      this.clampStats();
      this.checkAchievements();

      this.addLog(`🏛️ Mua thành công [${def.name}] giá ${formatVND(def.cost)}.`, "milestone");
      this.showToast(`🏛️ Đã sở hữu: ${def.name}!`);
      if (window.ZTBAudio) window.ZTBAudio.coin();
      if (window.Diorama3D) window.Diorama3D.triggerCelebration("coin");
      this.saveToStorage();
      this.renderAll();
    }

    sellAsset(assetId) {
      const idx = this.portfolio.findIndex((p) => p.assetId === assetId);
      if (idx === -1) return;
      const item = this.portfolio[idx];
      const proceeds = item.currentUnitValue;
      const avgCost = Math.round(item.totalInvestedCost / item.quantity);
      const profit = proceeds - avgCost;

      this.stats.cash += proceeds;
      this.recordCashflow(proceeds, "asset", `Bán: ${item.name}`);
      item.totalInvestedCost -= avgCost;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.portfolio.splice(idx, 1);
      }

      this.stats.financialLiteracy += 2;
      this.clampStats();
      const pnl = profit >= 0 ? `Lãi +${formatVND(profit)}` : `Lỗ ${formatVND(profit)}`;
      this.addLog(`💰 Bán 1 [${item.name}] thu ${formatVND(proceeds)} (${pnl}).`);
      this.showToast(`💰 Đã bán thu ${formatVND(proceeds)} (${pnl})`);
      if (window.ZTBAudio) window.ZTBAudio.coin();
      this.saveToStorage();
      this.renderAll();
    }

    getMaxLoanLimit() {
      const base = Math.max(0, Math.floor(this.getNetWorth() / 2) + this.stats.monthlyIncome * 24);
      return Math.max(20_000_000, base);
    }

    borrowLoan(amount) {
      if (this.stats.age < 18) {
        this.showToast("Cần đủ 18 tuổi để vay ngân hàng.");
        return;
      }
      const maxLim = this.getMaxLoanLimit();
      if (this.stats.debt + amount > maxLim) {
        this.showToast(`Vượt hạn mức vay tối đa (${formatVND(maxLim)})!`);
        return;
      }
      if (amount <= 0) return;

      this.stats.cash += amount;
      this.stats.debt += amount;
      this.clampStats();
      this.recordCashflow(amount, "bank", "Vay vốn ngân hàng");
      this.addLog(`🏦 Vay vốn ngân hàng +${formatVND(amount)}.`);
      this.showToast(`🏦 Giải ngân thành công ${formatVND(amount)}!`);
      if (window.ZTBAudio) window.ZTBAudio.coin();
      this.saveToStorage();
      this.renderAll();
    }

    repayLoan(amount) {
      if (this.stats.debt <= 0) return;
      const pay = Math.min(amount, this.stats.cash, this.stats.debt);
      if (pay <= 0) {
        this.showToast("Không đủ tiền mặt để trả nợ.");
        return;
      }
      this.stats.cash -= pay;
      this.stats.debt -= pay;
      this.stats.stress -= 6;
      this.clampStats();
      this.recordCashflow(-pay, "bank", "Tất toán nợ ngân hàng");
      this.addLog(`✅ Tất toán nợ ngân hàng ${formatVND(pay)}.`);
      this.showToast(`✅ Đã trả nợ ${formatVND(pay)}!`);
      if (window.ZTBAudio) window.ZTBAudio.success();
      this.saveToStorage();
      this.renderAll();
    }

    interactNpc(npcId, mode) {
      const npc = this.relationships.find((r) => r.npcId === npcId && r.isAlive);
      if (!npc) return;

      if (mode === "chat") {
        npc.closeness = clamp(npc.closeness + 6, 0, 100);
        this.stats.happiness += 4;
        this.stats.charisma += 2;
        this.showToast(`☕ Tâm sự cùng ${npc.role} ${npc.fullName} (+6 thân thiết).`);
      } else if (mode === "gift") {
        if (this.stats.age < 12) {
          npc.closeness = clamp(npc.closeness + 10, 0, 100);
          this.stats.happiness += 5;
          this.stats.karma += 3;
          this.showToast(`🎨 Tự tay vẽ tranh & thiệp tặng ${npc.role} ${npc.fullName} (+10 thân thiết).`);
        } else {
          const cost = this.stats.age < 18 ? 100_000 : 2_000_000;
          if (this.stats.cash < cost) {
            this.showToast(`Cần ${formatVND(cost)} để mua quà.`);
            return;
          }
          this.stats.cash -= cost;
          this.recordCashflow(-cost, "social", `Quà tặng ${npc.fullName}`);
          npc.closeness = clamp(npc.closeness + 14, 0, 100);
          this.stats.happiness += 6;
          this.stats.karma += 3;
          this.showToast(`🎁 Tặng quà cho ${npc.fullName} (+14 thân thiết).`);
        }
      }

      this.clampStats();
      if (window.ZTBAudio) window.ZTBAudio.tap();
      this.saveToStorage();
      this.renderAll();
    }

    startDating() {
      if (this.stats.age < 18) {
        this.showToast("Hãy đợi đủ 18 tuổi để hẹn hò nghiêm túc!");
        return;
      }
      if (this.relationships.some((r) => r.isAlive && (r.role === "Người yêu" || r.role === "Vợ/Chồng"))) {
        this.showToast("Bạn đã có người thương rồi!");
        return;
      }
      const partnerGender = this.stats.gender === "Nam" ? "Nữ" : "Nam";
      const partnerName = generateVietnameseName(partnerGender);
      this.relationships.push({
        npcId: `npc_partner_${Date.now()}`,
        fullName: partnerName,
        role: "Người yêu",
        age: Math.max(18, this.stats.age + randInt(-3, 2)),
        closeness: 76,
        isAlive: true
      });
      this.stats.maritalStatus = "Đang hẹn hò";
      this.stats.happiness += 12;
      this.clampStats();
      this.addLog(`💕 Bắt đầu hẹn hò cùng ${partnerName}.`, "milestone");
      this.showToast(`💕 Bạn đang hẹn hò cùng ${partnerName}!`);
      if (window.ZTBAudio) window.ZTBAudio.success();
      this.saveToStorage();
      this.renderAll();
    }

    proposeMarriage() {
      const partner = this.relationships.find((r) => r.isAlive && r.role === "Người yêu");
      if (!partner) return;
      if (partner.closeness < 75) {
        this.showToast(`Độ thân thiết cần >= 75 (hiện tại ${partner.closeness}).`);
        return;
      }
      if (this.stats.cash < 25_000_000) {
        this.showToast("Cần ít nhất 25 Triệu đ làm lễ cưới ấm cúng.");
        return;
      }
      this.stats.cash -= 25_000_000;
      this.recordCashflow(-25_000_000, "social", `Tổ chức lễ cưới với ${partner.fullName}`);
      partner.role = "Vợ/Chồng";
      partner.closeness = 95;
      this.stats.maritalStatus = "Đã kết hôn";
      this.stats.spouseName = partner.fullName;
      this.stats.happiness += 22;
      this.stats.socialStatus += 10;
      this.clampStats();
      this.addLog(`💍 Kết hôn hạnh phúc cùng ${partner.fullName}!`, "milestone");
      this.showToast(`💍 Chúc mừng hai bạn về chung một nhà!`);
      if (window.ZTBAudio) window.ZTBAudio.success();
      if (window.Diorama3D) window.Diorama3D.triggerCelebration("happy");
      this.saveToStorage();
      this.renderAll();
    }

    haveChild() {
      if (this.stats.maritalStatus !== "Đã kết hôn" || this.stats.age > 50 || this.stats.childrenCount >= 5) return;
      const surname = (this.stats.characterName || "Nguyễn").split(" ")[0];
      const childName = generateVietnameseName(Math.random() > 0.5 ? "Nam" : "Nữ", surname);
      this.stats.childrenCount += 1;
      this.relationships.push({
        npcId: `npc_child_${Date.now()}`,
        fullName: childName,
        role: "Con",
        age: 0,
        closeness: 95,
        isAlive: true
      });
      this.stats.happiness += 18;
      this.clampStats();
      this.addLog(`👶 Chào đón thiên thần nhỏ ${childName} chào đời!`, "milestone");
      this.showToast(`👶 Chúc mừng! Bé ${childName} đã chào đời!`);
      if (window.ZTBAudio) window.ZTBAudio.success();
      this.saveToStorage();
      this.renderAll();
    }

    inheritWithChild(child) {
      const hasTrust = !!this.flags.family_trust_protected;
      const hasElite = !!this.flags.heir_elite_trained;
      const ratio = hasTrust ? 1.0 : 0.85;
      const totalLegacyCash = (this.stats.cash || 0) + (this.stats.trustFund || 0);
      const inheritedCash = Math.round(totalLegacyCash * ratio);
      const inheritedDebt = this.stats.debt;
      const startAge = clamp(child.age, 0, 35);
      const startEdu = startAge >= 22 ? "Đại học" : (startAge >= 18 ? "THPT" : (startAge >= 15 ? "THCS" : (startAge >= 6 ? "Tiểu học" : "Chưa đi học")));
      const childGender = (child.fullName.includes("Ngọc") || child.fullName.includes("Phương") || child.fullName.includes("Linh")) ? "Nữ" : "Nam";
      const isUnderAge = startAge < 18;

      const oldGen = this.stats.generation;
      const parentStats = this.stats;

      this.stats = this.createBlankStats();
      this.stats.generation = oldGen + 1;
      this.stats.backgroundId = inheritedCash >= 500_000_000 ? "bg_wealthy_dynasty" : "bg_working_class";
      this.stats.backgroundName = `Truyền nhân Đời thứ ${this.stats.generation}`;
      this.stats.characterName = child.fullName;
      this.stats.gender = childGender;
      this.stats.age = startAge;
      this.stats.cash = isUnderAge ? 0 : inheritedCash;
      this.stats.trustFund = isUnderAge ? inheritedCash : 0;
      this.stats.pocketMoneyChild = inheritedCash >= 500_000_000 ? 1_500_000 : 400_000;
      this.stats.pocketMoneyTeen = inheritedCash >= 500_000_000 ? 8_000_000 : 2_000_000;
      this.stats.comingOfAgeGrant = 0;
      this.stats.debt = inheritedDebt;
      this.stats.educationLevel = startEdu;
      this.stats.intelligence = clamp(Math.floor(parentStats.intelligence / 2) + randInt(25, 45) + (hasElite ? 15 : 0), 35, 98);
      this.stats.discipline = clamp(Math.floor(parentStats.discipline / 2) + randInt(20, 40), 35, 95);
      this.stats.financialLiteracy = clamp(Math.floor(parentStats.financialLiteracy / 2) + (hasElite ? 20 : 10), 15, 90);
      this.stats.businessAcuity = clamp(Math.floor(parentStats.businessAcuity / 2) + (hasElite ? 15 : 5), 15, 90);
      this.stats.karma = parentStats.karma;
      this.stats.socialStatus = clamp(Math.floor(parentStats.socialStatus / 2) + 15, 15, 90);

      this.triggeredEvents = {};
      this.flags = { dynasty_heir: true };
      this.queuedEvents = [];
      this.timeMachine = [];
      this.activitiesLeft = MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = false;
      this.achievements.ms_dynasty = true;

      this.initFamilyForNewLife();
      this.cashflowHistory = [];
      if (this.stats.cash > 0) {
        this.recordCashflow(this.stats.cash, "family", `Thừa kế tiền mặt đời thứ ${this.stats.generation}`);
      }
      this.bestRank = this.getPlayerRank();
      this.lifeLog = [];
      this.addLog(`👑 Đời thứ ${this.stats.generation}: ${this.stats.characterName} kế thừa gia tộc (${formatVND(this.getNetWorth())})!`, "milestone");

      el("gameover-modal").classList.remove("open");
      if (window.ZTBAudio) window.ZTBAudio.success();
      if (window.Diorama3D) window.Diorama3D.triggerCelebration("coin");
      this.saveToStorage();
      this.renderAll();
    }

    openGameOverModal() {
      this.updateHallOfFame();
      const net = this.getNetWorth();
      el("gameover-summary").innerHTML = `
        <strong>${escapeHtml(this.stats.characterName)}</strong> (Đời thứ ${this.stats.generation})<br/>
        • Hưởng thọ: <strong>${this.stats.age} tuổi</strong> — ${escapeHtml(this.stats.causeOfDeath)}<br/>
        • Nghề nghiệp cuối cùng: <strong>${escapeHtml(this.stats.currentJob)}</strong><br/>
        • Tài sản ròng đỉnh cao: <strong style="color:#fbbf24;">${formatVND(this.stats.peakNetWorth)}</strong><br/>
        • Di sản để lại (${this.flags.family_trust_protected ? "100% nhờ Quỹ tín thác" : "85% sau thuế thừa kế"}): <strong style="color:#34d399;">${formatVND(net)}</strong>
      `;

      const heirList = el("heir-selection-list");
      heirList.innerHTML = "";
      const children = this.relationships.filter((r) => r.isAlive && r.role === "Con");

      if (children.length === 0) {
        heirList.innerHTML = `<div class="item-meta">Không có người con kế thừa trong đời này. Hãy bắt đầu một gia tộc mới!</div>`;
      } else {
        children.forEach((child) => {
          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">👑 ${escapeHtml(child.fullName)} (${child.age} tuổi)</div>
              <div class="item-meta">Kế thừa bất động sản, doanh nghiệp &amp; ${this.flags.family_trust_protected ? "100%" : "85%"} tiền mặt</div>
            </div>
          `;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-sm btn-gold";
          btn.textContent = "Chơi đời con";
          btn.addEventListener("click", () => this.inheritWithChild(child));
          row.appendChild(btn);
          heirList.appendChild(row);
        });
      }

      el("gameover-modal").classList.add("open");
    }

    checkAchievements() {
      const net = this.getNetWorth();
      const checks = [
        ["ms_100m", net >= 100_000_000, "🏅 Chạm mốc 100 Triệu VNĐ!"],
        ["ms_1b", net >= 1_000_000_000, "🏆 Trở thành Tỷ phú VNĐ!"],
        ["ms_realestate", this.getHighestRealEstateTier() >= 2, "🏢 Sở hữu Bất động sản Cao cấp!"],
        ["ms_100b", net >= 100_000_000_000, "💎 Gia nhập CLB Đại gia Trăm Tỷ!"],
        ["ms_dynasty", this.stats.generation >= 2, "👑 Gia tộc Truyền đời!"],
        ["ms_longevity", this.stats.age >= 80 && this.stats.isAlive, "🍵 Sống thọ 80+ tuổi!"],
        ["ms_usd_billionaire", net >= USD_BILLION_VND, "🌍 HUYỀN THOẠI TỶ PHÚ ĐÔ LA!"]
      ];
      for (const [id, cond, toastMsg] of checks) {
        if (cond && !this.achievements[id]) {
          this.achievements[id] = true;
          this.addLog(toastMsg, "milestone");
          this.showToast(toastMsg);
        }
      }
      this.updateHallOfFame();
    }

    renderAll() {
      this.renderDiorama();
      this.renderHUD();
      this.renderCurrentTab();
    }

    renderDiorama() {
      const netWorth = this.getNetWorth();
      if (window.Diorama3D) {
        window.Diorama3D.updateState({
          age: this.stats.age,
          gender: this.stats.gender,
          netWorth,
          realEstateTier: this.getHighestRealEstateTier(),
          happiness: this.stats.happiness,
          stress: this.stats.stress,
          isAlive: this.stats.isAlive
        });
        el("room-tier-badge").textContent = window.Diorama3D.getRoomTierLabel();
      }
      el("generation-badge").textContent = `👑 Đời ${this.stats.generation} • ${this.stats.backgroundName}`;
      el("time-machine-count").textContent = String(this.timeMachine.length);
      el("btn-time-machine").disabled = this.timeMachine.length === 0;
    }

    renderHUD() {
      const s = this.stats;
      el("hud-name").textContent = `${s.characterName} (${s.gender})`;
      el("hud-job").textContent = s.currentJob;
      el("hud-macro").textContent = this.macroCycle.label;
      el("hud-rank").textContent = `🏆 #${this.getPlayerRank()}`;
      el("hud-age").textContent = `${s.age} Tuổi`;
      el("hud-cash").textContent = formatVND(s.cash);
      el("hud-networth").textContent = formatVND(this.getNetWorth());

      el("val-health").textContent = s.health;
      el("bar-health").style.width = `${s.health}%`;
      el("val-happiness").textContent = s.happiness;
      el("bar-happiness").style.width = `${s.happiness}%`;
      el("val-intelligence").textContent = s.intelligence;
      el("bar-intelligence").style.width = `${s.intelligence}%`;
      el("val-stress").textContent = s.stress;
      el("bar-stress").style.width = `${s.stress}%`;

      el("btn-age-up").disabled = !s.isAlive || !!this.pendingEvent;
    }

    renderCurrentTab() {
      if (this.activeTab === "life") this.renderLifeTab();
      else if (this.activeTab === "career") this.renderCareerTab();
      else if (this.activeTab === "assets") this.renderAssetsTab();
      else if (this.activeTab === "leaderboard") this.renderLeaderboardTab();
      else if (this.activeTab === "social") this.renderSocialTab();
      else if (this.activeTab === "profile") this.renderProfileTab();
    }

    renderLifeTab() {
      el("activities-remaining").textContent = `Còn ${this.activitiesLeft}/${MAX_ACTIVITIES_PER_YEAR} lượt`;
      const grid = el("activities-grid");
      grid.innerHTML = "";

      const activities = [
        { id: "exercise", title: "🏃 Tập thể thao", sub: "+6 Khỏe, -8 Lo âu", minAge: 6 },
        { id: "read", title: "📚 Đọc sách hay", sub: "+4 Trí tuệ, +5 Tài chính", minAge: 6 },
        { id: "meditate", title: "🧘 Thiền thư giãn", sub: "-16 Lo âu, +8 Hạnh phúc", minAge: 6 },
        { id: "sidehustle", title: "💻 Làm thêm", sub: "Kiếm tiền & kỹ năng (15+)", minAge: 15 },
        { id: "socialize", title: "🤝 Giao lưu bạn bè", sub: "+5 Giao tiếp, +3 Địa vị", minAge: 6 }
      ];

      activities.forEach((act) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "activity-btn";
        btn.disabled = !this.stats.isAlive || this.activitiesLeft <= 0 || this.stats.age < act.minAge;
        btn.innerHTML = `<strong>${act.title}</strong><span>${act.sub}</span>`;
        btn.addEventListener("click", () => this.performActivity(act.id));
        grid.appendChild(btn);
      });

      const timeline = el("life-timeline-list");
      timeline.innerHTML = "";
      for (let i = this.lifeLog.length - 1; i >= Math.max(0, this.lifeLog.length - 35); i--) {
        const item = this.lifeLog[i];
        const div = document.createElement("div");
        div.className = `log-entry ${item.kind || "normal"}`;
        div.textContent = item.text;
        timeline.appendChild(div);
      }
    }

    renderCareerTab() {
      const s = this.stats;
      const curCard = el("current-career-card");
      const monthlyNet = s.monthlyIncome + this.getMonthlyPassiveIncome() - s.monthlyExpense;

      curCard.innerHTML = `
        <div class="section-title">
          <span>🪪 Trạng thái Nghề nghiệp &amp; Học vấn</span>
          <span style="color:#93c5fd;">${escapeHtml(s.educationLevel)}</span>
        </div>
        <div class="item-title" style="font-size:14px;">${escapeHtml(s.currentJob)}</div>
        <div class="item-meta" style="margin-top:4px;">
          Thu nhập lương: <strong style="color:#34d399;">${formatVND(s.monthlyIncome)}/tháng</strong> •
          Chi tiêu: <strong style="color:#fca5a5;">${formatVND(s.monthlyExpense)}/tháng</strong><br/>
          Dòng tiền ròng (+thụ động): <strong style="color:${monthlyNet >= 0 ? "#34d399" : "#ef4444"};">${formatVND(monthlyNet)}/tháng</strong>
        </div>
      `;

      if (s.currentCareerId) {
        const quitBtn = document.createElement("button");
        quitBtn.type = "button";
        quitBtn.className = "btn-sm btn-danger";
        quitBtn.style.marginTop = "8px";
        quitBtn.textContent = "Xin nghỉ việc";
        quitBtn.addEventListener("click", () => this.quitJob());
        curCard.appendChild(quitBtn);
      }

      // Khóa học nâng cấp trình độ
      const coursesList = el("courses-list");
      coursesList.innerHTML = "";
      const courses = [
        { id: "c_hs", title: "Bổ túc Tốt nghiệp THPT", desc: "Mở khóa bằng THPT", minAge: 16, cost: 3_000_000, setEdu: "THPT", mods: { intelligence: 6 } },
        { id: "c_voc", title: "Khóa Kỹ năng Nghề Thực chiến", desc: "Cấp chứng chỉ Học nghề & +14 Kỹ năng", minAge: 17, cost: 8_000_000, setEdu: "Học nghề", mods: { practicalSkills: 14, discipline: 6 } },
        { id: "c_uni", title: "Cử nhân Đại học Tại chức / Số", desc: "Đạt trình độ Đại học & +10 Trí tuệ", minAge: 18, cost: 25_000_000, setEdu: "Đại học", mods: { intelligence: 10, socialStatus: 6 } },
        { id: "c_mba", title: "MBA Quản trị & Đầu tư Tài chính", desc: "+9 Kinh doanh, +9 Tài chính, +6 Giao tiếp", minAge: 22, cost: 60_000_000, setEdu: null, mods: { businessAcuity: 9, financialLiteracy: 9, charisma: 6 } }
      ];

      courses.forEach((c) => {
        const alreadyHigher = c.setEdu && (EDU_RANKS[s.educationLevel] || 0) >= (EDU_RANKS[c.setEdu] || 0);
        if (alreadyHigher) return;

        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
          <div class="item-info">
            <div class="item-title">${c.title}</div>
            <div class="item-meta">${c.desc} • Học phí: ${formatVND(c.cost)} (${c.minAge}+ tuổi)</div>
          </div>
        `;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-sm btn-primary";
        btn.textContent = "Đăng ký";
        btn.disabled = this.courseTakenThisYear || s.age < c.minAge || s.cash < c.cost;
        btn.addEventListener("click", () => this.takeCourse(c));
        row.appendChild(btn);
        coursesList.appendChild(row);
      });

      if (coursesList.children.length === 0) {
        coursesList.innerHTML = `<div class="item-meta">Bạn đã đạt cấp học cao nhất!</div>`;
      }

      // Danh sách nghề nghiệp
      const careersList = el("careers-list");
      careersList.innerHTML = "";
      (DATA.careers || []).forEach((career) => {
        const isCurrent = s.currentCareerId === career.careerId;
        const okAge = s.age >= career.minAge && s.age <= career.maxAge;
        const okEdu = (EDU_RANKS[s.educationLevel] || 0) >= (EDU_RANKS[career.requiredEducation] || 0);
        const okStats = s.intelligence >= career.minIntelligence && s.discipline >= career.minDiscipline && s.charisma >= career.minCharisma;
        const canApply = !isCurrent && s.isAlive && okAge && okEdu && okStats;

        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
          <div class="item-info">
            <div class="item-title">${escapeHtml(career.title)} <span style="font-size:10px; color:#60a5fa;">[${escapeHtml(career.sector)}]</span></div>
            <div class="item-meta">
              Lương: <strong style="color:#34d399;">${formatVND(career.monthlySalary)}/th</strong> •
              YC: ${career.requiredEducation}, Trí ≥${career.minIntelligence}, Kỷ luật ≥${career.minDiscipline}, Giao tiếp ≥${career.minCharisma}
            </div>
          </div>
        `;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = isCurrent ? "btn-sm btn-ghost" : (canApply ? "btn-sm btn-green" : "btn-sm btn-ghost");
        btn.textContent = isCurrent ? "Đang làm" : "Ứng tuyển";
        btn.disabled = !canApply;
        btn.addEventListener("click", () => this.applyForCareer(career));
        row.appendChild(btn);
        careersList.appendChild(row);
      });
    }

    renderAssetsTab() {
      const portVal = this.getPortfolioValue();
      const passive = this.getMonthlyPassiveIncome();
      const net = this.getNetWorth();

      el("finance-summary-card").innerHTML = `
        <div class="section-title">
          <span>📊 Bảng Cân đối Tài chính</span>
          <span>${this.macroCycle.label}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-tile"><span>Tiền mặt</span><strong style="color:#34d399;">${formatVND(this.stats.cash)}</strong></div>
          <div class="stat-tile"><span>Danh mục TS</span><strong style="color:#60a5fa;">${formatVND(portVal)}</strong></div>
          <div class="stat-tile"><span>Nợ Ngân hàng</span><strong style="color:#f87171;">${formatVND(this.stats.debt)}</strong></div>
          <div class="stat-tile"><span>Tài sản Ròng</span><strong style="color:#fbbf24;">${formatVND(net)}</strong></div>
        </div>
        ${(this.stats.trustFund || 0) > 0 ? `<div class="item-meta" style="margin-top:6px; color:#fde68a;">🔒 Quỹ Ủy Thác Thừa Kế (mở khóa lúc 18 tuổi): <strong>${formatVND(this.stats.trustFund)}</strong></div>` : ""}
        <div class="item-meta" style="margin-top:6px;">
          Thu nhập thụ động từ tài sản: <strong style="color:#34d399;">${formatVND(passive)}/tháng</strong>
        </div>
      `;

      this.renderCashflowLedger();

      // Quầy tín dụng ngân hàng
      const maxLoan = this.getMaxLoanLimit();
      const availLoan = Math.max(0, maxLoan - this.stats.debt);
      const bankCard = el("bank-desk-card");
      bankCard.innerHTML = `
        <div class="section-title">
          <span>🏦 Tín dụng Ngân hàng (8.5%/năm)</span>
          <span>Hạn mức còn: ${formatVND(availLoan)}</span>
        </div>
      `;
      const bankBtns = document.createElement("div");
      bankBtns.className = "bank-actions-grid";

      const loanActions = [
        { label: "Vay 50 Tr", fn: () => this.borrowLoan(50_000_000), cls: "btn-primary", disabled: availLoan < 50_000_000 || this.stats.age < 18 },
        { label: "Vay 500 Tr", fn: () => this.borrowLoan(500_000_000), cls: "btn-primary", disabled: availLoan < 500_000_000 || this.stats.age < 18 },
        { label: "Vay Tối đa", fn: () => this.borrowLoan(availLoan), cls: "btn-gold", disabled: availLoan <= 0 || this.stats.age < 18 },
        { label: "Trả 50% Nợ", fn: () => this.repayLoan(Math.ceil(this.stats.debt * 0.5)), cls: "btn-green", disabled: this.stats.debt <= 0 || this.stats.cash <= 0 },
        { label: "Trả Hết Nợ", fn: () => this.repayLoan(this.stats.debt), cls: "btn-green", disabled: this.stats.debt <= 0 || this.stats.cash <= 0 }
      ];

      loanActions.forEach((la) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `btn-sm ${la.cls}`;
        b.textContent = la.label;
        b.disabled = la.disabled;
        b.addEventListener("click", la.fn);
        bankBtns.appendChild(b);
      });
      bankCard.appendChild(bankBtns);

      // Danh mục đang sở hữu
      const portList = el("portfolio-list");
      portList.innerHTML = "";
      if (this.portfolio.length === 0) {
        portList.innerHTML = `<div class="item-meta">Chưa có tài sản đầu tư nào. Hãy tích lũy vốn và mua tài sản đầu tiên!</div>`;
      } else {
        this.portfolio.forEach((item) => {
          const avgCost = item.totalInvestedCost / item.quantity;
          const pct = avgCost > 0 ? (((item.currentUnitValue - avgCost) / avgCost) * 100).toFixed(1) : "0.0";
          const pctColor = Number(pct) >= 0 ? "#34d399" : "#f87171";

          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(item.name)} (x${item.quantity})</div>
              <div class="item-meta">
                Giá hiện tại: <strong>${formatVND(item.currentUnitValue)}</strong>
                (<span style="color:${pctColor};">${Number(pct) >= 0 ? "+" : ""}${pct}%</span>) •
                Dòng tiền: ${formatVND(item.monthlyPassivePerUnit)}/th
              </div>
            </div>
          `;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn-sm btn-gold";
          btn.textContent = "Bán 1";
          btn.addEventListener("click", () => this.sellAsset(item.assetId));
          row.appendChild(btn);
          portList.appendChild(row);
        });
      }

      // Bộ lọc & Sàn tài sản
      const filterBar = el("asset-filter-bar");
      filterBar.innerHTML = "";
      const cats = [
        { id: "all", label: "Tất cả" },
        { id: "real_estate", label: "🏠 Bất động sản" },
        { id: "investment", label: "📈 Đầu tư" },
        { id: "business", label: "🏭 Doanh nghiệp" },
        { id: "vehicle", label: "🚗 Xe & Du thuyền" }
      ];
      cats.forEach((c) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "filter-pill" + (this.assetFilter === c.id ? " active" : "");
        pill.textContent = c.label;
        pill.addEventListener("click", () => {
          this.assetFilter = c.id;
          this.renderAssetsTab();
        });
        filterBar.appendChild(pill);
      });

      const catList = el("asset-catalog-list");
      catList.innerHTML = "";
      (DATA.assets || [])
        .filter((a) => this.assetFilter === "all" || a.category === this.assetFilter)
        .forEach((def) => {
          const canBuy = this.stats.isAlive && this.stats.age >= 18 && this.stats.cash >= def.cost;
          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(def.name)}</div>
              <div class="item-meta">
                Giá: <strong style="color:#fbbf24;">${formatVND(def.cost)}</strong> •
                Thụ động: ${formatVND(def.monthlyPassiveIncome)}/th •
                Tăng trưởng TB: ${(def.annualAppreciationRate * 100).toFixed(1)}%/năm<br/>
                ${escapeHtml(def.description)}
              </div>
            </div>
          `;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = canBuy ? "btn-sm btn-green" : "btn-sm btn-ghost";
          btn.textContent = "Mua ngay";
          btn.disabled = !canBuy;
          btn.addEventListener("click", () => this.buyAsset(def));
          row.appendChild(btn);
          catList.appendChild(row);
        });
    }

    renderCashflowLedger() {
      const card = el("cashflow-ledger-card");
      if (!card) return;

      let yearIn = 0;
      let yearOut = 0;
      for (const item of this.cashflowHistory) {
        if (item.age === this.stats.age) {
          if (item.delta > 0) yearIn += item.delta;
          else yearOut += -item.delta;
        }
      }

      card.innerHTML = `
        <div class="section-title">
          <span>📒 Lịch Sử Dòng Tiền (Ra / Vào)</span>
          <span style="font-size:11px; color:#94a3b8;">${this.cashflowHistory.length} giao dịch</span>
        </div>
        <div class="stats-grid" style="margin-bottom:8px;">
          <div class="stat-tile"><span>Thu năm ${this.stats.age}t</span><strong style="color:#34d399;">+${formatVND(yearIn)}</strong></div>
          <div class="stat-tile"><span>Chi năm ${this.stats.age}t</span><strong style="color:#f87171;">-${formatVND(yearOut)}</strong></div>
        </div>
      `;

      const filters = document.createElement("div");
      filters.className = "filter-pills";
      [
        { id: "all", label: "Tất cả" },
        { id: "in", label: "🟢 Tiền vào" },
        { id: "out", label: "🔴 Tiền ra" }
      ].forEach((f) => {
        const p = document.createElement("button");
        p.type = "button";
        p.className = "filter-pill" + (this.ledgerFilter === f.id ? " active" : "");
        p.textContent = f.label;
        p.addEventListener("click", () => {
          this.ledgerFilter = f.id;
          this.renderCashflowLedger();
        });
        filters.appendChild(p);
      });
      card.appendChild(filters);

      const list = document.createElement("div");
      list.className = "ledger-scroll";

      const visible = this.cashflowHistory.filter((it) => {
        if (this.ledgerFilter === "in") return it.delta > 0;
        if (this.ledgerFilter === "out") return it.delta < 0;
        return true;
      });

      if (visible.length === 0) {
        list.innerHTML = `<div class="item-meta">Chưa có phát sinh thu/chi nào ở mục này.</div>`;
      } else {
        for (let i = visible.length - 1; i >= 0; i--) {
          const tx = visible[i];
          const isIn = tx.delta >= 0;
          const row = document.createElement("div");
          row.className = `ledger-row ${isIn ? "in" : "out"}`;
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title" style="font-size:12px;">[Tuổi ${tx.age}] ${escapeHtml(tx.title)}</div>
              <div class="item-meta">Số dư ví sau GD: <strong>${formatVND(tx.balanceAfter)}</strong></div>
            </div>
            <div class="ledger-amt ${isIn ? "in" : "out"}">${isIn ? "+" : "-"}${formatVND(Math.abs(tx.delta))}</div>
          `;
          list.appendChild(row);
        }
      }
      card.appendChild(list);
    }

    renderLeaderboardTab() {
      const playerNet = this.getNetWorth();
      if (this.rivals.length === 0) this.rivals = this.createInitialRivals();

      const combined = this.rivals.map((r) => ({
        isPlayer: false,
        name: r.name,
        title: r.title,
        avatar: r.avatar || "💼",
        netWorth: r.netWorth,
        lastGrowthPct: r.lastGrowthPct || 0
      }));

      combined.push({
        isPlayer: true,
        name: `${this.stats.characterName} (BẠN)`,
        title: `${this.stats.currentJob} • Đời ${this.stats.generation}`,
        avatar: "💎",
        netWorth: playerNet,
        lastGrowthPct: null
      });

      combined.sort((a, b) => b.netWorth - a.netWorth);
      const rankIdx = combined.findIndex((x) => x.isPlayer);
      const rank = rankIdx + 1;

      const hero = el("leaderboard-hero-card");
      if (rank === 1) {
        hero.innerHTML = `
          <div class="section-title"><span>👑 VỊ TRÍ HIỆN TẠI</span><span style="color:#fbbf24;">Hạng #1 / ${combined.length}</span></div>
          <div class="item-title" style="font-size:14px; color:#fde68a;">NGƯỜI GIÀU NHẤT HÀNH TINH!</div>
          <div class="item-meta">Tổng tài sản ròng của bạn đạt <strong>${formatVND(playerNet)}</strong>, đứng trên toàn bộ ${this.rivals.length} đại gia thế giới!</div>
        `;
      } else {
        const nextRival = combined[rankIdx - 1];
        const gap = Math.max(0, nextRival.netWorth - playerNet);
        const pct = nextRival.netWorth > 0 ? clamp((playerNet / nextRival.netWorth) * 100, 0, 100) : 100;
        hero.innerHTML = `
          <div class="section-title"><span>🏆 Thứ hạng Phú Hào</span><span style="color:#fbbf24;">Hạng #${rank} / ${combined.length}</span></div>
          <div class="item-meta" style="margin-bottom:6px;">
            Mục tiêu kế tiếp (#${rank - 1}): <strong>${escapeHtml(nextRival.name)}</strong> (${formatVND(nextRival.netWorth)})<br/>
            Cần thêm: <strong style="color:#34d399;">${formatVND(gap)}</strong> để vượt mặt!
          </div>
          <div class="progress-track" style="height:8px;">
            <div class="progress-fill fill-happy" style="width:${pct.toFixed(1)}%"></div>
          </div>
        `;
      }

      const listEl = el("leaderboard-list");
      listEl.innerHTML = "";
      combined.forEach((entry, idx) => {
        const pos = idx + 1;
        const medal = pos === 1 ? "🥇" : (pos === 2 ? "🥈" : (pos === 3 ? "🥉" : `#${pos}`));
        const row = document.createElement("div");
        row.className = "lb-row" + (entry.isPlayer ? " is-player" : "");

        const growthHtml = entry.lastGrowthPct === null
          ? `<span style="color:#34d399;">Đời ${this.stats.generation}</span>`
          : `<span style="color:${entry.lastGrowthPct >= 0 ? "#34d399" : "#f87171"};">${entry.lastGrowthPct >= 0 ? "+" : ""}${entry.lastGrowthPct}%/năm</span>`;

        row.innerHTML = `
          <div class="lb-left">
            <div class="lb-rank-badge">${medal}</div>
            <div class="lb-avatar">${entry.avatar}</div>
            <div class="item-info">
              <div class="item-title" style="font-size:12px;">${escapeHtml(entry.name)}</div>
              <div class="item-meta">${escapeHtml(entry.title)} • ${growthHtml}</div>
            </div>
          </div>
          <strong style="font-size:12px; color:#fbbf24; white-space:nowrap;">${formatVND(entry.netWorth)}</strong>
        `;
        listEl.appendChild(row);
      });

      const hofEl = el("hall-of-fame-list");
      const hof = this.loadHallOfFame();
      hofEl.innerHTML = "";
      if (hof.length === 0) {
        hofEl.innerHTML = `<div class="item-meta">Chưa có dữ liệu kỷ lục. Hãy tiếp tục phát triển sự nghiệp!</div>`;
      } else {
        hof.forEach((h, idx) => {
          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">#${idx + 1} ${escapeHtml(h.name)} (Đời ${h.generation}, ${h.age}t ${h.isAlive ? "🟢" : "🕯️"})</div>
              <div class="item-meta">${escapeHtml(h.job || "")}</div>
            </div>
            <strong style="font-size:12px; color:#34d399; white-space:nowrap;">${formatVND(h.peakNetWorth)}</strong>
          `;
          hofEl.appendChild(row);
        });
      }
    }

    renderSocialTab() {
      const hasTrust = !!this.flags.family_trust_protected;
      el("dynasty-banner").innerHTML = `
        <div class="section-title"><span>👑 Gia Phả &amp; Thừa Kế Truyền Đời</span><span>Đời ${this.stats.generation}</span></div>
        <div class="item-meta">
          Tình trạng: <strong>${escapeHtml(this.stats.maritalStatus)}</strong> • Số con: <strong>${this.stats.childrenCount}</strong><br/>
          Khi nhân vật qua đời, con cái sẽ kế thừa toàn bộ bất động sản và <strong>${hasTrust ? "100% (Nhờ Quỹ Tín thác)" : "85%"}</strong> tiền mặt.
        </div>
      `;

      const bar = el("social-actions-bar");
      bar.innerHTML = `<div class="section-title"><span>💞 Kết nối Tình cảm</span></div>`;
      const btnRow = document.createElement("div");
      btnRow.style.display = "flex";
      btnRow.style.gap = "8px";
      btnRow.style.flexWrap = "wrap";

      const hasPartner = this.relationships.some((r) => r.isAlive && (r.role === "Người yêu" || r.role === "Vợ/Chồng"));
      const datingPartner = this.relationships.find((r) => r.isAlive && r.role === "Người yêu");

      const dateBtn = document.createElement("button");
      dateBtn.type = "button";
      dateBtn.className = "btn-sm btn-primary";
      dateBtn.textContent = "💕 Tìm người hẹn hò";
      dateBtn.disabled = !this.stats.isAlive || this.stats.age < 18 || hasPartner;
      dateBtn.addEventListener("click", () => this.startDating());
      btnRow.appendChild(dateBtn);

      if (datingPartner) {
        const marryBtn = document.createElement("button");
        marryBtn.type = "button";
        marryBtn.className = "btn-sm btn-gold";
        marryBtn.textContent = "💍 Cầu hôn (25 Tr)";
        marryBtn.disabled = !this.stats.isAlive;
        marryBtn.addEventListener("click", () => this.proposeMarriage());
        btnRow.appendChild(marryBtn);
      }

      if (this.stats.maritalStatus === "Đã kết hôn") {
        const kidBtn = document.createElement("button");
        kidBtn.type = "button";
        kidBtn.className = "btn-sm btn-green";
        kidBtn.textContent = "👶 Sinh con nối dõi";
        kidBtn.disabled = !this.stats.isAlive || this.stats.age > 50 || this.stats.childrenCount >= 5;
        kidBtn.addEventListener("click", () => this.haveChild());
        btnRow.appendChild(kidBtn);
      }

      bar.appendChild(btnRow);

      const relList = el("relationships-list");
      relList.innerHTML = "";
      this.relationships.forEach((npc) => {
        const row = document.createElement("div");
        row.className = "item-row";
        row.innerHTML = `
          <div class="item-info">
            <div class="item-title">${escapeHtml(npc.fullName)} <span style="color:#93c5fd;">(${escapeHtml(npc.role)})</span></div>
            <div class="item-meta">
              ${npc.isAlive ? `${npc.age} tuổi • Thân thiết: <strong>${npc.closeness}/100</strong>` : "🕯️ Đã qua đời"}
            </div>
          </div>
        `;
        if (npc.isAlive && this.stats.isAlive) {
          const actions = document.createElement("div");
          actions.style.display = "flex";
          actions.style.gap = "5px";

          const chatBtn = document.createElement("button");
          chatBtn.type = "button";
          chatBtn.className = "btn-sm btn-ghost";
          chatBtn.textContent = "☕ Trò chuyện";
          chatBtn.addEventListener("click", () => this.interactNpc(npc.npcId, "chat"));

          const giftBtn = document.createElement("button");
          giftBtn.type = "button";
          giftBtn.className = "btn-sm btn-primary";
          giftBtn.textContent = this.stats.age < 12 ? "🎨 Tặng tranh" : (this.stats.age < 18 ? "🧋 Quà (100k)" : "🎁 Quà (2 Tr)");
          giftBtn.addEventListener("click", () => this.interactNpc(npc.npcId, "gift"));

          actions.appendChild(chatBtn);
          actions.appendChild(giftBtn);
          row.appendChild(actions);
        }
        relList.appendChild(row);
      });
    }

    renderProfileTab() {
      const net = this.getNetWorth();
      const pct = clamp((net / USD_BILLION_VND) * 100, 0, 100);
      el("billion-progress-fill").style.width = `${pct.toFixed(2)}%`;
      el("billion-progress-text").textContent = `${pct.toFixed(2)}%`;

      let rank = "🌱 Tay Trắng Khởi Nghiệp";
      if (net >= USD_BILLION_VND) rank = "🌍 HUYỀN THOẠI TỶ PHÚ ĐÔ LA ($1B+)";
      else if (net >= 100_000_000_000) rank = "👑 Đại Gia Trăm Tỷ Lừng Danh";
      else if (net >= 1_000_000_000) rank = "💎 Tỷ Phú Tiền Đồng (1+ Tỷ đ)";
      else if (net >= 100_000_000) rank = "🏅 Triệu Phú Tự Lập";
      else if (net >= 20_000_000) rank = "🌤️ Đủ Ăn Đủ Mặc";
      el("wealth-rank-label").textContent = `${rank} • Hiện tại: ${formatVND(net)}`;

      const s = this.stats;
      const statPairs = [
        ["❤️ Sức khỏe", s.health],
        ["😄 Hạnh phúc", s.happiness],
        ["🧠 Trí tuệ", s.intelligence],
        ["⚡ Áp lực", s.stress],
        ["✨ Ngoại hình", s.appearance],
        ["🛡️ Kỷ luật", s.discipline],
        ["💬 Giao tiếp", s.charisma],
        ["💹 Tài chính", s.financialLiteracy],
        ["🛠️ Kỹ năng nghề", s.practicalSkills],
        ["🏢 Kinh doanh", s.businessAcuity],
        ["🍀 May mắn", s.luck],
        ["🌟 Địa vị XH", s.socialStatus],
        ["🙏 Phúc đức", s.karma],
        ["👪 Hiếu thảo", s.parentRelationship]
      ];
      const grid = el("all-stats-grid");
      grid.innerHTML = statPairs.map(([label, val]) => `
        <div class="stat-tile"><span>${label}</span><strong>${val}/100</strong></div>
      `).join("");

      const achList = el("achievements-list");
      achList.innerHTML = ACHIEVEMENTS.map((a) => {
        const unlocked = !!this.achievements[a.id];
        return `
          <div class="item-row" style="opacity:${unlocked ? "1" : "0.45"};">
            <div class="item-info">
              <div class="item-title">${unlocked ? "✅" : "🔒"} ${a.title}</div>
              <div class="item-meta">${a.desc}</div>
            </div>
          </div>
        `;
      }).join("");
    }

    saveToStorage() {
      try {
        localStorage.setItem(SAVE_KEY, this.captureSnapshot());
      } catch (_) {}
    }

    loadFromStorage() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        this.restoreSnapshot(raw);
        return true;
      } catch (_) {
        return false;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const sim = new WebLifeSimulator();
    window.ZTBSim = sim;
    sim.init();
  });
})();
