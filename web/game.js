// Zero to Billionaire Simulator — Interactive Web Client Controller
(function () {
  const SAVE_KEY = "ztb_web_save_v2";
  const HALL_OF_FAME_KEY = "ztb_hall_of_fame_v1";
  const MONETIZATION_KEY = "ztb_monetization_v1";
  const USD_BILLION_VND = 25_000_000_000_000; // 25.000 Tỷ VNĐ (~ $1B)
  const MAX_ACTIVITIES_PER_YEAR = 2;
  const MAX_TIME_MACHINE = 5;
  const MAX_JOB_APPS_PER_YEAR = 2;
  const ANNUAL_LOAN_RATE = 0.145;

  const FAMILY_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
  const MALE_MIDDLE = ["Gia", "Minh", "Đức", "Quốc", "Tuấn", "Hoàng", "Thành"];
  const MALE_GIVEN = ["Huy", "Khang", "Bảo", "Phúc", "An", "Khoa", "Đạt", "Long", "Nam", "Việt"];
  const FEMALE_MIDDLE = ["Ngọc", "Phương", "Thanh", "Bảo", "Minh", "Khánh", "Thảo"];
  const FEMALE_GIVEN = ["Linh", "Anh", "Vy", "Châu", "Ngân", "Trang", "Mai", "Hà", "Nhi", "Tâm"];

  const AD_SPONSORS = [
    {
      title: "☕ Cà Phê Tỉnh Táo Startup 24/7",
      body: "Làm việc thông đêm, chốt deal triệu đô vẫn tràn đầy năng lượng. Nhận ngay hỗ trợ khởi đầu đời mới sau 5 giây!"
    },
    {
      title: "📱 Ví Siêu Tốc & Quản Lý Chi Tiêu AI",
      body: "Theo dõi từng đồng thu chi để không bao giờ cháy túi cuối tháng. Xem hết quảng cáo để mở khóa lượt chơi lại miễn phí!"
    },
    {
      title: "🏢 Học Viện Đầu Tư Thực Chiến VN30",
      body: "Trang bị tư duy tài chính vững vàng trước mọi biến cố kinh tế vĩ mô. Quà tặng may mắn đang chờ bạn!"
    }
  ];

  const PACK_DEFS = {
    starter: {
      id: "starter",
      title: "🎁 Gói Khởi Đầu Thuận Lợi",
      price: "19.000đ",
      perks: "• Nhận ngay +3 Vé Chơi Lại không cần xem quảng cáo<br/>• Hỗ trợ suốt 3 đời: +12 May mắn, +10 Sức khỏe, +4 Triệu đ Quỹ Tuổi 18<br/>• Mở rộng +2 ô Cỗ Máy Thời Gian (tổng 7 ô)"
    },
    vip: {
      id: "vip",
      title: "👑 Gói Tỷ Phú VIP Vĩnh Viễn",
      price: "49.000đ",
      perks: "• Mở khóa CHƠI LẠI VÔ HẠN trọn đời, không quảng cáo<br/>• Huy hiệu 👑 VIP nổi bật trên Bảng Xếp Hạng Người Chơi Thực<br/>• Hỗ trợ vĩnh viễn: +15 Trí tuệ, +15 May mắn, +8 Triệu đ Quỹ 18t &amp; 8 ô Cỗ Máy Thời Gian"
    }
  };

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
    { id: "Boom", label: "📈 Kinh tế Hưng thịnh", mult: 1.40, weight: 0.18 },
    { id: "Expansion", label: "🌤️ Tăng trưởng Ổn định", mult: 1.00, weight: 0.38 },
    { id: "Inflation", label: "🔥 Lạm phát Thắt chặt", mult: 0.70, weight: 0.24 },
    { id: "Recession", label: "🌧️ Suy thoái Phòng thủ", mult: -0.45, weight: 0.20 }
  ];

  const ASSET_GATES = {
    biz_coffee_cart: { maxQty: 3, minAcuity: 0 },
    biz_milktea_shop: { maxQty: 3, minAcuity: 35 },
    biz_software_studio: { maxQty: 3, minAcuity: 55 },
    biz_retail_chain: { maxQty: Infinity, minAcuity: 72 },
    biz_unicorn_conglomerate: { maxQty: Infinity, minAcuity: 85 }
  };

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
      this.jobAppsThisYear = 0;
      this.pendingEvent = null;
      this.timeMachine = [];

      // UI Navigation states
      this.activeTab = "life";
      this.previousTab = "life";
      this.careerSubTab = "jobs";
      this.onlyEligibleJobs = true;
      this.assetsSubTab = "market";
      this.assetFilter = "all";
      this.ledgerFilter = "all";
      this.leaderboardSubTab = "live";
      this.toastTimer = null;
      this.lastSavedLabel = "Vừa lưu";

      // Naming & Monetization states
      this.selectedGender = "Nam";
      this.selectedBackgroundId = (DATA.backgrounds[1] && DATA.backgrounds[1].backgroundId) || "bg_working_class";
      this.customNameDirty = false;
      this.renameMode = "player"; // "player" | "baby"
      this.pendingBabyGender = "Nam";
      this.selectedPayPack = null;
      this.adCountdownTimer = null;
      this.monetization = this.loadMonetization();
    }

    loadMonetization() {
      const defaults = {
        totalLivesStarted: 0,
        replayTickets: 0,
        starterLivesLeft: 0,
        adBonusPending: false,
        vipForever: false
      };
      try {
        const raw = localStorage.getItem(MONETIZATION_KEY);
        if (!raw) return defaults;
        return Object.assign(defaults, JSON.parse(raw));
      } catch (_) {
        return defaults;
      }
    }

    saveMonetization() {
      try {
        localStorage.setItem(MONETIZATION_KEY, JSON.stringify(this.monetization));
      } catch (_) {}
    }

    getMaxTimeMachineSlots() {
      if (this.monetization.vipForever) return 8;
      if ((this.monetization.starterLivesLeft || 0) > 0) return MAX_TIME_MACHINE + 2;
      return MAX_TIME_MACHINE;
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
        pocketMoneyChild: 80_000,
        pocketMoneyTeen: 400_000,
        comingOfAgeGrant: 3_500_000,
        familyAllowancePerYear: 1_500_000,
        peakNetWorth: 0,
        educationLevel: "Chưa đi học",
        currentCareerId: "",
        currentJob: "Trẻ nhỏ",
        yearsInCurrentJob: 0,
        isRetired: false,
        maritalStatus: "Độc thân",
        spouseName: "",
        childrenCount: 0,
        layoffCount: 0,
        debtOverdueYears: 0,
        bankruptcyCount: 0,
        creditFrozenYears: 0,
        careerCooldownYears: 0
      };
    }

    init() {
      if (window.Diorama3D) {
        window.Diorama3D.init("diorama-canvas");
      }

      if (window.ZTBLiveBoard) {
        window.ZTBLiveBoard.init({
          onUpdate: () => {
            this.renderHUD();
            if (this.activeTab === "leaderboard") {
              this.renderLeaderboardTab();
            }
          }
        });
      }

      this.bindStaticUI();

      window.addEventListener("beforeunload", () => this.saveToStorage());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.saveToStorage();
      });

      const loaded = this.loadFromStorage();
      if (loaded) {
        if ((this.monetization.totalLivesStarted || 0) === 0) {
          this.monetization.totalLivesStarted = 1;
          this.saveMonetization();
        }
        this.showToast(`📂 Chào mừng ${this.stats.characterName} trở lại!`);
        this.publishPlayerToLiveBoard(true);
        this.renderAll();
        if (!this.stats.isAlive) {
          this.openGameOverModal();
        }
      } else {
        this.startNewLife("Nguyễn Gia Huy", "Nam", this.selectedBackgroundId, true);
        this.openNewLifeModal(true);
      }
    }

    publishPlayerToLiveBoard(immediate = false) {
      if (!window.ZTBLiveBoard) return;
      window.ZTBLiveBoard.publishPlayerState({
        name: this.stats.characterName,
        age: this.stats.age,
        gen: this.stats.generation,
        job: this.stats.currentJob,
        netWorth: this.getNetWorth(),
        peakNetWorth: Math.max(this.stats.peakNetWorth || 0, this.getNetWorth()),
        vip: !!this.monetization.vipForever,
        alive: !!this.stats.isAlive
      }, immediate);
    }

    bindStaticUI() {
      // Bottom 5 Tabs
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
        this.leaderboardSubTab = "live";
        this.switchTab("leaderboard");
      });
      el("money-chip-cash").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.assetsSubTab = "ledger";
        this.switchTab("assets");
      });
      el("hud-bars-clickable").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.switchTab("profile");
      });
      el("btn-back-from-profile").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.switchTab(this.previousTab || "life");
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
      el("btn-new-life-top").addEventListener("click", () => this.requestNewLifeFlow());
      el("btn-open-shop-modal").addEventListener("click", () => this.openReplayGateModal(true));
      el("btn-open-save-modal").addEventListener("click", () => this.openSaveManageModal());

      // Career eligible filter & Live sync
      el("btn-filter-eligible-jobs").addEventListener("click", () => {
        this.onlyEligibleJobs = !this.onlyEligibleJobs;
        this.renderCareerTab();
      });
      el("btn-sync-leaderboard").addEventListener("click", () => {
        if (window.ZTBLiveBoard) {
          this.publishPlayerToLiveBoard(true);
          window.ZTBLiveBoard.forceSync();
        }
        this.showToast("🔄 Đang đồng bộ Bảng Xếp Hạng Người Chơi Thực...");
        this.renderLeaderboardTab();
      });

      // Rename Character / Name Baby Modal
      el("btn-rename-char").addEventListener("click", () => this.openRenameModal("player"));
      el("btn-random-rename").addEventListener("click", () => {
        const g = this.renameMode === "baby" ? this.pendingBabyGender : this.stats.gender;
        el("input-rename-char").value = generateVietnameseName(g);
      });
      el("btn-confirm-rename").addEventListener("click", () => this.confirmRenameModal());
      el("btn-cancel-rename").addEventListener("click", () => el("rename-modal").classList.remove("open"));

      // Save & Backup Modal
      el("btn-manual-save").addEventListener("click", () => {
        this.saveToStorage();
        this.publishPlayerToLiveBoard(true);
        if (window.ZTBAudio) window.ZTBAudio.coin();
        this.showToast("💾 Đã lưu tiến trình an toàn!");
        this.openSaveManageModal();
      });
      el("btn-open-profile-stats").addEventListener("click", () => {
        el("save-manage-modal").classList.remove("open");
        this.switchTab("profile");
      });
      el("btn-copy-save-code").addEventListener("click", () => this.exportSaveCodeToUI());
      el("btn-download-save-file").addEventListener("click", () => this.downloadSaveJson());
      el("btn-import-save-code").addEventListener("click", () => this.importSaveCodeFromUI());
      el("btn-new-life-profile").addEventListener("click", () => {
        el("save-manage-modal").classList.remove("open");
        this.requestNewLifeFlow();
      });
      el("btn-wipe-save").addEventListener("click", () => {
        localStorage.removeItem(SAVE_KEY);
        el("save-manage-modal").classList.remove("open");
        this.showToast("🗑️ Đã xóa dữ liệu lưu cũ!");
        this.requestNewLifeFlow();
      });
      el("btn-close-save-modal").addEventListener("click", () => el("save-manage-modal").classList.remove("open"));

      // New Life Modal (preserving user custom input!)
      el("input-char-name").addEventListener("input", () => {
        this.customNameDirty = true;
      });
      el("btn-random-name").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        el("input-char-name").value = generateVietnameseName(this.selectedGender);
        this.customNameDirty = true;
      });
      el("btn-gender-male").addEventListener("click", () => {
        this.selectedGender = "Nam";
        el("btn-gender-male").classList.add("active");
        el("btn-gender-female").classList.remove("active");
        el("input-char-name").placeholder = `Nhập tên nhân vật nam (VD: ${generateVietnameseName("Nam")})...`;
      });
      el("btn-gender-female").addEventListener("click", () => {
        this.selectedGender = "Nữ";
        el("btn-gender-female").classList.add("active");
        el("btn-gender-male").classList.remove("active");
        el("input-char-name").placeholder = `Nhập tên nhân vật nữ (VD: ${generateVietnameseName("Nữ")})...`;
      });

      el("btn-start-new-life").addEventListener("click", () => {
        const raw = el("input-char-name").value.trim();
        const chosenName = raw || generateVietnameseName(this.selectedGender);
        el("new-life-modal").classList.remove("open");

        if ((this.monetization.totalLivesStarted || 0) >= 1 && !this.monetization.vipForever) {
          if ((this.monetization.replayTickets || 0) > 0) {
            this.monetization.replayTickets -= 1;
            this.saveMonetization();
          }
        }
        this.monetization.totalLivesStarted = (this.monetization.totalLivesStarted || 0) + 1;
        this.saveMonetization();

        this.startNewLife(chosenName, this.selectedGender, this.selectedBackgroundId, false);
      });

      el("btn-close-new-life").addEventListener("click", () => {
        el("new-life-modal").classList.remove("open");
      });

      el("btn-gameover-new-life").addEventListener("click", () => {
        el("gameover-modal").classList.remove("open");
        this.requestNewLifeFlow();
      });

      // Replay Gate & Ad & Payment Modals
      el("btn-close-replay-gate").addEventListener("click", () => el("replay-gate-modal").classList.remove("open"));
      el("btn-watch-ad-replay").addEventListener("click", () => this.startRewardedAdFlow());
      el("btn-claim-ad-reward").addEventListener("click", () => this.claimRewardedAd());
      el("btn-buy-starter-pack").addEventListener("click", () => this.openPaymentSheet("starter"));
      el("btn-buy-vip-pack").addEventListener("click", () => this.openPaymentSheet("vip"));
      el("btn-confirm-payment").addEventListener("click", () => this.confirmPaymentPurchase());
      el("btn-cancel-payment").addEventListener("click", () => el("payment-sheet-modal").classList.remove("open"));
    }

    switchTab(tabId) {
      if (tabId === "profile" && this.activeTab !== "profile") {
        this.previousTab = this.activeTab;
      }
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

    // =====================================
    // MONETIZATION, REPLAY GATE & NAMING
    // =====================================
    requestNewLifeFlow() {
      const m = this.monetization;
      const freeFirst = (m.totalLivesStarted || 0) === 0;
      if (freeFirst || m.vipForever || (m.replayTickets || 0) > 0) {
        this.openNewLifeModal(freeFirst);
      } else {
        this.openReplayGateModal(false);
      }
    }

    openReplayGateModal(fromShopBtn = false) {
      const m = this.monetization;
      if (m.vipForever) {
        el("replay-ticket-badge").textContent = "👑 VIP Vô Hạn";
      } else {
        el("replay-ticket-badge").textContent = `🎫 ${m.replayTickets || 0} Vé`;
      }
      el("btn-buy-vip-pack").disabled = !!m.vipForever;
      el("btn-buy-vip-pack").textContent = m.vipForever ? "✅ Đã sở hữu VIP Vĩnh Viễn" : "👑 Nâng Cấp VIP Vĩnh Viễn (49.000đ)";
      el("btn-close-replay-gate").textContent = fromShopBtn ? "Đóng" : "Để sau";
      el("replay-gate-modal").classList.add("open");
    }

    startRewardedAdFlow() {
      el("replay-gate-modal").classList.remove("open");
      const ad = AD_SPONSORS[randInt(0, AD_SPONSORS.length - 1)];
      el("ad-sponsor-title").textContent = ad.title;
      el("ad-sponsor-body").textContent = ad.body;

      let left = 5;
      const claimBtn = el("btn-claim-ad-reward");
      const progressFill = el("ad-progress-fill");
      const label = el("ad-countdown-label");
      claimBtn.disabled = true;
      claimBtn.textContent = "⏳ Vui lòng xem hết quảng cáo...";
      label.textContent = `⏳ Còn ${left} giây...`;
      progressFill.style.width = "0%";

      if (this.adCountdownTimer) clearInterval(this.adCountdownTimer);
      el("rewarded-ad-modal").classList.add("open");

      this.adCountdownTimer = setInterval(() => {
        left -= 1;
        const pct = clamp(((5 - left) / 5) * 100, 0, 100);
        progressFill.style.width = `${pct}%`;
        if (left > 0) {
          label.textContent = `⏳ Còn ${left} giây...`;
        } else {
          clearInterval(this.adCountdownTimer);
          this.adCountdownTimer = null;
          label.textContent = "✅ Đã xem xong quảng cáo tài trợ!";
          claimBtn.disabled = false;
          claimBtn.textContent = "🎁 Nhận +1 Vé Chơi Lại & Quà Hỗ Trợ!";
        }
      }, 1000);
    }

    claimRewardedAd() {
      el("rewarded-ad-modal").classList.remove("open");
      this.monetization.replayTickets = (this.monetization.replayTickets || 0) + 1;
      this.monetization.adBonusPending = true;
      this.saveMonetization();
      if (window.ZTBAudio) window.ZTBAudio.coin();
      this.showToast("🎁 Đã nhận +1 Vé Chơi Lại & Quà May Mắn!");
      this.openNewLifeModal(false);
    }

    openPaymentSheet(packId) {
      const def = PACK_DEFS[packId];
      if (!def) return;
      this.selectedPayPack = packId;
      el("pay-pack-title").textContent = def.title;
      el("pay-pack-price").textContent = def.price;
      el("pay-pack-perks").innerHTML = def.perks;
      el("replay-gate-modal").classList.remove("open");
      el("payment-sheet-modal").classList.add("open");
    }

    confirmPaymentPurchase() {
      const packId = this.selectedPayPack;
      el("payment-sheet-modal").classList.remove("open");
      if (packId === "starter") {
        this.monetization.replayTickets = (this.monetization.replayTickets || 0) + 3;
        this.monetization.starterLivesLeft = (this.monetization.starterLivesLeft || 0) + 3;
        this.showToast("🎉 Mở khóa thành công Gói Khởi Đầu (+3 Vé Chơi Lại & Buff)!");
      } else if (packId === "vip") {
        this.monetization.vipForever = true;
        this.showToast("👑 Chúc mừng! Bạn đã trở thành Tỷ Phú VIP Vĩnh Viễn!");
      }
      this.saveMonetization();
      if (window.ZTBAudio) window.ZTBAudio.success();
      this.publishPlayerToLiveBoard(true);
      this.renderHUD();
      this.openNewLifeModal(false);
    }

    openRenameModal(mode = "player") {
      this.renameMode = mode;
      if (mode === "baby") {
        this.pendingBabyGender = Math.random() > 0.5 ? "Nam" : "Nữ";
        const surname = (this.stats.characterName || "Nguyễn").split(" ")[0];
        el("rename-modal-title").textContent = `👶 Đặt Tên Cho Con (${this.pendingBabyGender})`;
        el("input-rename-char").value = generateVietnameseName(this.pendingBabyGender, surname);
      } else {
        el("rename-modal-title").textContent = "✏️ Đặt Lại Tên Nhân Vật";
        el("input-rename-char").value = this.stats.characterName || "";
      }
      el("rename-modal").classList.add("open");
      setTimeout(() => el("input-rename-char").focus(), 40);
    }

    confirmRenameModal() {
      const val = el("input-rename-char").value.trim().slice(0, 30);
      if (!val) {
        this.showToast("Vui lòng nhập tên hợp lệ!");
        return;
      }
      el("rename-modal").classList.remove("open");
      if (this.renameMode === "baby") {
        this.finalizeHaveChild(val);
        return;
      }

      const oldName = this.stats.characterName;
      this.stats.characterName = val;
      this.addLog(`✍️ Đổi tên nhân vật từ "${oldName}" thành "${val}".`, "milestone");
      this.updateHallOfFame();
      this.saveToStorage();
      this.publishPlayerToLiveBoard(true);
      this.renderAll();
      this.showToast(`✍️ Đã đổi tên thành ${val}!`);
    }

    openSaveManageModal() {
      const net = formatVND(this.getNetWorth());
      el("save-status-detail").innerHTML = `
        Nhân vật hiện tại: <strong>${escapeHtml(this.stats.characterName)}</strong> (${this.stats.age} tuổi • ${net})<br/>
        Trạng thái lưu: <strong style="color:#34d399;">${escapeHtml(this.lastSavedLabel)}</strong>
      `;
      el("save-manage-modal").classList.add("open");
    }

    buildBackupCode() {
      const bundle = {
        v: 2,
        uid: window.ZTBLiveBoard ? window.ZTBLiveBoard.getPlayerId() : "",
        monetization: this.monetization,
        hof: this.loadHallOfFame(),
        snapshot: JSON.parse(this.captureSnapshot())
      };
      const json = JSON.stringify(bundle);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      return `ZTB2:${b64}`;
    }

    exportSaveCodeToUI() {
      try {
        const code = this.buildBackupCode();
        const box = el("input-save-code");
        box.value = code;
        box.focus();
        box.select();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).catch(() => {});
        }
        this.showToast("📋 Đã tạo & sao chép Mã Sao Lưu tiến trình!");
      } catch (_) {
        this.showToast("Không thể tạo mã sao lưu.");
      }
    }

    downloadSaveJson() {
      try {
        const code = this.buildBackupCode();
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ztb_save_${this.stats.age}t.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.showToast("⬇️ Đã tải file sao lưu tiến trình!");
      } catch (_) {}
    }

    importSaveCodeFromUI() {
      const raw = el("input-save-code").value.trim();
      if (!raw.startsWith("ZTB2:")) {
        this.showToast("⚠️ Mã sao lưu phải bắt đầu bằng ZTB2:");
        return;
      }
      try {
        const json = decodeURIComponent(escape(atob(raw.slice(5))));
        const bundle = JSON.parse(json);
        if (!bundle || !bundle.snapshot || !bundle.snapshot.stats) {
          throw new Error("Invalid backup payload");
        }
        if (bundle.uid && window.ZTBLiveBoard) {
          window.ZTBLiveBoard.setPlayerId(bundle.uid);
        }
        if (bundle.monetization) {
          this.monetization = Object.assign(this.loadMonetization(), bundle.monetization);
          this.saveMonetization();
        }
        if (Array.isArray(bundle.hof)) {
          localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(bundle.hof.slice(0, 10)));
        }
        this.restoreSnapshot(JSON.stringify(bundle.snapshot));
        this.saveToStorage();
        this.publishPlayerToLiveBoard(true);
        el("save-manage-modal").classList.remove("open");
        this.renderAll();
        this.showToast(`✅ Đã khôi phục tiến trình của ${this.stats.characterName}!`);
      } catch (_) {
        this.showToast("❌ Mã sao lưu không hợp lệ hoặc bị hỏng!");
      }
    }

    // =====================================
    // STATS, FAMILY & NEW LIFE
    // =====================================
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

      for (const k of ["layoffCount", "debtOverdueYears", "bankruptcyCount", "creditFrozenYears", "careerCooldownYears"]) {
        this.stats[k] = Math.max(0, Math.round(this.stats[k] || 0));
      }

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

    getMacroPassiveMultiplier(category, monthlyPassivePerUnit) {
      if ((monthlyPassivePerUnit || 0) <= 0) return 1.0;
      const macroId = this.macroCycle ? this.macroCycle.id : "Expansion";
      if (category === "business") {
        const table = { Boom: 1.25, Expansion: 1.0, Inflation: 0.78, Recession: -0.35 };
        return table[macroId] ?? 1.0;
      }
      if (category === "investment" || category === "real_estate") {
        const table = { Boom: 1.15, Expansion: 1.0, Inflation: 0.85, Recession: 0.50 };
        return table[macroId] ?? 1.0;
      }
      return 1.0;
    }

    getItemMacroMonthlyPassive(item) {
      return Math.round(item.monthlyPassivePerUnit * this.getMacroPassiveMultiplier(item.category, item.monthlyPassivePerUnit));
    }

    getMonthlyPassiveIncome() {
      return this.portfolio.reduce((sum, item) => sum + this.getItemMacroMonthlyPassive(item) * item.quantity, 0);
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

    openNewLifeModal(isFirstFree = false) {
      this.customNameDirty = false;
      const input = el("input-char-name");
      input.value = "";
      input.placeholder = `Nhập họ tên bạn muốn (VD: ${generateVietnameseName(this.selectedGender)})...`;

      const banner = el("new-life-booster-banner");
      const m = this.monetization;
      const boosts = [];
      if (m.vipForever) boosts.push("👑 VIP (+15 Trí, +15 May, +8Tr Quỹ 18t, 8 ô Quay Ngược)");
      else if ((m.starterLivesLeft || 0) > 0) boosts.push(`🎁 Gói Khởi Đầu (còn ${m.starterLivesLeft} đời: +12 May, +10 Khỏe, +4Tr Quỹ 18t)`);
      if (m.adBonusPending) boosts.push("🎬 Quà Quảng Cáo (+5 May, +1Tr Quỹ 18t)");

      if (boosts.length > 0) {
        banner.innerHTML = `✨ <strong>Hỗ trợ đang kích hoạt:</strong> ${boosts.join(" • ")}`;
        banner.classList.remove("hidden");
      } else if (isFirstFree) {
        banner.innerHTML = "🌱 <strong>Lượt chơi đầu tiên miễn phí!</strong> Tự đặt tên nhân vật hoặc bấm 🎲 để tạo ngẫu nhiên.";
        banner.classList.remove("hidden");
      } else {
        banner.classList.add("hidden");
      }

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
      setTimeout(() => input.focus(), 50);
    }

    startNewLife(name, gender, backgroundId, silentMode = false) {
      const bg = (DATA.backgrounds || []).find((b) => b.backgroundId === backgroundId) || DATA.backgrounds[1];
      this.stats = this.createBlankStats();
      this.stats.generation = 1;
      this.stats.characterName = name;
      this.stats.gender = gender;
      this.stats.health = randInt(82, 95);
      this.stats.intelligence = randInt(44, 70);
      this.stats.appearance = randInt(48, 82);
      this.stats.luck = randInt(35, 76);
      this.stats.charisma = randInt(40, 68);

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

      if (!silentMode) {
        const m = this.monetization;
        if (m.vipForever) {
          this.stats.intelligence += 15;
          this.stats.luck += 15;
          this.stats.comingOfAgeGrant += 8_000_000;
        } else if ((m.starterLivesLeft || 0) > 0) {
          this.stats.luck += 12;
          this.stats.health += 10;
          this.stats.comingOfAgeGrant += 4_000_000;
          m.starterLivesLeft -= 1;
        }
        if (m.adBonusPending) {
          this.stats.luck += 5;
          this.stats.comingOfAgeGrant += 1_000_000;
          m.adBonusPending = false;
        }
        this.saveMonetization();
      }

      this.clampStats();
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
      this.jobAppsThisYear = 0;
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
      this.publishPlayerToLiveBoard(true);
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
        courseTakenThisYear: this.courseTakenThisYear,
        jobAppsThisYear: this.jobAppsThisYear
      });
    }

    restoreSnapshot(jsonStr) {
      const snap = JSON.parse(jsonStr);
      this.stats = Object.assign(this.createBlankStats(), snap.stats || {});
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
      this.jobAppsThisYear = typeof snap.jobAppsThisYear === "number" ? snap.jobAppsThisYear : 0;
      this.pendingEvent = null;
      el("event-sheet-backdrop").classList.remove("open");
      el("gameover-modal").classList.remove("open");
    }

    pushTimeMachine() {
      this.timeMachine.push(this.captureSnapshot());
      const limit = this.getMaxTimeMachineSlots();
      while (this.timeMachine.length > limit) {
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
      this.publishPlayerToLiveBoard(true);
      this.renderAll();
    }

    rollMacroCycle() {
      const roll = Math.random();
      let acc = 0;
      this.macroCycle = MACRO_CYCLES[MACRO_CYCLES.length - 1];
      for (const cyc of MACRO_CYCLES) {
        acc += cyc.weight;
        if (roll <= acc) {
          this.macroCycle = cyc;
          break;
        }
      }
    }

    ageUp() {
      if (!this.stats.isAlive || this.pendingEvent) return;

      this.pushTimeMachine();
      if (window.ZTBAudio) window.ZTBAudio.ageUp();

      this.stats.age += 1;
      this.activitiesLeft = MAX_ACTIVITIES_PER_YEAR;
      this.courseTakenThisYear = false;
      this.jobAppsThisYear = 0;

      this.addLog(`📅 Năm ${this.stats.age} tuổi:`, "age-header");

      this.rollMacroCycle();
      const prevLayoffs = this.stats.layoffCount || 0;
      this.processAnnualCareer();
      const laidOffThisTurn = (this.stats.layoffCount || 0) > prevLayoffs;
      this.processAnnualEconomy({ skipCareerCooldownDecrement: laidOffThisTurn });
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
        this.publishPlayerToLiveBoard(true);
        this.renderAll();
        this.openGameOverModal();
        return;
      }

      this.triggerYearEvent();
      this.saveToStorage();
      this.publishPlayerToLiveBoard(false);
      this.renderAll();
    }

    processAnnualCareer() {
      if (!this.stats.isAlive) return;
      if (!this.stats.currentCareerId) {
        if (this.stats.age < 6) this.stats.currentJob = "Trẻ nhỏ";
        else if (this.stats.age <= 18) this.stats.currentJob = `Học sinh (${this.stats.educationLevel})`;
        else if (!this.stats.isRetired && (this.stats.careerCooldownYears || 0) <= 0) {
          this.stats.currentJob = "Tự do / Tìm việc";
        }
        return;
      }

      const career = (DATA.careers || []).find((c) => c.careerId === this.stats.currentCareerId);
      if (!career) return;

      this.stats.yearsInCurrentJob += 1;
      const isRetiringThisTurn = this.stats.age >= 62 && !this.stats.isRetired && this.stats.age > career.maxAge;

      if (!isRetiringThisTurn) {
        const baseLayoffByMacro = { Boom: 0.02, Expansion: 0.05, Inflation: 0.11, Recession: 0.24 };
        const baseLayoff = baseLayoffByMacro[this.macroCycle ? this.macroCycle.id : "Expansion"] ?? 0.05;
        const layoffChance = clamp(
          baseLayoff
          + (this.stats.stress >= 80 ? 0.10 : 0)
          + (this.stats.discipline < 45 ? 0.12 : 0)
          + (this.stats.health < 35 ? 0.08 : 0)
          - (this.stats.intelligence >= 75 && this.stats.discipline >= 70 ? 0.04 : 0),
          0.01,
          0.55
        );
        if (Math.random() < layoffChance) {
          const severance = (this.stats.discipline >= 40 && this.stats.yearsInCurrentJob >= 2)
            ? this.stats.monthlyIncome
            : 0;
          if (severance > 0) {
            this.stats.cash += severance;
            this.recordCashflow(severance, "salary", `Trợ cấp thôi việc (${career.title})`);
          }
          this.stats.currentCareerId = "";
          this.stats.currentJob = "Thất nghiệp (Bị sa thải)";
          this.stats.monthlyIncome = 0;
          this.stats.yearsInCurrentJob = 0;
          this.stats.layoffCount = (this.stats.layoffCount || 0) + 1;
          this.stats.careerCooldownYears = 1;
          this.stats.stress += 15;
          this.stats.happiness -= 18;
          this.stats.socialStatus -= 4;
          const sevText = severance > 0
            ? ` Nhận trợ cấp thôi việc ${formatVND(severance)}.`
            : " Không đủ điều kiện nhận trợ cấp.";
          this.addLog(`📉 Sa thải! Bạn mất việc ${career.title} trong bối cảnh ${this.macroCycle.label}.${sevText}`, "danger");
          this.showToast(`📉 Bị sa thải khỏi ${career.title}!`);
          if (window.ZTBAudio) window.ZTBAudio.warning();
          this.clampStats();
          return;
        }
      }

      this.stats.stress += Math.max(1, career.annualStressDelta - Math.floor(this.stats.discipline / 22));
      this.stats.practicalSkills += 2;

      const perf = 0.68 + (this.stats.discipline + this.stats.intelligence) / 210;
      const raise = Math.round(this.stats.monthlyIncome * career.annualRaiseRate * perf);
      this.stats.monthlyIncome += raise;

      if (career.promotionCareerId && career.yearsForPromotion > 0 && this.stats.yearsInCurrentJob >= career.yearsForPromotion) {
        const nextJob = (DATA.careers || []).find((c) => c.careerId === career.promotionCareerId);
        if (nextJob && this.stats.intelligence >= nextJob.minIntelligence - 5 && this.stats.discipline >= nextJob.minDiscipline - 5) {
          this.stats.currentCareerId = nextJob.careerId;
          this.stats.currentJob = nextJob.title;
          this.stats.monthlyIncome = Math.max(Math.round(this.stats.monthlyIncome * 1.22), nextJob.monthlySalary);
          this.stats.yearsInCurrentJob = 0;
          this.stats.happiness += 12;
          this.stats.socialStatus += 10;
          this.addLog(`🚀 Thăng chức lên ${nextJob.title} (${formatVND(this.stats.monthlyIncome)}/tháng)!`, "milestone");
          this.showToast(`🚀 Thăng chức: ${nextJob.title}!`);
        }
      }

      if (isRetiringThisTurn) {
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

    getLiveOrAiHudRank() {
      if (this.leaderboardSubTab === "ai" || !window.ZTBLiveBoard) {
        return { prefix: "🏆", rank: this.getPlayerRank() };
      }
      const snap = window.ZTBLiveBoard.getLeaderboardSnapshot();
      const idx = snap.entries.findIndex((e) => e.isPlayer);
      if (idx >= 0) {
        return { prefix: "🌐", rank: idx + 1 };
      }
      return { prefix: "🏆", rank: this.getPlayerRank() };
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

    processAnnualEconomy(opts = {}) {
      if (!this.stats.isAlive) return;

      this.stats.creditFrozenYears = Math.max(0, (this.stats.creditFrozenYears || 0) - 1);
      if (!opts.skipCareerCooldownDecrement) {
        this.stats.careerCooldownYears = Math.max(0, (this.stats.careerCooldownYears || 0) - 1);
      }

      // Tiền tiêu vặt & Quỹ trưởng thành theo độ tuổi
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

      const isHigherEdStudent = this.stats.educationLevel === "Đại học" || this.stats.educationLevel === "Học nghề";
      if (
        this.stats.age >= 19 &&
        this.stats.age <= 21 &&
        !this.stats.currentCareerId &&
        isHigherEdStudent &&
        this.stats.cash < 50_000_000 &&
        (this.stats.familyAllowancePerYear || 0) > 0
      ) {
        this.stats.cash += this.stats.familyAllowancePerYear;
        this.recordCashflow(this.stats.familyAllowancePerYear, "family", "Trợ cấp học tập từ gia đình");
      }

      // Tách dòng tiền thụ động dương & chi phí bảo dưỡng / lỗ vận hành theo chu kỳ vĩ mô
      let posPassiveMonthly = 0;
      let negUpkeepMonthly = 0;
      for (const item of this.portfolio) {
        const line = this.getItemMacroMonthlyPassive(item) * item.quantity;
        if (line >= 0) posPassiveMonthly += line;
        else negUpkeepMonthly += -line;
      }

      const grossMonthlyInflow = this.stats.monthlyIncome + posPassiveMonthly;
      if (this.stats.age >= 18) {
        const ownsHome = this.getHighestRealEstateTier() >= 1;
        const isCollegeDependent = this.stats.age <= 21 && !this.stats.currentCareerId && isHigherEdStudent;
        const baseFloor = isCollegeDependent
          ? (ownsHome ? 1_000_000 : 1_800_000) + this.stats.childrenCount * 2_500_000
          : (ownsHome ? 2_200_000 : 4_200_000) + this.stats.childrenCount * 2_800_000;

        if (grossMonthlyInflow > 0) {
          const baseRate = (ownsHome ? 0.34 : 0.42) + (this.macroCycle.id === "Inflation" ? 0.06 : 0);
          const rawLiving = Math.round(this.stats.monthlyIncome * baseRate + posPassiveMonthly * 0.22) + this.stats.childrenCount * 2_800_000;
          this.stats.monthlyExpense = Math.max(baseFloor, Math.min(Math.round(grossMonthlyInflow * 0.85), rawLiving));
        } else {
          this.stats.monthlyExpense = baseFloor;
        }
      } else {
        this.stats.monthlyExpense = 0;
      }

      const annualSalary = this.stats.monthlyIncome > 0 ? this.stats.monthlyIncome * 12 : 0;
      if (annualSalary > 0) {
        this.stats.cash += annualSalary;
        this.recordCashflow(annualSalary, "salary", `Lương cả năm (${this.stats.currentJob})`);
      }

      const annualPassiveIn = posPassiveMonthly > 0 ? posPassiveMonthly * 12 : 0;
      if (annualPassiveIn > 0) {
        this.stats.cash += annualPassiveIn;
        this.recordCashflow(annualPassiveIn, "passive", "Thu nhập thụ động BĐS, Cổ tức & KD");
      }

      if (this.stats.monthlyExpense > 0) {
        const annualLiving = this.stats.monthlyExpense * 12;
        this.stats.cash -= annualLiving;
        this.recordCashflow(-annualLiving, "living", "Thuê nhà & Sinh hoạt phí cả năm");
      }

      // Thuế Thu nhập Cá nhân & Bảo hiểm lũy tiến khi thu nhập năm > 180 Triệu đ
      let annualTax = 0;
      const annualGross = grossMonthlyInflow * 12;
      if (this.stats.age >= 18 && annualGross > 180_000_000) {
        let baseTaxRate = 0.10;
        if (annualGross > 2_400_000_000) baseTaxRate = 0.25;
        else if (annualGross > 600_000_000) baseTaxRate = 0.18;
        const literacyRelief = (this.stats.financialLiteracy || 0) * 0.0008;
        const effRate = Math.max(0.06, baseTaxRate - literacyRelief);
        annualTax = Math.round((annualGross - 150_000_000) * effRate);
        if (annualTax > 0) {
          this.stats.cash -= annualTax;
          this.recordCashflow(-annualTax, "tax", "Thuế TNCN & Bảo hiểm bắt buộc");
        }
      }

      if (negUpkeepMonthly > 0) {
        const annualUpkeep = negUpkeepMonthly * 12;
        this.stats.cash -= annualUpkeep;
        this.recordCashflow(-annualUpkeep, "upkeep", "Bảo dưỡng TS & Lỗ vận hành KD");
      }

      // Phí quản trị & bảo trì danh mục tài sản lớn (>= 1.5 Tỷ)
      const curPortVal = this.getPortfolioValue();
      if (this.stats.age >= 22 && this.getNetWorth() >= 1_500_000_000 && curPortVal > 0) {
        const assetFee = Math.round(curPortVal * 0.010);
        if (assetFee > 0) {
          this.stats.cash -= assetFee;
          this.recordCashflow(-assetFee, "upkeep", "Thuế & phí bảo trì tài sản (1.0%)");
        }
      }

      for (const item of this.portfolio) {
        const def = (DATA.assets || []).find((a) => a.assetId === item.assetId);
        const baseRate = def ? def.annualAppreciationRate : 0.06;
        const vol = def ? def.volatility : 0.05;
        const skillEdge = (this.stats.financialLiteracy + this.stats.businessAcuity) * 0.00012;
        const swing = (Math.random() * 2 - 1) * vol;
        const effective = baseRate >= 0
          ? (baseRate * this.macroCycle.mult + swing + skillEdge)
          : (baseRate + swing * 0.5);

        item.currentUnitValue = Math.max(1_000_000, Math.round(item.currentUnitValue * (1 + effective)));
      }

      // Pre-debt clamp: negative cash from living/tax/upkeep/assetFee spills into debt cleanly
      this.clampStats();

      // Lãi vay (14.5%) & theo dõi nợ quá hạn
      if (this.stats.debt > 0) {
        const interest = Math.round(this.stats.debt * ANNUAL_LOAN_RATE);
        const creditLimit = this.getMaxLoanLimit();
        const nwNow = this.getNetWorth();
        const delinquent = (
          this.stats.cash < interest ||
          (creditLimit > 0 && this.stats.debt > creditLimit * 1.1) ||
          nwNow < 0
        );
        this.stats.debtOverdueYears = delinquent
          ? (this.stats.debtOverdueYears || 0) + 1
          : Math.max(0, (this.stats.debtOverdueYears || 0) - 1);

        if (this.stats.cash >= interest) {
          this.stats.cash -= interest;
          this.recordCashflow(-interest, "bank", "Trả lãi vay ngân hàng (14.5%)");
        } else {
          const paidCash = Math.max(0, this.stats.cash);
          this.stats.debt += (interest - paidCash);
          this.stats.cash = 0;
          if (paidCash > 0) {
            this.recordCashflow(-paidCash, "bank", "Trả một phần lãi vay ngân hàng");
          }
          this.stats.stress += 10;
          this.addLog(`⚠️ Lãi vay (14.5%) dồn vào nợ gốc! Tổng nợ: ${formatVND(this.stats.debt)}.`, "danger");
        }
      } else {
        this.stats.debtOverdueYears = Math.max(0, (this.stats.debtOverdueYears || 0) - 1);
      }

      // Thu hồi nợ: Khấu trừ 30% thu nhập ròng dương
      if (this.stats.debtOverdueYears >= 1 && this.stats.debt > 0) {
        const annualNetPositiveInflow = Math.max(0, annualSalary + annualPassiveIn - annualTax);
        const garnishCap = Math.round(annualNetPositiveInflow * 0.30);
        const garnish = Math.min(this.stats.debt, this.stats.cash, garnishCap);
        if (garnish > 0) {
          this.stats.cash -= garnish;
          this.stats.debt -= garnish;
          this.recordCashflow(-garnish, "bank", "Thu hồi nợ: Khấu trừ 30% thu nhập");
          this.addLog(`⚖️ Ngân hàng cưỡng chế khấu trừ ${formatVND(garnish)} (30% thu nhập) trả nợ quá hạn!`, "danger");
        }
        this.stats.stress += 10;
        this.stats.socialStatus -= 3;
      }

      // Thu hồi nợ: Phát mãi danh mục tài sản ở mức 80% giá trị
      if (this.stats.debtOverdueYears >= 2 && this.stats.debt > this.stats.cash && this.portfolio.length > 0) {
        this.portfolio.sort((a, b) => b.currentUnitValue - a.currentUnitValue);
        let liqUnits = 0;
        let liqProceeds = 0;
        const liqNames = [];
        while (this.stats.debt > 0 && this.portfolio.length > 0) {
          const item = this.portfolio[0];
          const distressVal = Math.max(1, Math.round(item.currentUnitValue * 0.80));
          const avgCost = item.quantity > 0 ? Math.round(item.totalInvestedCost / item.quantity) : 0;
          item.totalInvestedCost = Math.max(0, item.totalInvestedCost - avgCost);
          item.quantity -= 1;
          if (item.quantity <= 0) this.portfolio.shift();

          const towardDebt = Math.min(this.stats.debt, distressVal);
          this.stats.debt -= towardDebt;
          const remCash = distressVal - towardDebt;
          if (remCash > 0) this.stats.cash += remCash;

          liqUnits += 1;
          liqProceeds += distressVal;
          if (liqNames.length < 3) liqNames.push(item.name);
          this.recordCashflow(distressVal, "bank", `Phát mãi tài sản (80%): ${item.name}`);
          if (towardDebt > 0) {
            this.recordCashflow(-towardDebt, "bank", `Thu hồi nợ từ phát mãi: ${item.name}`);
          }
        }
        if (liqUnits > 0) {
          this.stats.stress += 12;
          this.stats.socialStatus -= 6;
          this.stats.happiness -= 8;
          this.addLog(
            `🔨 Phát mãi tài sản! Ngân hàng thanh lý ${liqUnits} đơn vị (${liqNames.join(", ")}${liqUnits > 3 ? "..." : ""}) giá 80% thu ${formatVND(liqProceeds)} để trừ nợ!`,
            "danger"
          );
          this.showToast(`🔨 Bị phát mãi ${liqUnits} tài sản trả nợ!`);
        }
      }

      // Phá sản (ngay sau Thu hồi nợ)
      const nwBeforeBankruptcy = this.getNetWorth();
      if (
        this.stats.age >= 18 &&
        this.portfolio.length === 0 &&
        this.stats.cash <= 0 &&
        (
          (this.stats.debt >= 50_000_000 && this.stats.debtOverdueYears >= 3) ||
          (nwBeforeBankruptcy <= -150_000_000 && this.stats.debtOverdueYears >= 2)
        )
      ) {
        const wipedDebt = this.stats.debt;
        this.stats.bankruptcyCount = (this.stats.bankruptcyCount || 0) + 1;
        this.stats.debt = 0;
        this.stats.cash = 0;
        this.stats.debtOverdueYears = 0;
        this.stats.creditFrozenYears = 5;
        if (this.stats.monthlyIncome >= 35_000_000) {
          this.stats.currentCareerId = "";
          this.stats.currentJob = "Thất nghiệp (Phá sản)";
          this.stats.monthlyIncome = 0;
          this.stats.yearsInCurrentJob = 0;
          this.stats.careerCooldownYears = Math.max(this.stats.careerCooldownYears || 0, 2);
        }
        this.stats.socialStatus -= 30;
        this.stats.happiness -= 28;
        this.stats.stress += 22;
        this.stats.karma -= 8;
        this.addLog(
          `💥 PHÁ SẢN! Tòa tuyên bố mất khả năng thanh toán (${formatVND(wipedDebt)} nợ xấu). Tín dụng bị đóng băng 5 năm!`,
          "danger"
        );
        this.showToast("💥 PHÁ SẢN! Tín dụng bị đóng băng 5 năm!");
        if (window.ZTBAudio) window.ZTBAudio.warning();
        if (window.Diorama3D) window.Diorama3D.triggerCelebration("sad");
      }

      this.clampStats();
      const net = this.getNetWorth();
      if (net > this.stats.peakNetWorth) {
        this.stats.peakNetWorth = net;
      }

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
        this.stats.health -= 7;
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

    // =====================================
    // EVENT ENGINE PARITY
    // =====================================
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

      const expenseEvents = eligible.filter((e) => e.eventId.startsWith("exp_"));
      if (this.stats.age >= 19 && expenseEvents.length > 0 && Math.random() < 0.38) {
        const pickedExp = expenseEvents[randInt(0, expenseEvents.length - 1)];
        this.presentEvent(pickedExp);
        return;
      }

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
          w *= passed ? (1.15 + (this.stats.luck - 50) * 0.003) : 0.10;
        }
        return Math.max(0.001, w);
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
      this.publishPlayerToLiveBoard(false);
      this.renderAll();
    }

    // =====================================
    // ACTIVITIES, CAREERS, ASSETS & FAMILY
    // =====================================
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
        if (this.stats.age < 16) {
          this.showToast("Cần đủ 16 tuổi để nhận việc làm thêm ngoài giờ.");
          return;
        }
        const earned = Math.min(3_500_000, 550_000 + (this.stats.practicalSkills + this.stats.intelligence) * 18_000);
        this.stats.cash += earned;
        this.recordCashflow(earned, "salary", "Làm dự án tự do ngoài giờ");
        this.stats.practicalSkills += 4;
        this.stats.stress += 14;
        this.stats.health -= 4;
        msg = `💻 Làm dự án tự do ngoài giờ (+${formatVND(earned)}, +14 Lo âu, -4 Khỏe).`;
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
      if (this.jobAppsThisYear >= MAX_JOB_APPS_PER_YEAR) {
        this.showToast(`Bạn đã nộp ${MAX_JOB_APPS_PER_YEAR} hồ sơ trong năm nay, hãy chờ năm sau nhé!`);
        return;
      }
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

      this.jobAppsThisYear += 1;
      const cooldownPenalty = (this.stats.careerCooldownYears || 0) > 0 ? 0.18 : 0;
      const chance = clamp(
        0.55
        + (this.stats.charisma - career.minCharisma) * 0.005
        + (this.stats.intelligence - career.minIntelligence) * 0.004
        + (this.stats.luck - 50) * 0.002
        - cooldownPenalty,
        0.25,
        0.94
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
        this.stats.happiness -= 4;
        this.clampStats();
        this.showToast("😓 Phỏng vấn chưa đạt, thử lại sau khi tăng chỉ số nhé!");
        if (window.ZTBAudio) window.ZTBAudio.warning();
      }
      this.saveToStorage();
      this.publishPlayerToLiveBoard(false);
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
      this.publishPlayerToLiveBoard(false);
      this.renderAll();
    }

    getAssetPurchaseBlockReason(def) {
      if (!this.stats.isAlive) return "Nhân vật đã qua đời.";
      if (this.stats.age < 18) return "Cần đủ 18 tuổi để đứng tên mua tài sản.";
      const gate = ASSET_GATES[def.assetId];
      if (gate) {
        if (gate.minAcuity > 0 && (this.stats.businessAcuity || 0) < gate.minAcuity) {
          return `Cần Nhạy bén Kinh doanh ≥${gate.minAcuity} (hiện tại ${this.stats.businessAcuity || 0}).`;
        }
        const existing = this.portfolio.find((p) => p.assetId === def.assetId);
        const curQty = existing ? existing.quantity : 0;
        if (curQty >= gate.maxQty) {
          return `Đã đạt giới hạn tối đa ${gate.maxQty} đơn vị cho ${def.name}.`;
        }
      }
      if (this.stats.cash < def.cost) {
        return `Không đủ tiền mặt! Cần ${formatVND(def.cost)}.`;
      }
      return "";
    }

    buyAsset(def) {
      const blockReason = this.getAssetPurchaseBlockReason(def);
      if (blockReason) {
        this.showToast(blockReason);
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
      this.publishPlayerToLiveBoard(false);
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
      this.publishPlayerToLiveBoard(false);
      this.renderAll();
    }

    getMaxLoanLimit() {
      const netWorth = this.getNetWorth();
      if ((this.stats.creditFrozenYears || 0) > 0 || (this.stats.debtOverdueYears || 0) >= 2 || netWorth < -50_000_000) {
        return 0;
      }
      return Math.max(15_000_000, Math.floor(Math.max(0, netWorth) * 0.35) + this.stats.monthlyIncome * 12);
    }

    borrowLoan(amount) {
      if (this.stats.age < 18) {
        this.showToast("Cần đủ 18 tuổi để vay ngân hàng.");
        return;
      }
      if ((this.stats.creditFrozenYears || 0) > 0) {
        this.showToast(`🔒 Tín dụng đang bị đóng băng (còn ${this.stats.creditFrozenYears} năm), không thể vay!`);
        return;
      }
      const maxLim = this.getMaxLoanLimit();
      if (maxLim <= 0) {
        this.showToast("🚫 Hồ sơ tín dụng bị khóa do nợ xấu quá hạn hoặc âm vốn nặng!");
        return;
      }
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
      this.publishPlayerToLiveBoard(false);
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
      this.publishPlayerToLiveBoard(false);
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
      this.openRenameModal("baby");
    }

    finalizeHaveChild(childName) {
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
      const parentNetWorth = this.getNetWorth();
      const isRichDynasty = parentNetWorth >= 5_000_000_000;

      this.stats = this.createBlankStats();
      this.stats.generation = oldGen + 1;
      this.stats.backgroundId = inheritedCash >= 500_000_000 ? "bg_wealthy_dynasty" : "bg_working_class";
      this.stats.backgroundName = `Truyền nhân Đời thứ ${this.stats.generation}`;
      this.stats.characterName = child.fullName;
      this.stats.gender = childGender;
      this.stats.age = startAge;
      this.stats.cash = isUnderAge ? 0 : inheritedCash;
      this.stats.trustFund = isUnderAge ? inheritedCash : 0;
      this.stats.pocketMoneyChild = isRichDynasty ? 400_000 : 100_000;
      this.stats.pocketMoneyTeen = isRichDynasty ? 1_500_000 : 500_000;
      this.stats.comingOfAgeGrant = isRichDynasty ? 15_000_000 : 3_500_000;
      this.stats.familyAllowancePerYear = isRichDynasty ? 3_000_000 : 1_500_000;
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
      this.jobAppsThisYear = 0;
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
      this.publishPlayerToLiveBoard(true);
      this.renderAll();
    }

    openGameOverModal() {
      this.updateHallOfFame();
      const net = this.getNetWorth();
      const riskSummary = ((this.stats.layoffCount || 0) > 0 || (this.stats.bankruptcyCount || 0) > 0)
        ? `<br/>• Biến cố: <strong>Sa thải ${this.stats.layoffCount || 0} lần</strong> • <strong>Phá sản ${this.stats.bankruptcyCount || 0} lần</strong>`
        : "";
      el("gameover-summary").innerHTML = `
        <strong>${escapeHtml(this.stats.characterName)}</strong> (Đời thứ ${this.stats.generation})<br/>
        • Hưởng thọ: <strong>${this.stats.age} tuổi</strong> — ${escapeHtml(this.stats.causeOfDeath)}<br/>
        • Nghề nghiệp cuối cùng: <strong>${escapeHtml(this.stats.currentJob)}</strong><br/>
        • Tài sản ròng đỉnh cao: <strong style="color:#fbbf24;">${formatVND(this.stats.peakNetWorth)}</strong><br/>
        • Di sản để lại (${this.flags.family_trust_protected ? "100% nhờ Quỹ tín thác" : "85% sau thuế thừa kế"}): <strong style="color:#34d399;">${formatVND(net)}</strong>${riskSummary}
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

    // =====================================
    // RENDERING & STREAMLINED UX
    // =====================================
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
          intelligence: this.stats.intelligence,
          vip: !!this.monetization.vipForever,
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
      el("hud-vip-badge").classList.toggle("hidden", !this.monetization.vipForever);
      el("hud-job").textContent = s.currentJob;
      el("hud-macro").textContent = this.macroCycle.label;
      el("autosave-indicator").textContent = `✓ ${this.lastSavedLabel}`;

      const hudRank = this.getLiveOrAiHudRank();
      el("hud-rank").textContent = `${hudRank.prefix} #${hudRank.rank}`;
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

      const riskRow = el("hud-risk-badges");
      if (riskRow) {
        const pills = [];
        if ((s.creditFrozenYears || 0) > 0) {
          pills.push(`<span class="risk-pill danger">🔒 Đóng băng TD: ${s.creditFrozenYears} năm</span>`);
        }
        if ((s.debtOverdueYears || 0) > 0) {
          const cls = s.debtOverdueYears >= 2 ? "danger" : "warn";
          pills.push(`<span class="risk-pill ${cls}">⚖️ Nợ quá hạn: ${s.debtOverdueYears} năm</span>`);
        }
        if ((s.careerCooldownYears || 0) > 0) {
          pills.push(`<span class="risk-pill warn">📉 Hạn chế xin việc: ${s.careerCooldownYears} năm</span>`);
        }
        if ((s.bankruptcyCount || 0) > 0) {
          pills.push(`<span class="risk-pill danger">💥 Phá sản x${s.bankruptcyCount}</span>`);
        }
        riskRow.innerHTML = pills.join("");
        riskRow.classList.toggle("hidden", pills.length === 0);
      }

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

    renderSmartGuide() {
      const s = this.stats;
      const box = el("smart-guide-banner");
      let text = "";
      let actionLabel = "";
      let actionFn = null;
      let isDanger = false;

      if (!s.isAlive) {
        text = "🕯️ Nhân vật đã qua đời. Hãy chọn con cháu kế thừa hoặc bắt đầu kiếp mới!";
      } else if ((s.creditFrozenYears || 0) > 0) {
        isDanger = true;
        text = `🔒 <strong>Tín dụng đang bị đóng băng (${s.creditFrozenYears} năm)</strong> sau phá sản! Không thể vay ngân hàng — hãy giữ chi tiêu gọn và tích lũy tiền mặt.`;
      } else if ((s.debtOverdueYears || 0) >= 2 && s.debt > 0) {
        isDanger = true;
        text = `🔨 <strong>Cảnh báo Phát mãi &amp; Phá sản!</strong> Nợ quá hạn ${s.debtOverdueYears} năm (${formatVND(s.debt)}). Hãy trả nợ ngay trước khi bị thanh lý tài sản!`;
        actionLabel = "Trả nợ ›";
        actionFn = () => { this.assetsSubTab = "bank"; this.switchTab("assets"); };
      } else if ((s.debtOverdueYears || 0) === 1 && s.debt > 0) {
        isDanger = true;
        text = `⚖️ <strong>Nợ quá hạn năm 1!</strong> Ngân hàng đang khấu trừ 30% thu nhập ròng để thu hồi ${formatVND(s.debt)}.`;
        actionLabel = "Ngân hàng ›";
        actionFn = () => { this.assetsSubTab = "bank"; this.switchTab("assets"); };
      } else if (s.age < 6) {
        text = "👶 Giai đoạn ấu thơ: Bấm <strong>+1 TUỔI NÀO!</strong> bên dưới để lớn lên &amp; đón sự kiện đầu đời.";
      } else if (s.stress >= 75) {
        text = "⚠️ Áp lực đang quá cao! Hãy <strong>🧘 Thiền</strong> hoặc <strong>🏃 Tập thể thao</strong> ngay kẻo tụt Sức khỏe.";
      } else if (s.age >= 18 && !s.currentCareerId && !s.isRetired) {
        text = "💼 Đã đến tuổi tự lập! Hãy vào mục <strong>Sự Nghiệp</strong> để học thêm hoặc xin việc lấy lương.";
        actionLabel = "Xin việc ›";
        actionFn = () => { this.careerSubTab = "jobs"; this.switchTab("career"); };
      } else if (s.cash >= 25_000_000 && this.portfolio.length === 0) {
        text = `💡 Bạn đang có <strong>${formatVND(s.cash)}</strong> nhàn rỗi. Hãy gửi tiết kiệm hoặc đầu tư sinh lời!`;
        actionLabel = "Đầu tư ›";
        actionFn = () => { this.assetsSubTab = "market"; this.switchTab("assets"); };
      } else {
        text = `🎯 Bạn đang cạnh tranh trên <strong>BXH Người Chơi Thực</strong>. Bấm tên ✏️ để đổi tên bất cứ lúc nào!`;
        actionLabel = "Đua Top ›";
        actionFn = () => { this.leaderboardSubTab = "live"; this.switchTab("leaderboard"); };
      }

      box.classList.toggle("danger", isDanger);
      box.innerHTML = `<span>${text}</span>`;
      if (actionLabel && actionFn) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-sm btn-primary";
        btn.textContent = actionLabel;
        btn.addEventListener("click", actionFn);
        box.appendChild(btn);
      }
    }

    renderLifeTab() {
      this.renderSmartGuide();
      el("activities-remaining").textContent = `Còn ${this.activitiesLeft}/${MAX_ACTIVITIES_PER_YEAR} lượt`;
      const grid = el("activities-grid");
      grid.innerHTML = "";

      const activities = [
        { id: "exercise", title: "🏃 Tập thể thao", sub: "+6 Khỏe, -8 Lo âu", minAge: 6 },
        { id: "read", title: "📚 Đọc sách hay", sub: "+4 Trí, +5 Tài chính", minAge: 6 },
        { id: "meditate", title: "🧘 Thiền thư giãn", sub: "-16 Lo âu, +8 Vui", minAge: 6 },
        { id: "sidehustle", title: "💻 Làm thêm", sub: "Kiếm tiền (16+ tuổi)", minAge: 16 },
        { id: "socialize", title: "🤝 Giao lưu bạn bè", sub: "+5 Giao tiếp, +3 ĐV", minAge: 6 }
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
      for (let i = this.lifeLog.length - 1; i >= Math.max(0, this.lifeLog.length - 30); i--) {
        const item = this.lifeLog[i];
        const div = document.createElement("div");
        div.className = `log-entry ${item.kind || "normal"}`;
        div.textContent = item.text;
        timeline.appendChild(div);
      }
    }

    renderSubNav(containerId, items, activeKey, onPick) {
      const bar = el(containerId);
      bar.innerHTML = "";
      items.forEach((it) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "subnav-btn" + (activeKey === it.id ? " active" : "");
        b.textContent = it.label;
        b.addEventListener("click", () => {
          if (window.ZTBAudio) window.ZTBAudio.tap();
          onPick(it.id);
        });
        bar.appendChild(b);
      });
    }

    renderCareerTab() {
      const s = this.stats;
      const curCard = el("current-career-card");
      const monthlyNet = s.monthlyIncome + this.getMonthlyPassiveIncome() - s.monthlyExpense;

      const appsLeft = Math.max(0, MAX_JOB_APPS_PER_YEAR - (this.jobAppsThisYear || 0));
      const cooldownNotice = (s.careerCooldownYears || 0) > 0
        ? `<div class="alert-banner warn">📉 Đang trong thời gian phục hồi sau biến cố nghề nghiệp (${s.careerCooldownYears} năm): tỷ lệ đậu phỏng vấn giảm <strong>-18%</strong>.</div>`
        : "";

      curCard.innerHTML = `
        <div class="section-title">
          <span>🪪 Trạng thái Nghề nghiệp &amp; Học vấn</span>
          <span style="color:#93c5fd;">${escapeHtml(s.educationLevel)}</span>
        </div>
        <div class="item-title" style="font-size:14px;">${escapeHtml(s.currentJob)}</div>
        <div class="item-meta" style="margin-top:4px;">
          Lương: <strong style="color:#34d399;">${formatVND(s.monthlyIncome)}/tháng</strong> •
          Chi tiêu: <strong style="color:#fca5a5;">${formatVND(s.monthlyExpense)}/tháng</strong><br/>
          Dòng tiền ròng (+thụ động): <strong style="color:${monthlyNet >= 0 ? "#34d399" : "#ef4444"};">${formatVND(monthlyNet)}/tháng</strong><br/>
          Lượt ứng tuyển còn lại năm nay: <strong>${appsLeft}/${MAX_JOB_APPS_PER_YEAR}</strong> •
          Số lần sa thải: <strong>${s.layoffCount || 0}</strong>
        </div>
        ${cooldownNotice}
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

      this.renderSubNav(
        "career-subnav",
        [
          { id: "jobs", label: `💼 Việc Làm (${(DATA.careers || []).length})` },
          { id: "courses", label: "🎓 Học Tập & Bằng Cấp" }
        ],
        this.careerSubTab,
        (next) => {
          this.careerSubTab = next;
          this.renderCareerTab();
        }
      );

      el("career-jobs-pane").classList.toggle("hidden", this.careerSubTab !== "jobs");
      el("career-courses-pane").classList.toggle("hidden", this.careerSubTab !== "courses");

      const filterBtn = el("btn-filter-eligible-jobs");
      filterBtn.classList.toggle("active", this.onlyEligibleJobs);
      filterBtn.textContent = this.onlyEligibleJobs ? "Đang lọc: Đủ điều kiện" : "Hiện tất cả 22 nghề";

      if (this.careerSubTab === "jobs") {
        const careersList = el("careers-list");
        careersList.innerHTML = "";
        (DATA.careers || []).forEach((career) => {
          const isCurrent = s.currentCareerId === career.careerId;
          const okAge = s.age >= career.minAge && s.age <= career.maxAge;
          const okEdu = (EDU_RANKS[s.educationLevel] || 0) >= (EDU_RANKS[career.requiredEducation] || 0);
          const okStats = s.intelligence >= career.minIntelligence && s.discipline >= career.minDiscipline && s.charisma >= career.minCharisma;
          const canApply = !isCurrent && s.isAlive && okAge && okEdu && okStats;

          if (this.onlyEligibleJobs && !isCurrent && !canApply) return;

          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(career.title)} <span style="font-size:10px; color:#60a5fa;">[${escapeHtml(career.sector)}]</span></div>
              <div class="item-meta">
                Lương: <strong style="color:#34d399;">${formatVND(career.monthlySalary)}/th</strong> •
                YC: ${career.requiredEducation}, Trí ≥${career.minIntelligence}, Kỷ luật ≥${career.minDiscipline}, GT ≥${career.minCharisma}
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

        if (careersList.children.length === 0) {
          careersList.innerHTML = `<div class="item-meta">Chưa có việc phù hợp ở tuổi/trình độ hiện tại. Hãy chuyển qua mục <strong>🎓 Học Tập &amp; Bằng Cấp</strong> hoặc tắt bộ lọc để xem lộ trình!</div>`;
        }
      } else {
        const coursesList = el("courses-list");
        coursesList.innerHTML = "";
        const courses = [
          { id: "c_hs", title: "Bổ túc Tốt nghiệp THPT", desc: "Mở khóa bằng THPT", minAge: 16, cost: 4_000_000, setEdu: "THPT", mods: { intelligence: 6 } },
          { id: "c_voc", title: "Khóa Kỹ năng Nghề Thực chiến", desc: "Cấp chứng chỉ Học nghề & +14 Kỹ năng", minAge: 17, cost: 10_000_000, setEdu: "Học nghề", mods: { practicalSkills: 14, discipline: 6 } },
          { id: "c_uni", title: "Cử nhân Đại học Tại chức / Số", desc: "Đạt trình độ Đại học & +10 Trí tuệ", minAge: 18, cost: 35_000_000, setEdu: "Đại học", mods: { intelligence: 10, socialStatus: 6 } },
          { id: "c_mba", title: "MBA Quản trị & Đầu tư Tài chính", desc: "+9 Kinh doanh, +9 Tài chính, +6 Giao tiếp", minAge: 22, cost: 80_000_000, setEdu: null, mods: { businessAcuity: 9, financialLiteracy: 9, charisma: 6 } }
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
      }
    }

    renderAssetsTab() {
      const portVal = this.getPortfolioValue();
      const passive = this.getMonthlyPassiveIncome();
      const net = this.getNetWorth();
      const passiveColor = passive >= 0 ? "#34d399" : "#f87171";

      const riskAlerts = [];
      if ((this.stats.creditFrozenYears || 0) > 0) riskAlerts.push(`🔒 Đóng băng tín dụng (${this.stats.creditFrozenYears} năm)`);
      if ((this.stats.debtOverdueYears || 0) > 0) riskAlerts.push(`⚖️ Nợ quá hạn ${this.stats.debtOverdueYears} năm`);
      if ((this.stats.bankruptcyCount || 0) > 0) riskAlerts.push(`💥 Phá sản ${this.stats.bankruptcyCount} lần`);
      const riskBannerHtml = riskAlerts.length > 0
        ? `<div class="alert-banner danger">${riskAlerts.join(" • ")}</div>`
        : "";

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
        ${(this.stats.trustFund || 0) > 0 ? `<div class="item-meta" style="margin-top:6px; color:#fde68a;">🔒 Quỹ Ủy Thác (mở lúc 18t): <strong>${formatVND(this.stats.trustFund)}</strong></div>` : ""}
        <div class="item-meta" style="margin-top:5px;">
          Thu nhập thụ động (theo vĩ mô): <strong style="color:${passiveColor};">${formatVND(passive)}/tháng</strong>
        </div>
        ${riskBannerHtml}
      `;

      this.renderSubNav(
        "assets-subnav",
        [
          { id: "market", label: "🛒 Đầu Tư" },
          { id: "ledger", label: `📒 Dòng Tiền (${this.cashflowHistory.length})` },
          { id: "bank", label: "🏦 Ngân Hàng" }
        ],
        this.assetsSubTab,
        (next) => {
          this.assetsSubTab = next;
          this.renderAssetsTab();
        }
      );

      el("assets-market-pane").classList.toggle("hidden", this.assetsSubTab !== "market");
      el("assets-ledger-pane").classList.toggle("hidden", this.assetsSubTab !== "ledger");
      el("assets-bank-pane").classList.toggle("hidden", this.assetsSubTab !== "bank");

      if (this.assetsSubTab === "ledger") {
        this.renderCashflowLedger();
        return;
      }

      if (this.assetsSubTab === "bank") {
        const maxLoan = this.getMaxLoanLimit();
        const availLoan = Math.max(0, maxLoan - this.stats.debt);
        const bankCard = el("bank-desk-card");
        let bankAlertHtml = "";
        if ((this.stats.creditFrozenYears || 0) > 0) {
          bankAlertHtml = `<div class="alert-banner danger">🔒 Tín dụng bị đóng băng thêm <strong>${this.stats.creditFrozenYears} năm</strong> sau khi phá sản. Không thể vay vốn mới!</div>`;
        } else if (maxLoan === 0) {
          bankAlertHtml = `<div class="alert-banner danger">🚫 Hồ sơ tín dụng bị khóa tạm thời do nợ quá hạn (${this.stats.debtOverdueYears || 0} năm) hoặc tài sản ròng âm dưới -50 Triệu đ!</div>`;
        } else if ((this.stats.debtOverdueYears || 0) === 1) {
          bankAlertHtml = `<div class="alert-banner warn">⚖️ Nợ quá hạn năm 1: Ngân hàng đang khấu trừ 30% thu nhập ròng hàng năm! Trễ thêm 1 năm sẽ bị phát mãi tài sản (80%).</div>`;
        }
        bankCard.innerHTML = `
          <div class="section-title">
            <span>🏦 Tín dụng Ngân hàng (14.5%/năm)</span>
            <span>Hạn mức còn: ${formatVND(availLoan)}</span>
          </div>
          <div class="item-meta" style="margin-bottom:6px;">Vay vốn giúp tận dụng đòn bẩy mua tài sản, nhưng nhớ tất toán kịp trước khi lãi suất 14.5%/năm và thu hồi nợ ăn mòn gia sản!</div>
          ${bankAlertHtml}
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
        return;
      }

      // Market & Portfolio
      const portList = el("portfolio-list");
      portList.innerHTML = "";
      if (this.portfolio.length === 0) {
        portList.innerHTML = `<div class="item-meta">Chưa sở hữu tài sản nào. Hãy tích lũy vốn và đầu tư phía dưới!</div>`;
      } else {
        this.portfolio.forEach((item) => {
          const avgCost = item.totalInvestedCost / item.quantity;
          const pct = avgCost > 0 ? (((item.currentUnitValue - avgCost) / avgCost) * 100).toFixed(1) : "0.0";
          const pctColor = Number(pct) >= 0 ? "#34d399" : "#f87171";
          const macroPassive = this.getItemMacroMonthlyPassive(item);
          const passiveColor = macroPassive >= 0 ? "#34d399" : "#f87171";

          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(item.name)} (x${item.quantity})</div>
              <div class="item-meta">
                Giá trị: <strong>${formatVND(item.currentUnitValue)}</strong>
                (<span style="color:${pctColor};">${Number(pct) >= 0 ? "+" : ""}${pct}%</span>) •
                Dòng tiền: <span style="color:${passiveColor};">${formatVND(macroPassive)}/th</span>
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

      const filterBar = el("asset-filter-bar");
      filterBar.innerHTML = "";
      [
        { id: "all", label: "Tất cả" },
        { id: "real_estate", label: "🏠 BĐS" },
        { id: "investment", label: "📈 Đầu tư" },
        { id: "business", label: "🏭 Doanh nghiệp" },
        { id: "vehicle", label: "🚗 Xe & Du thuyền" }
      ].forEach((c) => {
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
          const gate = ASSET_GATES[def.assetId];
          const owned = this.portfolio.find((p) => p.assetId === def.assetId);
          const ownedQty = owned ? owned.quantity : 0;
          const blockReason = this.getAssetPurchaseBlockReason(def);
          const canBuy = !blockReason;

          const gateTags = [];
          if (gate && gate.minAcuity > 0) gateTags.push(`YC: KD ≥${gate.minAcuity}`);
          if (gate && Number.isFinite(gate.maxQty)) gateTags.push(`Tối đa ${ownedQty}/${gate.maxQty}`);
          const gateMeta = gateTags.length > 0 ? ` • <span style="color:#93c5fd;">[${gateTags.join(" • ")}]</span>` : "";

          let btnLabel = "Mua ngay";
          if (gate && Number.isFinite(gate.maxQty) && ownedQty >= gate.maxQty) btnLabel = "Đã đạt trần";
          else if (gate && gate.minAcuity > 0 && (this.stats.businessAcuity || 0) < gate.minAcuity) btnLabel = `Cần KD ≥${gate.minAcuity}`;

          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(def.name)}</div>
              <div class="item-meta">
                Giá: <strong style="color:#fbbf24;">${formatVND(def.cost)}</strong> •
                Thụ động: ${formatVND(def.monthlyPassiveIncome)}/th •
                Tăng TB: ${(def.annualAppreciationRate * 100).toFixed(1)}%/năm${gateMeta}<br/>
                ${escapeHtml(def.description)}
              </div>
            </div>
          `;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = canBuy ? "btn-sm btn-green" : "btn-sm btn-ghost";
          btn.textContent = btnLabel;
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
      this.renderSubNav(
        "leaderboard-subnav",
        [
          { id: "live", label: "🌐 Người Chơi Thực" },
          { id: "ai", label: "🏛️ Tỷ Phú AI" },
          { id: "hof", label: "🏆 Kỷ Lục" }
        ],
        this.leaderboardSubTab,
        (next) => {
          this.leaderboardSubTab = next;
          this.renderHUD();
          this.renderLeaderboardTab();
        }
      );

      const isLive = this.leaderboardSubTab === "live";
      const isAi = this.leaderboardSubTab === "ai";
      const isHof = this.leaderboardSubTab === "hof";

      el("live-board-status-card").classList.toggle("hidden", !isLive);
      el("leaderboard-hero-card").classList.toggle("hidden", isHof);
      el("leaderboard-main-card").classList.toggle("hidden", isHof);
      el("hall-of-fame-card").classList.toggle("hidden", !isHof);

      const playerNet = this.getNetWorth();

      if (isLive) {
        this.publishPlayerToLiveBoard(false);
        const snap = window.ZTBLiveBoard
          ? window.ZTBLiveBoard.getLeaderboardSnapshot()
          : { connected: false, brokerHost: "offline", onlineCount: 1, totalPlayers: 1, entries: [] };

        el("live-board-status").innerHTML = snap.connected
          ? `🟢 <strong>Live Online</strong> • ${snap.onlineCount} đang chơi (${snap.totalPlayers} hồ sơ)`
          : `🟡 <strong>Cục bộ / Đang kết nối</strong> • ${snap.totalPlayers} người chơi đã lưu`;

        el("leaderboard-list-title").textContent = `🌐 Bảng Xếp Hạng Người Chơi Thực (${snap.entries.length})`;

        const rankIdx = snap.entries.findIndex((x) => x.isPlayer);
        const rank = rankIdx >= 0 ? rankIdx + 1 : 1;
        const hero = el("leaderboard-hero-card");

        if (snap.entries.length <= 1) {
          hero.innerHTML = `
            <div class="section-title"><span>🌐 Thứ hạng Người Chơi Thực</span><span style="color:#fbbf24;">Hạng #1 / 1</span></div>
            <div class="item-meta">Bạn là người đầu tiên đang online lúc này! Khi người chơi khác mở game, tên và tài sản ròng của họ sẽ tự động cập nhật trực tiếp tại đây.</div>
          `;
        } else if (rank === 1) {
          hero.innerHTML = `
            <div class="section-title"><span>👑 QUÁN QUÂN NGƯỜI CHƠI</span><span style="color:#fbbf24;">Hạng #1 / ${snap.entries.length}</span></div>
            <div class="item-meta">Bạn đang dẫn đầu toàn bộ <strong>${snap.entries.length}</strong> người chơi thực với tài sản ròng <strong style="color:#34d399;">${formatVND(playerNet)}</strong>!</div>
          `;
        } else {
          const nextP = snap.entries[rankIdx - 1];
          const gap = Math.max(0, nextP.netWorth - playerNet);
          const pct = nextP.netWorth > 0 ? clamp((playerNet / nextP.netWorth) * 100, 0, 100) : 100;
          hero.innerHTML = `
            <div class="section-title"><span>🌐 Thứ hạng Người Chơi Thực</span><span style="color:#fbbf24;">Hạng #${rank} / ${snap.entries.length}</span></div>
            <div class="item-meta" style="margin-bottom:6px;">
              Mục tiêu kế tiếp (#${rank - 1}): <strong>${escapeHtml(nextP.name)}</strong> (${formatVND(nextP.netWorth)})<br/>
              Cần thêm: <strong style="color:#34d399;">${formatVND(gap)}</strong> để vượt mặt!
            </div>
            <div class="progress-track" style="height:8px;"><div class="progress-fill fill-happy" style="width:${pct.toFixed(1)}%"></div></div>
          `;
        }

        const listEl = el("leaderboard-list");
        listEl.innerHTML = "";
        snap.entries.forEach((entry, idx) => {
          const pos = idx + 1;
          const medal = pos === 1 ? "🥇" : (pos === 2 ? "🥈" : (pos === 3 ? "🥉" : `#${pos}`));
          const minsAgo = Math.max(1, Math.floor((Date.now() - (entry.ts || Date.now())) / 60000));
          const presence = entry.isOnline
            ? `<span style="color:#34d399;">🟢 Đang chơi</span>`
            : `<span style="color:#94a3b8;">🕒 ${minsAgo < 60 ? `${minsAgo}p` : `${Math.floor(minsAgo / 60)}g`} trước</span>`;
          const vipTag = entry.vip ? ` <span class="vip-tag">VIP</span>` : "";

          const row = document.createElement("div");
          row.className = "lb-row" + (entry.isPlayer ? " is-player" : "");
          row.innerHTML = `
            <div class="lb-left">
              <div class="lb-rank-badge">${medal}</div>
              <div class="lb-avatar">${entry.isPlayer ? "💎" : (entry.vip ? "👑" : "🧑")}</div>
              <div class="item-info">
                <div class="item-title" style="font-size:12px;">${escapeHtml(entry.name)}${entry.isPlayer ? " (BẠN)" : ""}${vipTag}</div>
                <div class="item-meta">${entry.age}t • ${escapeHtml(entry.job)} • ${presence}</div>
              </div>
            </div>
            <strong style="font-size:12px; color:#fbbf24; white-space:nowrap;">${formatVND(entry.netWorth)}</strong>
          `;
          listEl.appendChild(row);
        });
        return;
      }

      if (isAi) {
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

        el("leaderboard-list-title").textContent = "🏛️ Bảng Xếp Hạng Tỷ Phú AI (Top 21)";
        const hero = el("leaderboard-hero-card");
        if (rank === 1) {
          hero.innerHTML = `
            <div class="section-title"><span>👑 VỊ TRÍ HIỆN TẠI</span><span style="color:#fbbf24;">Hạng #1 / ${combined.length}</span></div>
            <div class="item-title" style="font-size:14px; color:#fde68a;">NGƯỜI GIÀU NHẤT HÀNH TINH!</div>
            <div class="item-meta">Tài sản ròng đạt <strong>${formatVND(playerNet)}</strong>, vượt trên toàn bộ ${this.rivals.length} đại gia AI!</div>
          `;
        } else {
          const nextRival = combined[rankIdx - 1];
          const gap = Math.max(0, nextRival.netWorth - playerNet);
          const pct = nextRival.netWorth > 0 ? clamp((playerNet / nextRival.netWorth) * 100, 0, 100) : 100;
          hero.innerHTML = `
            <div class="section-title"><span>🏆 Thứ hạng Phú Hào AI</span><span style="color:#fbbf24;">Hạng #${rank} / ${combined.length}</span></div>
            <div class="item-meta" style="margin-bottom:6px;">
              Mục tiêu kế tiếp (#${rank - 1}): <strong>${escapeHtml(nextRival.name)}</strong> (${formatVND(nextRival.netWorth)})<br/>
              Cần thêm: <strong style="color:#34d399;">${formatVND(gap)}</strong> để vượt mặt!
            </div>
            <div class="progress-track" style="height:8px;"><div class="progress-fill fill-happy" style="width:${pct.toFixed(1)}%"></div></div>
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
        return;
      }

      // Hall of Fame
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
        kidBtn.textContent = "👶 Sinh con & Đặt tên";
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
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        this.lastSavedLabel = `Đã lưu ${hh}:${mm}`;
        const ind = el("autosave-indicator");
        if (ind) ind.textContent = `✓ ${this.lastSavedLabel}`;
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
