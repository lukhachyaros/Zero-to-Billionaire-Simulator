// Zero to Billionaire Simulator — Interactive Web Client Controller
(function () {
  const SAVE_KEY = "ztb_web_save_v2";
  const HALL_OF_FAME_KEY = "ztb_hall_of_fame_v1";
  const MONETIZATION_KEY = "ztb_monetization_v1";
  const USD_BILLION_VND = 25_000_000_000_000; // 25.000 Tỷ VNĐ (~ $1B)
  const MAX_ACTIVITIES_PER_YEAR = 2;
  const FREE_TIME_MACHINE_LIMIT = 5;
  const MAX_TIME_MACHINE_HISTORY = 20;
  const MAX_JOB_APPS_PER_YEAR = 2;
  const ANNUAL_LOAN_RATE = 0.085;

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
      perks: "• Nhận ngay +3 Vé Chơi Lại không cần xem quảng cáo<br/>• Hỗ trợ suốt 3 đời: +12 May mắn, +10 Sức khỏe, +25 Triệu đ Quỹ Tuổi 18<br/>• Tối đa 5 lần lùi tuổi miễn phí/đời"
    },
    vip: {
      id: "vip",
      title: "👑 Gói Tỷ Phú VIP Vĩnh Viễn",
      price: "49.000đ",
      perks: "• Mở khóa CHƠI LẠI VÔ HẠN trọn đời, không quảng cáo<br/>• Huy hiệu 👑 VIP nổi bật trên Bảng Xếp Hạng Người Chơi Thực<br/>• Hỗ trợ vĩnh viễn: +15 Trí tuệ, +15 May mắn, +50 Triệu đ Quỹ 18t &amp; Giảm 20% phí tài sản khi lùi tuổi vượt mốc 5 lần"
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
    { id: "Boom", label: "📈 Kinh tế Hưng thịnh", mult: 1.38, loanRate: 0.095, weight: 0.16 },
    { id: "Expansion", label: "🌤️ Tăng trưởng Ổn định", mult: 0.96, loanRate: 0.085, weight: 0.38 },
    { id: "Inflation", label: "🔥 Lạm phát Thắt chặt", mult: 0.65, loanRate: 0.125, weight: 0.25 },
    { id: "Recession", label: "🌧️ Suy thoái Khốc liệt", mult: -0.45, loanRate: 0.11, weight: 0.21 }
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
      return MAX_TIME_MACHINE_HISTORY;
    }

    getCurrentLoanRate() {
      return (this.macroCycle && typeof this.macroCycle.loanRate === "number")
        ? this.macroCycle.loanRate
        : ANNUAL_LOAN_RATE;
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
        childrenCount: 0,
        rewindsUsed: 0,
        inflationMult: 1.0
      };
    }

    updateLoadingUI(pct, stepLabel, stageIdx) {
      const clamped = clamp(Math.round(pct || 0), 0, 100);
      const bar = el("loading-bar-fill");
      const pctEl = el("loading-pct");
      const txtEl = el("loading-step-text");
      const row = el("loading-stages-row");

      if (bar) bar.style.width = `${clamped}%`;
      if (pctEl) pctEl.textContent = `${clamped}%`;
      if (txtEl && stepLabel) txtEl.textContent = stepLabel;
      if (row && typeof stageIdx === "number") {
        row.querySelectorAll(".load-stage-pill").forEach((pill) => {
          const idx = parseInt(pill.getAttribute("data-stage") || "0", 10);
          pill.classList.toggle("done", idx < stageIdx || clamped >= 100);
          pill.classList.toggle("active", idx === stageIdx && clamped < 100);
        });
      }
    }

    dismissLoadingScreen() {
      const overlay = el("game-loading-screen");
      if (!overlay || overlay.classList.contains("hidden")) return;
      overlay.classList.add("fade-out");
      setTimeout(() => {
        overlay.classList.add("hidden");
      }, 480);
    }

    async init() {
      const LOADING_TIPS = [
        "💡 Mẹo: Tích lũy quỹ dự phòng tiền mặt trước chu kỳ Suy thoái để tránh bị ngân hàng phát mãi tài sản!",
        "💡 Mẹo: Bạn có tối đa 5 lượt lùi tuổi miễn phí mỗi đời — từ lần thứ 6 sẽ phải đánh đổi ít nhất 25% tài sản!",
        "💡 Mẹo: Nâng chỉ số Kinh doanh & Kỷ luật trước khi mở nhiều chuỗi cửa hàng để không bị thất thoát quản trị!",
        "💡 Mẹo: Trên iPhone, chọn Chia sẻ -> Thêm vào Màn hình chính để chơi toàn màn hình kèm biểu tượng riêng!",
        "💡 Mẹo: Lập Quỹ Tín Thác Gia Tộc trước tuổi xế chiều để con cháu kế thừa 100% tiền mặt không mất thuế di sản!"
      ];
      const tipEl = el("loading-tip-text");
      if (tipEl) {
        tipEl.textContent = LOADING_TIPS[randInt(0, LOADING_TIPS.length - 1)];
      }
      this.updateLoadingUI(8, "Đang nạp cấu trúc dữ liệu & sự kiện...", 0);

      const safetyTimer = setTimeout(() => this.dismissLoadingScreen(), 5000);

      this.bindStaticUI();

      window.addEventListener("beforeunload", () => this.saveToStorage());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") this.saveToStorage();
      });

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

      const loaded = this.loadFromStorage();
      if (!loaded) {
        this.startNewLife("Nguyễn Gia Huy", "Nam", this.selectedBackgroundId, true);
      } else if ((this.monetization.totalLivesStarted || 0) === 0) {
        this.monetization.totalLivesStarted = 1;
        this.saveMonetization();
      }

      // Preload & biên dịch trước toàn bộ 5 cấp phòng 3D + nhân vật + shader trên GPU
      if (window.Diorama3D && typeof window.Diorama3D.initAsync === "function") {
        try {
          await window.Diorama3D.initAsync("diorama-canvas", (pct, msg, stg) => {
            this.updateLoadingUI(pct, msg, stg);
          });
        } catch (err) {
          console.warn("[ZTBSim] Async 3D preload fallback:", err);
          window.Diorama3D.init("diorama-canvas");
        }
      } else if (window.Diorama3D) {
        window.Diorama3D.init("diorama-canvas");
      }

      this.publishPlayerToLiveBoard(true);
      this.renderAll();
      this.updateLoadingUI(100, "Hoàn tất! Chào mừng đến với thế giới Tỷ Phú!", 4);

      await new Promise((r) => setTimeout(r, 180));
      clearTimeout(safetyTimer);
      this.dismissLoadingScreen();

      if (loaded) {
        this.showToast(`📂 Chào mừng ${this.stats.characterName} trở lại!`);
        if (!this.stats.isAlive) {
          this.openGameOverModal();
        }
      } else {
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
      el("hud-online-pill").addEventListener("click", () => {
        if (window.ZTBAudio) window.ZTBAudio.tap();
        this.leaderboardSubTab = "live";
        this.switchTab("leaderboard");
      });
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

      // Paid Rewind Confirmation Modal (6th+ Rewind)
      el("btn-confirm-paid-rewind").addEventListener("click", () => this.executePaidRewind());
      el("btn-cancel-paid-rewind").addEventListener("click", () => el("rewind-confirm-modal").classList.remove("open"));
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

    openNewLifeModal(isFirstFree = false) {
      this.customNameDirty = false;
      const input = el("input-char-name");
      input.value = "";
      input.placeholder = `Nhập họ tên bạn muốn (VD: ${generateVietnameseName(this.selectedGender)})...`;

      const banner = el("new-life-booster-banner");
      const m = this.monetization;
      const boosts = [];
      if (m.vipForever) boosts.push("👑 VIP (+15 Trí, +15 May, +50Tr Quỹ 18t, -20% phí lùi tuổi vượt mốc 5 lần)");
      else if ((m.starterLivesLeft || 0) > 0) boosts.push(`🎁 Gói Khởi Đầu (còn ${m.starterLivesLeft} đời: +12 May, +10 Khỏe, +25Tr Quỹ 18t)`);
      if (m.adBonusPending) boosts.push("🎬 Quà Quảng Cáo (+5 May, +3Tr Quỹ 18t)");

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
          this.stats.comingOfAgeGrant += 50_000_000;
        } else if ((m.starterLivesLeft || 0) > 0) {
          this.stats.luck += 12;
          this.stats.health += 10;
          this.stats.comingOfAgeGrant += 25_000_000;
          m.starterLivesLeft -= 1;
        }
        if (m.adBonusPending) {
          this.stats.luck += 5;
          this.stats.comingOfAgeGrant += 3_000_000;
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
      this.stats = snap.stats;
      if (!this.stats.lifeId) this.stats.lifeId = `life_${Date.now()}_${randInt(100, 999)}`;
      if (typeof this.stats.rewindsUsed !== "number") this.stats.rewindsUsed = 0;
      if (typeof this.stats.inflationMult !== "number") this.stats.inflationMult = 1.0;
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

    calculatePaidRewindQuote() {
      if (this.timeMachine.length === 0) return null;
      const topRaw = this.timeMachine[this.timeMachine.length - 1];
      const topSnap = JSON.parse(topRaw);
      const used = this.stats.rewindsUsed || 0;
      const nextRewindNum = used + 1;
      const extraIndex = Math.max(1, nextRewindNum - FREE_TIME_MACHINE_LIMIT);

      const snapPortfolioVal = (topSnap.portfolio || []).reduce((s, it) => s + it.currentUnitValue * it.quantity, 0);
      const snapGrossAssets = (topSnap.stats.cash || 0) + (topSnap.stats.trustFund || 0) + snapPortfolioVal;
      const snapNetWorth = snapGrossAssets - (topSnap.stats.debt || 0);
      const currentNetWorth = this.getNetWorth();

      const refWealth = Math.max(0, currentNetWorth, snapNetWorth);
      const vipMult = this.monetization.vipForever ? 0.80 : 1.0;
      const rawPct = Math.min(0.75, 0.15 + extraIndex * 0.10);
      const effectivePct = rawPct * vipMult;
      const minFloor = Math.round(100_000_000 * extraIndex * vipMult);
      const cost = Math.max(minFloor, Math.round(refWealth * effectivePct));
      const canAfford = snapNetWorth >= cost && snapGrossAssets >= cost;

      return {
        nextRewindNum,
        extraIndex,
        targetAge: topSnap.stats.age,
        snapNetWorth,
        snapGrossAssets,
        effectivePct: Math.round(effectivePct * 100),
        minFloor,
        cost,
        canAfford
      };
    }

    deductWealthForRewind(totalCost, rewindNum) {
      let remaining = Math.round(totalCost);
      const fromCash = Math.min(this.stats.cash, remaining);
      if (fromCash > 0) {
        this.stats.cash -= fromCash;
        remaining -= fromCash;
        this.recordCashflow(-fromCash, "rewind", `Khấu trừ tiền mặt lùi tuổi lần #${rewindNum}`);
      }

      if (remaining > 0 && (this.stats.trustFund || 0) > 0) {
        const fromTrust = Math.min(this.stats.trustFund, remaining);
        this.stats.trustFund -= fromTrust;
        remaining -= fromTrust;
      }

      if (remaining > 0 && this.portfolio.length > 0) {
        const catPriority = { investment: 1, vehicle: 2, real_estate: 3, business: 4 };
        this.portfolio.sort((a, b) => (catPriority[a.category] || 5) - (catPriority[b.category] || 5));

        for (let i = 0; i < this.portfolio.length && remaining > 0; i++) {
          const item = this.portfolio[i];
          while (item.quantity > 0 && remaining > 0) {
            const unitVal = item.currentUnitValue;
            const avgCost = Math.round(item.totalInvestedCost / item.quantity);
            item.totalInvestedCost -= avgCost;
            item.quantity -= 1;

            if (unitVal > remaining) {
              const change = unitVal - remaining;
              this.stats.cash += change;
              this.recordCashflow(-remaining, "rewind", `Thanh lý 1 [${item.name}] trả phí lùi tuổi #${rewindNum}`);
              remaining = 0;
            } else {
              remaining -= unitVal;
              this.recordCashflow(-unitVal, "rewind", `Thanh lý 1 [${item.name}] trả phí lùi tuổi #${rewindNum}`);
            }
          }
        }
        this.portfolio = this.portfolio.filter((it) => it.quantity > 0);
      }

      if (remaining > 0) {
        this.stats.debt += remaining;
      }
      this.clampStats();
    }

    useTimeMachine() {
      if (this.timeMachine.length === 0) return;
      const used = this.stats.rewindsUsed || 0;

      if (used < FREE_TIME_MACHINE_LIMIT) {
        const snap = this.timeMachine.pop();
        this.restoreSnapshot(snap);
        this.stats.rewindsUsed = used + 1;
        const freeLeft = FREE_TIME_MACHINE_LIMIT - this.stats.rewindsUsed;
        if (window.ZTBAudio) window.ZTBAudio.success();
        if (window.Diorama3D) window.Diorama3D.triggerCelebration("happy");
        this.addLog(
          `⏪ Cỗ Máy Thời Gian (#${this.stats.rewindsUsed}/${FREE_TIME_MACHINE_LIMIT} miễn phí): Quay lại năm ${this.stats.age} tuổi! (Còn ${freeLeft} lượt miễn phí)`,
          "milestone"
        );
        this.showToast(`⏪ Quay về ${this.stats.age} tuổi! (Còn ${freeLeft}/${FREE_TIME_MACHINE_LIMIT} lượt miễn phí)`);
        this.saveToStorage();
        this.publishPlayerToLiveBoard(true);
        this.renderAll();
        return;
      }

      const quote = this.calculatePaidRewindQuote();
      if (!quote) return;

      el("rewind-modal-title").textContent = `⏳ Lùi Thời Gian Lần #${quote.nextRewindNum} (Trả Bằng Tài Sản)`;
      el("rewind-modal-body").innerHTML = `
        Bạn đã dùng hết <strong>${FREE_TIME_MACHINE_LIMIT}/${FREE_TIME_MACHINE_LIMIT} lượt lùi tuổi miễn phí</strong> trong đời này.
        Để nghịch chuyển về <strong>năm ${quote.targetAge} tuổi</strong>, bạn phải đánh đổi một khoản lớn trong tài sản!
      `;

      const costBox = el("rewind-cost-box");
      const confirmBtn = el("btn-confirm-paid-rewind");
      if (quote.canAfford) {
        costBox.innerHTML = `
          <div style="font-size:13px; margin-bottom:4px;">💸 Phí khấu trừ tài sản: <strong style="color:#fbbf24; font-size:15px;">-${formatVND(quote.cost)}</strong></div>
          <div style="font-size:11px; color:#cbd5e1; line-height:1.45;">
            • Mức phạt lũy tiến lần vượt #${quote.extraIndex}: <strong>${quote.effectivePct}% tổng tài sản</strong> (tối thiểu ${formatVND(quote.minFloor)})<br/>
            • Tài sản ròng tại mốc ${quote.targetAge} tuổi: <strong style="color:#34d399;">${formatVND(quote.snapNetWorth)}</strong><br/>
            • Tự động trừ vào Tiền mặt trước; nếu thiếu sẽ thanh lý Danh mục tài sản đang nắm giữ.
          </div>
        `;
        confirmBtn.disabled = false;
        confirmBtn.textContent = `⏳ Trừ ${formatVND(quote.cost)} & Lùi Về ${quote.targetAge}t`;
      } else {
        costBox.innerHTML = `
          <div style="font-size:13px; margin-bottom:4px;">❌ Cần tối thiểu: <strong style="color:#f87171; font-size:15px;">${formatVND(quote.cost)}</strong></div>
          <div style="font-size:11px; color:#fca5a5; line-height:1.45;">
            Tài sản ròng tại mốc ${quote.targetAge} tuổi chỉ có <strong>${formatVND(quote.snapNetWorth)}</strong> — không đủ để đánh đổi lượt lùi thời gian lần #${quote.nextRewindNum}!
          </div>
        `;
        confirmBtn.disabled = true;
        confirmBtn.textContent = "Không đủ tài sản";
      }

      el("rewind-confirm-modal").classList.add("open");
    }

    executePaidRewind() {
      const quote = this.calculatePaidRewindQuote();
      el("rewind-confirm-modal").classList.remove("open");
      if (!quote || !quote.canAfford) {
        this.showToast("❌ Không đủ tài sản để mua thêm lượt lùi tuổi!");
        return;
      }

      const snap = this.timeMachine.pop();
      this.restoreSnapshot(snap);
      this.stats.rewindsUsed = quote.nextRewindNum;
      this.deductWealthForRewind(quote.cost, quote.nextRewindNum);

      if (window.ZTBAudio) window.ZTBAudio.warning();
      if (window.Diorama3D) window.Diorama3D.triggerCelebration("coin");
      this.addLog(
        `⏳ Nghịch chuyển thời gian lần #${quote.nextRewindNum} (vượt mốc 5 lần): Đã khấu trừ -${formatVND(quote.cost)} khỏi khối tài sản để lùi về năm ${this.stats.age} tuổi!`,
        "danger"
      );
      this.showToast(`⏳ Đã trừ ${formatVND(quote.cost)} tài sản để lùi về ${this.stats.age} tuổi!`);
      this.saveToStorage();
      this.publishPlayerToLiveBoard(true);
      this.renderAll();
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
      if (!this.stats.currentCareerId) {
        if (this.stats.age < 6) this.stats.currentJob = "Trẻ nhỏ";
        else if (this.stats.age <= 18) this.stats.currentJob = `Học sinh (${this.stats.educationLevel})`;
        else if (!this.stats.isRetired) this.stats.currentJob = "Tự do / Tìm việc";
        return;
      }

      const career = (DATA.careers || []).find((c) => c.careerId === this.stats.currentCareerId);
      if (!career) return;

      this.stats.yearsInCurrentJob += 1;
      const highPressureExtra = this.stats.monthlyIncome >= 35_000_000 ? 3 : 1;
      this.stats.stress += Math.max(2, career.annualStressDelta + highPressureExtra - Math.floor(this.stats.discipline / 24));
      this.stats.practicalSkills += 2;

      // Cơ chế tăng độ khó: Nguy cơ sa thải thời suy thoái hoặc trượt KPI khi kiệt sức
      const isRecession = this.macroCycle && this.macroCycle.id === "Recession";
      const kpiScore = this.stats.discipline * 0.5 + this.stats.practicalSkills * 0.3 + this.stats.intelligence * 0.35 - this.stats.stress * 0.25;
      if (this.stats.age >= 20 && this.stats.yearsInCurrentJob >= 1) {
        if (isRecession && kpiScore < 58 && Math.random() < 0.22) {
          const severance = Math.round(this.stats.monthlyIncome * 1.0);
          const lostTitle = this.stats.currentJob;
          this.stats.cash += severance;
          this.recordCashflow(severance, "salary", `Trợ cấp thôi việc (${lostTitle})`);
          this.stats.currentCareerId = "";
          this.stats.currentJob = "Thất nghiệp (Cắt giảm)";
          this.stats.monthlyIncome = 0;
          this.stats.yearsInCurrentJob = 0;
          this.stats.stress += 14;
          this.stats.happiness -= 12;
          this.clampStats();
          this.addLog(`📉 Làn sóng sa thải thời suy thoái: Bạn mất việc tại [${lostTitle}] (nhận ${formatVND(severance)} trợ cấp)!`, "danger");
          this.showToast(`📉 Bị cắt giảm nhân sự tại ${lostTitle}!`);
          return;
        }
        if (this.stats.stress >= 90 && this.stats.discipline < 45 && Math.random() < 0.25) {
          const lostTitle = this.stats.currentJob;
          this.stats.currentCareerId = "";
          this.stats.currentJob = "Tự do / Tìm việc";
          this.stats.monthlyIncome = 0;
          this.stats.yearsInCurrentJob = 0;
          this.stats.happiness -= 10;
          this.clampStats();
          this.addLog(`⚠️ Kiệt sức & trượt KPI liên tiếp khiến bạn mất vị trí [${lostTitle}]!`, "danger");
          return;
        }
      }

      const macroSalaryFactor = isRecession ? 0.15 : (this.macroCycle.id === "Inflation" ? 0.65 : 0.92);
      const perf = (0.55 + (this.stats.discipline + this.stats.intelligence) / 230) * macroSalaryFactor;
      const raise = Math.round(this.stats.monthlyIncome * career.annualRaiseRate * perf);
      this.stats.monthlyIncome += Math.max(0, raise);

      if (career.promotionCareerId && career.yearsForPromotion > 0 && this.stats.yearsInCurrentJob >= career.yearsForPromotion) {
        const nextJob = (DATA.careers || []).find((c) => c.careerId === career.promotionCareerId);
        if (
          nextJob &&
          this.stats.intelligence >= nextJob.minIntelligence &&
          this.stats.discipline >= nextJob.minDiscipline &&
          this.stats.stress < 82
        ) {
          this.stats.currentCareerId = nextJob.careerId;
          this.stats.currentJob = nextJob.title;
          this.stats.monthlyIncome = Math.max(Math.round(this.stats.monthlyIncome * 1.18), nextJob.monthlySalary);
          this.stats.yearsInCurrentJob = 0;
          this.stats.happiness += 12;
          this.stats.socialStatus += 10;
          this.addLog(`🚀 Thăng chức lên ${nextJob.title} (${formatVND(this.stats.monthlyIncome)}/tháng)!`, "milestone");
          this.showToast(`🚀 Thăng chức: ${nextJob.title}!`);
        }
      }

      if (this.stats.age >= 62 && !this.stats.isRetired && this.stats.age > career.maxAge) {
        const pension = Math.round(this.stats.monthlyIncome * 0.40);
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

    processAnnualEconomy() {
      const roll = Math.random();
      let acc = 0;
      for (const cyc of MACRO_CYCLES) {
        acc += cyc.weight;
        if (roll <= acc) {
          this.macroCycle = cyc;
          break;
        }
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

      if (this.stats.age >= 18 && this.stats.age <= 21 && !this.stats.currentCareerId && (this.stats.familyAllowancePerYear || 0) > 0) {
        this.stats.cash += this.stats.familyAllowancePerYear;
        this.recordCashflow(this.stats.familyAllowancePerYear, "family", "Trợ cấp học tập từ gia đình");
      }

      // Lạm phát tích lũy theo năm trưởng thành (làm tăng dần chi phí sinh hoạt nền)
      if (this.stats.age >= 18) {
        const infStep = this.macroCycle.id === "Inflation"
          ? 1.048
          : (this.macroCycle.id === "Boom" ? 1.030 : (this.macroCycle.id === "Expansion" ? 1.020 : 1.008));
        this.stats.inflationMult = Math.min(4.8, (this.stats.inflationMult || 1.0) * infStep);
      }
      const infMult = this.stats.inflationMult || 1.0;

      // Tính dòng tiền thụ động thực tế: có bão hòa chuỗi, giới hạn năng lực quản trị & rủi ro thua lỗ KD thời suy thoái
      let posPassiveMonthly = 0;
      let negUpkeepMonthly = 0;
      let bizLossAnnual = 0;
      const totalBizUnits = this.portfolio
        .filter((it) => it.category === "business")
        .reduce((s, it) => s + it.quantity, 0);
      const bizManageCap = 1 + Math.floor(((this.stats.businessAcuity || 20) + (this.stats.discipline || 20)) / 36);
      const overloadPenalty = totalBizUnits > bizManageCap
        ? Math.max(0.38, 1 - (totalBizUnits - bizManageCap) * 0.14)
        : 1.0;

      if (totalBizUnits > bizManageCap && this.stats.age >= 18) {
        const extraUnits = totalBizUnits - bizManageCap;
        this.stats.stress += Math.min(14, extraUnits * 3);
        this.addLog(
          `⚠️ Quá tải quản trị (${totalBizUnits}/${bizManageCap} cơ sở KD): Thất thoát vận hành ${Math.round((1 - overloadPenalty) * 100)}%! Hãy nâng Kinh doanh & Kỷ luật.`,
          "danger"
        );
      }

      for (const item of this.portfolio) {
        if (item.monthlyPassivePerUnit < 0) {
          negUpkeepMonthly += (-item.monthlyPassivePerUnit) * item.quantity;
          continue;
        }
        if (item.category === "business") {
          // Bão hòa khi mở nhiều chi nhánh trùng nhau + biến động lợi nhuận theo vĩ mô
          const satFactor = item.quantity <= 2 ? 1.0 : (1 / (1 + (item.quantity - 2) * 0.24));
          const skillFactor = 0.65 + ((this.stats.businessAcuity || 20) + (this.stats.financialLiteracy || 20)) / 240;
          let macroBizMult = 0.88;
          if (this.macroCycle.id === "Boom") macroBizMult = 1.12;
          else if (this.macroCycle.id === "Inflation") macroBizMult = 0.62;
          else if (this.macroCycle.id === "Recession") {
            macroBizMult = (this.stats.businessAcuity || 20) >= 75 ? 0.18 : -0.22;
          }
          const rawMonthly = item.monthlyPassivePerUnit * item.quantity * satFactor * overloadPenalty;
          if (macroBizMult >= 0) {
            posPassiveMonthly += Math.round(rawMonthly * macroBizMult * skillFactor);
          } else {
            bizLossAnnual += Math.round(rawMonthly * Math.abs(macroBizMult) * 12);
          }
        } else {
          // BĐS cho thuê cũng có tỷ lệ trống phòng mùa suy thoái
          const occupancy = this.macroCycle.id === "Recession" ? 0.74 : (this.macroCycle.id === "Inflation" ? 0.88 : 0.96);
          posPassiveMonthly += Math.round(item.monthlyPassivePerUnit * item.quantity * occupancy);
        }
      }

      // Tăng độ khó sinh hoạt phí: Tuổi trưởng thành (>=22t) bắt buộc tốn chi phí sinh tồn cơ bản dù thất nghiệp!
      const ownsHome = this.getHighestRealEstateTier() >= 1;
      const grossMonthlyInflow = this.stats.monthlyIncome + posPassiveMonthly;
      if (this.stats.age >= 18) {
        const minAdultFloor = this.stats.age >= 22
          ? Math.round(((ownsHome ? 2_100_000 : 3_500_000) + this.stats.childrenCount * 2_800_000) * infMult)
          : 0;

        if (grossMonthlyInflow > 0) {
          const baseRate = (ownsHome ? 0.40 : 0.50) + (this.macroCycle.id === "Inflation" ? 0.08 : 0);
          const rawLiving = Math.round(this.stats.monthlyIncome * baseRate + posPassiveMonthly * 0.24)
            + Math.round(this.stats.childrenCount * 3_200_000 * infMult);
          this.stats.monthlyExpense = Math.max(minAdultFloor, Math.min(rawLiving, Math.round(grossMonthlyInflow * 0.86)));
        } else {
          this.stats.monthlyExpense = minAdultFloor;
        }
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
        this.recordCashflow(annualPassiveIn, "passive", "Thu nhập thụ động ròng sau vận hành");
      }

      if (bizLossAnnual > 0) {
        this.stats.cash -= bizLossAnnual;
        this.recordCashflow(-bizLossAnnual, "upkeep", "Bù lỗ mặt bằng & nhân sự mùa suy thoái");
        this.addLog(`📉 Chuỗi kinh doanh ế ẩm thời suy thoái, phải bù lỗ vận hành -${formatVND(bizLossAnnual)}!`, "danger");
      }

      // Nguy cơ đóng cửa 1 cơ sở kinh doanh nhỏ khi suy thoái và thiếu kỹ năng quản trị
      if (this.macroCycle.id === "Recession" && totalBizUnits > 0 && (this.stats.businessAcuity || 20) < 58 && Math.random() < 0.20) {
        const riskyIdx = this.portfolio.findIndex((p) => p.category === "business");
        if (riskyIdx >= 0) {
          const closedBiz = this.portfolio[riskyIdx];
          const avgCost = Math.round(closedBiz.totalInvestedCost / closedBiz.quantity);
          closedBiz.totalInvestedCost -= avgCost;
          closedBiz.quantity -= 1;
          if (closedBiz.quantity <= 0) this.portfolio.splice(riskyIdx, 1);
          this.stats.stress += 10;
          this.addLog(`💥 Phá sản 1 cơ sở [${closedBiz.name}] do sức mua lao dốc và thiếu kinh nghiệm quản trị!`, "danger");
        }
      }

      if (this.stats.monthlyExpense > 0) {
        const annualLiving = this.stats.monthlyExpense * 12;
        this.stats.cash -= annualLiving;
        this.recordCashflow(-annualLiving, "living", "Thuê nhà & Sinh hoạt phí cả năm");
      }

      // Thuế Thu nhập Cá nhân & Bảo hiểm lũy tiến chặt chẽ hơn (từ 132 Triệu/năm, lên tới 35%)
      const annualGross = grossMonthlyInflow * 12;
      if (this.stats.age >= 18 && annualGross > 132_000_000) {
        let baseTaxRate = 0.12;
        if (annualGross > 5_000_000_000) baseTaxRate = 0.35;
        else if (annualGross > 1_800_000_000) baseTaxRate = 0.28;
        else if (annualGross > 500_000_000) baseTaxRate = 0.20;
        const literacyRelief = (this.stats.financialLiteracy || 0) * 0.0006;
        const effRate = Math.max(0.08, baseTaxRate - literacyRelief);
        const annualTax = Math.round((annualGross - 132_000_000) * effRate);
        if (annualTax > 0) {
          this.stats.cash -= annualTax;
          this.recordCashflow(-annualTax, "tax", "Thuế TNCN lũy tiến & Bảo hiểm");
        }
      }

      if (negUpkeepMonthly > 0) {
        const annualUpkeep = Math.round(negUpkeepMonthly * 12 * Math.min(2.2, infMult));
        this.stats.cash -= annualUpkeep;
        this.recordCashflow(-annualUpkeep, "upkeep", "Bảo dưỡng Xe & Du thuyền");
      }

      // Thuế tài sản & phí quản trị cơ ngơi hàng năm (áp dụng trên toàn bộ danh mục >= 1.5 Tỷ, kể cả khi thiếu tiền mặt)
      const curPortVal = this.getPortfolioValue();
      if (this.stats.age >= 22 && curPortVal >= 1_500_000_000) {
        const wealthRate = curPortVal >= 50_000_000_000 ? 0.016 : 0.011;
        const assetFee = Math.round(curPortVal * wealthRate);
        if (assetFee >= 1_000_000) {
          this.stats.cash -= assetFee;
          this.recordCashflow(-assetFee, "upkeep", "Thuế tài sản & phí quản trị cơ ngơi");
        }
      }

      for (const item of this.portfolio) {
        const def = (DATA.assets || []).find((a) => a.assetId === item.assetId);
        const baseRate = def ? def.annualAppreciationRate : 0.06;
        const vol = def ? def.volatility : 0.05;
        const skillEdge = (this.stats.financialLiteracy + this.stats.businessAcuity) * 0.00025;
        const swing = (Math.random() * 2 - 1) * vol * 1.15;
        const effective = baseRate >= 0
          ? (baseRate * 0.82 * this.macroCycle.mult + swing + skillEdge)
          : (baseRate + swing * 0.5);

        item.currentUnitValue = Math.max(1_000_000, Math.round(item.currentUnitValue * (1 + effective)));
      }

      // Lãi vay thả nổi theo vĩ mô + Cơ chế ngân hàng xiết nợ khi mất khả năng thanh toán
      if (this.stats.debt > 0) {
        const loanRate = this.getCurrentLoanRate();
        const ratePctLabel = (loanRate * 100).toFixed(1);
        const interest = Math.round(this.stats.debt * loanRate);
        if (this.stats.cash >= interest) {
          this.stats.cash -= interest;
          this.recordCashflow(-interest, "bank", `Trả lãi vay thả nổi (${ratePctLabel}%)`);
        } else {
          const paidCash = Math.max(0, this.stats.cash);
          this.stats.debt += (interest - paidCash);
          this.stats.cash = 0;
          if (paidCash > 0) {
            this.recordCashflow(-paidCash, "bank", `Trả một phần lãi vay (${ratePctLabel}%)`);
          }
          this.stats.stress += 12;
          this.addLog(`⚠️ Không đủ trả lãi vay (${ratePctLabel}%/năm), nợ gốc phình lên ${formatVND(this.stats.debt)}!`, "danger");

          // Xiết nợ (Foreclosure) nếu tổng nợ vượt ngưỡng an toàn 75% tài sản
          const collateral = this.getPortfolioValue();
          if (collateral > 0 && this.stats.debt > Math.max(80_000_000, collateral * 0.75)) {
            const seized = this.portfolio[this.portfolio.length - 1];
            const fireSaleVal = Math.round(seized.currentUnitValue * 0.80);
            const avgCost = Math.round(seized.totalInvestedCost / seized.quantity);
            seized.totalInvestedCost -= avgCost;
            seized.quantity -= 1;
            if (seized.quantity <= 0) this.portfolio.pop();

            const debtReduced = Math.min(this.stats.debt, fireSaleVal);
            this.stats.debt -= debtReduced;
            if (fireSaleVal > debtReduced) {
              this.stats.cash += (fireSaleVal - debtReduced);
            }
            this.stats.happiness -= 14;
            this.stats.socialStatus -= 8;
            this.recordCashflow(fireSaleVal, "bank", `Ngân hàng phát mãi [${seized.name}] (giá 80%)`);
            this.addLog(`🏦 XIẾT NỢ NGÂN HÀNG: Phát mãi 1 [${seized.name}] thu ${formatVND(fireSaleVal)} (chiết khấu 20%) để cấn trừ nợ quá hạn!`, "danger");
          }
        }
      }

      this.clampStats();
      const net = this.getNetWorth();
      if (net > this.stats.peakNetWorth) {
        this.stats.peakNetWorth = net;
      }

      // Đối thủ Tỷ phú AI tăng trưởng quyết liệt hơn
      if (this.rivals.length === 0) this.rivals = this.createInitialRivals();
      for (const rival of this.rivals) {
        const baseRivalGrowth = this.macroCycle.id === "Recession" ? 0.025 : 0.068 * Math.max(0.6, this.macroCycle.mult);
        const growth = baseRivalGrowth + (Math.random() * 0.09 - 0.025);
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

      for (let i = this.relationships.length - 1; i >= 0; i--) {
        const npc = this.relationships[i];
        if (!npc.isAlive) continue;
        npc.age += 1;

        // Độ thân thiết giảm dần nếu bỏ bê hoặc căng thẳng cao -> nguy cơ chia tay / ly hôn chia tài sản
        if (this.stats.age >= 18 && (npc.role === "Người yêu" || npc.role === "Vợ/Chồng")) {
          const neglect = (this.stats.stress >= 75 ? 6 : 3) + randInt(0, 3);
          npc.closeness = clamp(npc.closeness - neglect, 0, 100);

          if (npc.role === "Người yêu" && npc.closeness < 30 && Math.random() < 0.45) {
            this.relationships.splice(i, 1);
            this.stats.maritalStatus = "Độc thân";
            this.stats.happiness -= 14;
            this.addLog(`💔 Mối tình với ${npc.fullName} tan vỡ vì thiếu sự quan tâm vun đắp!`, "danger");
            continue;
          }
          if (npc.role === "Vợ/Chồng" && npc.closeness < 26 && Math.random() < 0.35) {
            const settlement = Math.round(this.stats.cash * 0.35);
            this.stats.cash -= settlement;
            if (settlement > 0) {
              this.recordCashflow(-settlement, "social", `Phân chia tài sản ly hôn với ${npc.fullName}`);
            }
            this.relationships.splice(i, 1);
            this.stats.maritalStatus = "Đã ly hôn";
            this.stats.spouseName = "";
            this.stats.happiness -= 22;
            this.stats.stress += 12;
            this.addLog(`⚖️ Hôn nhân đổ vỡ với ${npc.fullName}! Bạn mất -${formatVND(settlement)} phân chia tài sản sau ly hôn.`, "danger");
            continue;
          }
        }

        if ((npc.role === "Cha" || npc.role === "Mẹ") && npc.age > 78 && Math.random() < 0.14) {
          npc.isAlive = false;
          this.stats.happiness -= 18;
          this.addLog(`🕯️ ${npc.role} (${npc.fullName}) qua đời ở tuổi ${npc.age}.`, "danger");
        }
      }

      this.clampStats();
    }

    processAnnualHealth() {
      if (this.stats.stress >= 82) {
        this.stats.health -= 8;
        this.stats.happiness -= 9;
        this.addLog("⚠️ Căng thẳng kéo dài đang bào mòn sức khỏe của bạn!", "danger");
      }

      // Cấp cứu y tế đắt đỏ khi kiệt sức hoặc sức khỏe suy kiệt ở tuổi trưởng thành
      if (this.stats.age >= 20 && (this.stats.stress >= 88 || this.stats.health <= 28) && Math.random() < 0.32) {
        const wealthShare = Math.round(Math.max(0, this.getNetWorth()) * 0.03);
        const medBill = clamp(Math.max(6_000_000, wealthShare), 6_000_000, 450_000_000);
        this.stats.cash -= medBill;
        this.recordCashflow(-medBill, "living", "Viện phí cấp cứu suy nhược / bệnh nặng");
        this.stats.health -= 6;
        this.addLog(`🏥 Nhập viện điều trị khẩn cấp vì suy kiệt! Viện phí: -${formatVND(medBill)}.`, "danger");
      }

      if (this.stats.age > 48) {
        const decay = this.stats.age > 72 ? randInt(4, 9) : randInt(2, 5);
        this.stats.health -= decay;
      }

      if (this.stats.age >= 83 && Math.random() < (this.stats.age - 78) * 0.045) {
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
      if (this.stats.age >= 19 && this.stats.cash >= 15_000_000 && expenseEvents.length > 0 && Math.random() < 0.45) {
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
          w *= passed ? (1.22 + (this.stats.luck - 50) * 0.004) : 0.45;
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
        const earned = 1_500_000 + (this.stats.practicalSkills + this.stats.intelligence) * 70_000;
        this.stats.cash += earned;
        this.recordCashflow(earned, "salary", "Làm dự án tự do ngoài giờ");
        this.stats.practicalSkills += 4;
        this.stats.stress += 12;
        this.stats.health -= 3;
        msg = `💻 Làm dự án tự do ngoài giờ (+${formatVND(earned)}, +12 Lo âu).`;
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
      const chance = clamp(
        0.58 + (this.stats.charisma - career.minCharisma) * 0.005 + (this.stats.intelligence - career.minIntelligence) * 0.004,
        0.35, 0.96
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

    getAssetBuyFee(def) {
      if (def.category === "real_estate" || def.category === "business") {
        return Math.round(def.cost * 0.02);
      }
      return 0;
    }

    buyAsset(def) {
      if (this.stats.age < 18) {
        this.showToast("Cần đủ 18 tuổi để đứng tên mua tài sản.");
        return;
      }
      const buyFee = this.getAssetBuyFee(def);
      const totalCost = def.cost + buyFee;
      if (this.stats.cash < totalCost) {
        this.showToast(`Không đủ tiền mặt! Cần ${formatVND(totalCost)} (gồm ${buyFee > 0 ? "2% phí pháp lý" : "giá gốc"}).`);
        return;
      }

      this.stats.cash -= totalCost;
      this.recordCashflow(-totalCost, "asset", `Mua: ${def.name}${buyFee > 0 ? " (+2% phí)" : ""}`);
      const existing = this.portfolio.find((p) => p.assetId === def.assetId);
      if (existing) {
        existing.quantity += 1;
        existing.totalInvestedCost += totalCost;
      } else {
        this.portfolio.push({
          assetId: def.assetId,
          name: def.name,
          category: def.category,
          tier: def.tier,
          quantity: 1,
          totalInvestedCost: totalCost,
          currentUnitValue: def.cost,
          monthlyPassivePerUnit: def.monthlyPassiveIncome
        });
      }

      this.stats.happiness += def.happinessBonus;
      this.stats.socialStatus += def.socialStatusBonus;
      this.stats.financialLiteracy += 3;
      this.clampStats();
      this.checkAchievements();

      this.addLog(`🏛️ Mua thành công [${def.name}] tổng chi ${formatVND(totalCost)}.`, "milestone");
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
      const grossProceeds = item.currentUnitValue;
      const avgCost = Math.round(item.totalInvestedCost / item.quantity);
      const brokerFee = item.assetId === "inv_bank_saving" ? 0 : Math.round(grossProceeds * 0.02);
      const rawProfit = grossProceeds - brokerFee - avgCost;
      const capGainsTax = (item.assetId !== "inv_bank_saving" && rawProfit > 0) ? Math.round(rawProfit * 0.10) : 0;
      const netProceeds = Math.max(0, grossProceeds - brokerFee - capGainsTax);
      const netProfit = netProceeds - avgCost;

      this.stats.cash += netProceeds;
      this.recordCashflow(netProceeds, "asset", `Bán ròng: ${item.name}`);
      item.totalInvestedCost -= avgCost;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.portfolio.splice(idx, 1);
      }

      this.stats.financialLiteracy += 2;
      this.clampStats();
      const pnl = netProfit >= 0 ? `Lãi ròng +${formatVND(netProfit)}` : `Lỗ ${formatVND(netProfit)}`;
      this.addLog(`💰 Bán 1 [${item.name}] thực nhận ${formatVND(netProceeds)} sau phí & thuế (${pnl}).`);
      this.showToast(`💰 Đã bán thực nhận ${formatVND(netProceeds)} (${pnl})`);
      if (window.ZTBAudio) window.ZTBAudio.coin();
      this.saveToStorage();
      this.publishPlayerToLiveBoard(false);
      this.renderAll();
    }

    getMaxLoanLimit() {
      const base = Math.max(0, Math.floor(this.getNetWorth() * 0.38) + this.stats.monthlyIncome * 18);
      return Math.max(15_000_000, base);
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

    getEstateKeepRatio() {
      if (this.flags.family_trust_protected) return 1.0;
      const net = this.getNetWorth();
      if (net >= 100_000_000_000) return 0.65;
      if (net >= 10_000_000_000) return 0.75;
      return 0.85;
    }

    inheritWithChild(child) {
      const hasElite = !!this.flags.heir_elite_trained;
      const ratio = this.getEstateKeepRatio();
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
      const keepPct = Math.round(this.getEstateKeepRatio() * 100);
      el("gameover-summary").innerHTML = `
        <strong>${escapeHtml(this.stats.characterName)}</strong> (Đời thứ ${this.stats.generation})<br/>
        • Hưởng thọ: <strong>${this.stats.age} tuổi</strong> — ${escapeHtml(this.stats.causeOfDeath)}<br/>
        • Nghề nghiệp cuối cùng: <strong>${escapeHtml(this.stats.currentJob)}</strong><br/>
        • Tài sản ròng đỉnh cao: <strong style="color:#fbbf24;">${formatVND(this.stats.peakNetWorth)}</strong><br/>
        • Di sản để lại (${this.flags.family_trust_protected ? "100% nhờ Quỹ tín thác" : `${keepPct}% sau thuế thừa kế lũy tiến`}): <strong style="color:#34d399;">${formatVND(net)}</strong>
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
              <div class="item-meta">Kế thừa bất động sản, doanh nghiệp &amp; ${keepPct}% tiền mặt</div>
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
      const usedRewinds = this.stats.rewindsUsed || 0;
      const freeRewindsLeft = Math.max(0, FREE_TIME_MACHINE_LIMIT - usedRewinds);
      const tmBadge = el("time-machine-count");
      const tmBtn = el("btn-time-machine");
      if (freeRewindsLeft > 0) {
        tmBadge.textContent = String(freeRewindsLeft);
        tmBadge.classList.remove("paid");
        tmBtn.title = `Cỗ Máy Thời Gian: Còn ${freeRewindsLeft}/${FREE_TIME_MACHINE_LIMIT} lượt lùi tuổi miễn phí`;
      } else {
        tmBadge.textContent = "💸";
        tmBadge.classList.add("paid");
        tmBtn.title = "Đã hết 5 lượt miễn phí — Bấm để đánh đổi Tài sản lùi tuổi thêm!";
      }
      tmBtn.disabled = this.timeMachine.length === 0;
    }

    renderHUD() {
      const s = this.stats;
      el("hud-name").textContent = `${s.characterName} (${s.gender})`;
      el("hud-vip-badge").classList.toggle("hidden", !this.monetization.vipForever);
      el("hud-job").textContent = s.currentJob;
      el("hud-macro").textContent = this.macroCycle.label;
      el("autosave-indicator").textContent = `✓ ${this.lastSavedLabel}`;

      const liveSnap = window.ZTBLiveBoard
        ? window.ZTBLiveBoard.getLeaderboardSnapshot()
        : { connected: false, onlineCount: 1 };
      const onlinePill = el("hud-online-pill");
      onlinePill.textContent = liveSnap.connected
        ? `🟢 ${liveSnap.onlineCount} online`
        : `🟡 ${liveSnap.onlineCount} local`;
      onlinePill.classList.toggle("offline", !liveSnap.connected);

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

      if (!s.isAlive) {
        text = "🕯️ Nhân vật đã qua đời. Hãy chọn con cháu kế thừa hoặc bắt đầu kiếp mới!";
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

      curCard.innerHTML = `
        <div class="section-title">
          <span>🪪 Trạng thái Nghề nghiệp &amp; Học vấn</span>
          <span style="color:#93c5fd;">${escapeHtml(s.educationLevel)}</span>
        </div>
        <div class="item-title" style="font-size:14px;">${escapeHtml(s.currentJob)}</div>
        <div class="item-meta" style="margin-top:4px;">
          Lương: <strong style="color:#34d399;">${formatVND(s.monthlyIncome)}/tháng</strong> •
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
          Thu nhập thụ động: <strong style="color:#34d399;">${formatVND(passive)}/tháng</strong>
        </div>
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
        const curLoanPct = (this.getCurrentLoanRate() * 100).toFixed(1);
        const bankCard = el("bank-desk-card");
        bankCard.innerHTML = `
          <div class="section-title">
            <span>🏦 Tín dụng Thả nổi (${curLoanPct}%/năm)</span>
            <span>Hạn mức còn: ${formatVND(availLoan)}</span>
          </div>
          <div class="item-meta" style="margin-bottom:6px;">Lãi suất biến động theo chu kỳ vĩ mô (8.5% – 12.5%/năm). Nếu nợ vượt 75% tài sản mà mất khả năng trả lãi, ngân hàng sẽ phát mãi tài sản (giá 80%)!</div>
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

          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(item.name)} (x${item.quantity})</div>
              <div class="item-meta">
                Giá trị: <strong>${formatVND(item.currentUnitValue)}</strong>
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
          const buyFee = this.getAssetBuyFee(def);
          const totalCost = def.cost + buyFee;
          const canBuy = this.stats.isAlive && this.stats.age >= 18 && this.stats.cash >= totalCost;
          const row = document.createElement("div");
          row.className = "item-row";
          row.innerHTML = `
            <div class="item-info">
              <div class="item-title">${escapeHtml(def.name)}</div>
              <div class="item-meta">
                Giá: <strong style="color:#fbbf24;">${formatVND(def.cost)}</strong>${buyFee > 0 ? ` <span style="color:#94a3b8;">(+2% phí)</span>` : ""} •
                Thụ động: ${formatVND(def.monthlyPassiveIncome)}/th •
                Tăng TB: ${(def.annualAppreciationRate * 100).toFixed(1)}%/năm<br/>
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

        el("live-active-count-badge").innerHTML = `
          <span class="pulse-dot" style="${snap.connected ? "" : "background:#f59e0b;"}"></span>
          <span>Đang hoạt động trực tuyến: <strong>${snap.onlineCount} người chơi</strong></span>
        `;
        el("live-board-status").innerHTML = snap.connected
          ? `🟢 Đã kết nối máy chủ Live (${escapeHtml(snap.brokerHost)}) • Tổng ${snap.totalPlayers} người chơi đã ghi danh`
          : `🟡 Chế độ cục bộ / Đang kết nối máy chủ • ${snap.totalPlayers} người chơi đã lưu`;

        el("leaderboard-list-title").textContent = `🌐 Bảng Xếp Hạng Người Chơi Thực (${snap.entries.length})`;

        const rankIdx = snap.entries.findIndex((x) => x.isPlayer);
        const rank = rankIdx >= 0 ? rankIdx + 1 : 1;
        const hero = el("leaderboard-hero-card");

        if (snap.entries.length <= 1) {
          hero.innerHTML = `
            <div class="section-title"><span>🌐 Thứ hạng Người Chơi Thực</span><span style="color:#fbbf24;">Hạng #1 / 1</span></div>
            <div class="item-meta">Hiện có <strong>${snap.onlineCount} người chơi</strong> đang hoạt động. Khi có người chơi thực khác mở game trên thiết bị bất kỳ, số người đang online và tài sản ròng của họ sẽ tự động đồng bộ trực tiếp tại đây!</div>
          `;
        } else if (rank === 1) {
          hero.innerHTML = `
            <div class="section-title"><span>👑 QUÁN QUÂN NGƯỜI CHƠI</span><span style="color:#fbbf24;">Hạng #1 / ${snap.entries.length}</span></div>
            <div class="item-meta">Bạn đang dẫn đầu toàn bộ <strong>${snap.entries.length}</strong> người chơi thực (<strong>${snap.onlineCount} đang hoạt động</strong>) với tài sản ròng <strong style="color:#34d399;">${formatVND(playerNet)}</strong>!</div>
          `;
        } else {
          const nextP = snap.entries[rankIdx - 1];
          const gap = Math.max(0, nextP.netWorth - playerNet);
          const pct = nextP.netWorth > 0 ? clamp((playerNet / nextP.netWorth) * 100, 0, 100) : 100;
          hero.innerHTML = `
            <div class="section-title"><span>🌐 Thứ hạng Người Chơi Thực</span><span style="color:#fbbf24;">Hạng #${rank} / ${snap.entries.length}</span></div>
            <div class="item-meta" style="margin-bottom:6px;">
              Đang hoạt động: <strong style="color:#34d399;">${snap.onlineCount} người chơi</strong> •
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
          const rawDeltaMin = Math.floor((Date.now() - (entry.ts || Date.now())) / 60000);
          const offlineLabel = rawDeltaMin > 0
            ? (rawDeltaMin < 60 ? `${rawDeltaMin}p trước` : (rawDeltaMin < 1440 ? `${Math.floor(rawDeltaMin / 60)}g trước` : `${Math.floor(rawDeltaMin / 1440)} ngày trước`))
            : "Ngoại tuyến";
          const presence = entry.isOnline
            ? `<span style="color:#34d399;">🟢 Đang hoạt động</span>`
            : `<span style="color:#94a3b8;">⚪ ${offlineLabel}</span>`;
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
