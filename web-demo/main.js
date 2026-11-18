const $ = (selector) => document.querySelector(selector);
const sceneHost = $("#scene");
const canvas = document.createElement("canvas");
canvas.id = "pixel-scene";
if (sceneHost) sceneHost.appendChild(canvas);
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
const portrait = $("#character-portrait");
const portraitContext = portrait ? portrait.getContext("2d") : null;
if (portraitContext) portraitContext.imageSmoothingEnabled = false;

const translations = {
  "HỒ SƠ NHÂN VẬT": "CHARACTER PROFILE", "Tuổi · ngày": "Age · day", "Tài sản": "Assets",
  "Sức khỏe": "Health", "Hạnh phúc": "Happiness", "Năng lượng": "Energy",
  "HỌC VẤN HIỆN TẠI": "CURRENT EDUCATION", "THỜI GIAN": "TIME", "Tua đến năm tiếp theo": "Skip to next year",
  "Bắt đầu lại": "Restart", "SỰ KIỆN": "EVENT", "Hãy chọn một phương án để tiếp tục.": "Choose an option to continue.",
  "NHỊP SỐNG TRONG NĂM": "YEAR RHYTHM", "Sống đủ 12 ngày để mở khóa bước sang tuổi mới.": "Live through 12 days to unlock the next age.",
  "Chọn hoàn cảnh xuất phát": "Choose your starting background", "BẮT ĐẦU CUỘC ĐỜI": "START LIFE",
  "Bản thử nghiệm: sinh ra → hết cấp 3": "Prototype: birth → high school graduation",
  "Mỗi năm là một ngã rẽ. Hãy sống, học, làm việc và chịu trách nhiệm với lựa chọn của bạn.": "Every year is a crossroads. Live, learn, work and own your choices.",
  "Gia đình đủ đầy": "Comfortable family", "Mồ côi": "Orphaned", "Ngẫu nhiên": "Random",
  "Cân bằng · 10 triệu đ": "Balanced · 10M VND", "Khó khăn · nhiều học bổng": "Difficult · more scholarships",
  "Tung xúc xắc số phận": "Roll the dice of fate", "Em bé đang lớn": "Growing child", "Học sinh tiểu học": "Elementary student",
  "Học sinh trung học": "High school student", "Người trẻ khởi nghiệp": "Young entrepreneur", "Giám đốc doanh nghiệp": "Business director",
  "✦ Đại gia mới nổi": "✦ Rising tycoon", "Tiểu học": "Elementary school", "THCS": "Middle school", "THPT": "High school",
  "Chưa đi học": "Not enrolled", "Đại học": "University", "Học nghề": "Vocational training",
  "CỘT MỐC": "MILESTONE", "TUỔI THƠ": "CHILDHOOD", "TUỔI MỚI LỚN": "TEEN YEARS", "BƯỚC NGOẶT": "TURNING POINT", "TƯƠNG LAI": "FUTURE",
  "MỘT NGÀY MỚI": "A NEW DAY", "NĂM ĐÃ SẴN SÀNG": "YEAR COMPLETE", "MỘT NGÃ RẼ": "A NEW CHAPTER",
  "Ngày đầu đến trường": "First day at school", "Áp lực điểm số": "Grade pressure", "Một nhóm bạn mới": "A new friend group",
  "Kỳ thi vào cấp ba": "High school entrance exam", "Cánh cửa sau cấp ba": "The door after high school",
  "Cô giáo hỏi bạn muốn trở thành người như thế nào. Đây là nơi thói quen học tập bắt đầu.": "Your teacher asks who you want to become. This is where your study habits begin.",
  "Một bài kiểm tra khó khiến bạn phải chọn giữa nỗ lực thêm hay bỏ cuộc.": "A difficult test makes you choose between extra effort and giving up.",
  "Bạn được rủ tham gia một nhóm bạn có nhiều năng lượng nhưng cũng nhiều cám dỗ.": "You are invited into a lively friend group with plenty of temptations.",
  "Nhiều tháng chuẩn bị giờ được quyết định trong một kỳ thi.": "Months of preparation now come down to one exam.",
  "Bạn đã đến mốc kết thúc vertical slice. Con đường tiếp theo sẽ là đại học, học nghề hoặc đi làm.": "You reached the end of this vertical slice. Next comes university, vocational training or work.",
  "Chăm chỉ học": "Study hard", "Kết bạn trước": "Make friends first", "Ôn bài đến tối": "Study until night",
  "Xin người lớn giúp": "Ask an adult for help", "Tham gia có chọn lọc": "Join selectively", "Chỉ tập trung học": "Focus only on study",
  "Thi trường top": "Apply to a top school", "Chọn nơi vừa sức": "Choose a balanced school", "Học đại học": "Go to university", "Học nghề và đi làm": "Learn a trade and work",
  "Bạn hình thành thói quen tốt.": "You build a good habit.", "Bạn trở nên cởi mở và được yêu mến.": "You become open and well-liked.",
  "Điểm số tăng nhưng bạn hơi mệt.": "Your grades rise, but you feel tired.", "Bạn học được cách tìm sự hỗ trợ.": "You learn to ask for support.",
  "Bạn giữ được cân bằng giữa bạn bè và học tập.": "You balance friends and study.", "Thành tích tốt hơn nhưng bạn thấy cô đơn.": "Results improve, but you feel lonely.",
  "Bạn bước vào môi trường cạnh tranh.": "You enter a competitive environment.", "Bạn có thời gian phát triển nhiều kỹ năng khác.": "You have time to build other skills.",
  "Bạn đầu tư cho tương lai dài hạn.": "You invest in your long-term future.", "Bạn bắt đầu kiếm tiền sớm.": "You start earning money early."
};

const copy = {
  vi: { sound: "🔊 Âm thanh: Bật", muted: "🔇 Âm thanh: Tắt", menu: "Mở menu", close: "Đóng menu", home: "⌂ Về màn hình đầu" },
  en: { sound: "🔊 Sound: On", muted: "🔇 Sound: Off", menu: "Open menu", close: "Close menu", home: "⌂ Back to start" }
};

const origins = {
  balanced: { label: "Gia đình đủ đầy", hint: "Cân bằng · 10 triệu đ", cash: 10_000_000, health: 88, happiness: 82, intelligence: 52 },
  orphan: { label: "Mồ côi", hint: "Khó khăn · nhiều học bổng", cash: 0, health: 74, happiness: 58, intelligence: 48 },
  random: { label: "Ngẫu nhiên", hint: "Tung xúc xắc số phận", cash: 0, health: 80, happiness: 72, intelligence: 50 }
};

const state = {
  age: 0,
  day: 0,
  cash: 0,
  health: 90,
  happiness: 80,
  intelligence: 50,
  discipline: 50,
  stress: 10,
  energy: 82,
  education: "Chưa đi học",
  origin: "balanced",
  speed: 0,
  yearProgress: 0,
  eventOpen: false,
  started: false,
  sceneAction: "home",
  visual: {
    hair: "#24150f",
    outfit: "#3475d1",
    accessory: false,
    glasses: false,
    smile: false,
    expression: "neutral"
  },
  language: localStorage.getItem("life-language") || "vi",
  sound: localStorage.getItem("life-sound") !== "off"
};

function tr(value) {
  return state.language === "en" ? (translations[value] || value) : value;
}

function applyLanguage() {
  const ids = {
    "profile-eyebrow": "HỒ SƠ NHÂN VẬT", "label-age": "Tuổi · ngày", "label-cash": "Tài sản",
    "label-health": "Sức khỏe", "label-happiness": "Hạnh phúc", "label-energy": "Năng lượng",
    "education-label": "HỌC VẤN HIỆN TẠI", "time-label": "THỜI GIAN", "reset": "Bắt đầu lại",
    "origin-label": "Chọn hoàn cảnh xuất phát", "start-copy": "Mỗi năm là một ngã rẽ. Hãy sống, học, làm việc và chịu trách nhiệm với lựa chọn của bạn.",
    "start-game": "BẮT ĐẦU CUỘC ĐỜI", "start-hint": "Bản thử nghiệm: sinh ra → hết cấp 3", "choice-required": "Hãy chọn một phương án để tiếp tục.",
    "year-progress-label": "NHỊP SỐNG TRONG NĂM", "year-progress-hint": "Sống đủ 12 ngày để mở khóa bước sang tuổi mới."
  };
  Object.entries(ids).forEach(([id, value]) => { const node = $(`#${id}`); if (node) node.textContent = tr(value); });
  const ageButton = $("#age-up");
  if (ageButton) ageButton.textContent = `⏩ ${tr("Tua đến năm tiếp theo").toUpperCase()}`;
  document.querySelectorAll(".origin-option").forEach((button) => {
    const origin = origins[button.dataset.origin];
    if (!origin) return;
    const strong = button.querySelector("strong");
    const small = button.querySelector("small");
    strong.textContent = tr(origin.label);
    small.textContent = tr(origin.hint);
  });
  const soundToggle = $("#sound-toggle");
  const menuButton = $("#menu-button");
  const closeMenu = $("#close-menu");
  const backHome = $("#back-home");
  if (soundToggle) soundToggle.textContent = state.sound ? copy[state.language].sound : copy[state.language].muted;
  if (menuButton) menuButton.setAttribute("aria-label", copy[state.language].menu);
  if (closeMenu) closeMenu.setAttribute("aria-label", copy[state.language].close);
  if (backHome) backHome.textContent = copy[state.language].home;
  document.querySelectorAll(".language-button").forEach((button) => button.classList.toggle("is-active", button.id === `lang-${state.language}`));
  if (state.started) updatePanel($("#life-log").textContent);
}

const events = [
  {
    category: "CỘT MỐC",
    minAge: 6,
    title: "Ngày đầu đến trường",
    description: "Cô giáo hỏi bạn muốn trở thành người như thế nào. Đây là nơi thói quen học tập bắt đầu.",
    options: [
      {
        label: "Chăm chỉ học",
        result: "Bạn hình thành thói quen tốt.",
        effects: { intelligence: 8, discipline: 7, happiness: 2 },
        visual: { glasses: true, outfit: "#3475d1", expression: "focused" }
      },
      {
        label: "Kết bạn trước",
        result: "Bạn trở nên cởi mở và được yêu mến.",
        effects: { happiness: 8, intelligence: 2 },
        visual: { smile: true, hair: "#5b2b18", outfit: "#d85d70", expression: "happy" }
      }
    ]
  },
  {
    category: "TUỔI THƠ",
    minAge: 10,
    title: "Áp lực điểm số",
    description: "Một bài kiểm tra khó khiến bạn phải chọn giữa nỗ lực thêm hay bỏ cuộc.",
    options: [
      {
        label: "Ôn bài đến tối",
        result: "Điểm số tăng nhưng bạn hơi mệt.",
        effects: { intelligence: 10, discipline: 4, energy: -12, stress: 8 },
        visual: { glasses: true, expression: "focused" }
      },
      {
        label: "Xin người lớn giúp",
        result: "Bạn học được cách tìm sự hỗ trợ.",
        effects: { happiness: 5, stress: -8, intelligence: 4 },
        visual: { smile: true, expression: "happy" }
      }
    ]
  },
  {
    category: "TUỔI MỚI LỚN",
    minAge: 13,
    title: "Một nhóm bạn mới",
    description: "Bạn được rủ tham gia một nhóm bạn có nhiều năng lượng nhưng cũng nhiều cám dỗ.",
    options: [
      {
        label: "Tham gia có chọn lọc",
        result: "Bạn giữ được cân bằng giữa bạn bè và học tập.",
        effects: { happiness: 7, discipline: 3 },
        visual: { hair: "#6d3420", outfit: "#1d8a78", smile: true, expression: "happy" }
      },
      {
        label: "Chỉ tập trung học",
        result: "Thành tích tốt hơn nhưng bạn thấy cô đơn.",
        effects: { intelligence: 8, happiness: -4, discipline: 6 },
        visual: { glasses: true, outfit: "#4b55a5", expression: "focused" }
      }
    ]
  },
  {
    category: "BƯỚC NGOẶT",
    minAge: 15,
    title: "Kỳ thi vào cấp ba",
    description: "Nhiều tháng chuẩn bị giờ được quyết định trong một kỳ thi.",
    options: [
      {
        label: "Thi trường top",
        result: "Bạn bước vào môi trường cạnh tranh.",
        effects: { intelligence: 8, stress: 12, education: "THPT chuyên" },
        visual: { glasses: true, outfit: "#7a4db3", accessory: true, expression: "focused" }
      },
      {
        label: "Chọn nơi vừa sức",
        result: "Bạn có thời gian phát triển nhiều kỹ năng khác.",
        effects: { happiness: 6, stress: -5, education: "THPT" },
        visual: { smile: true, outfit: "#1d8a78", expression: "happy" }
      }
    ]
  },
  {
    category: "TƯƠNG LAI",
    minAge: 18,
    title: "Cánh cửa sau cấp ba",
    description: "Bạn đã đến mốc kết thúc vertical slice. Con đường tiếp theo sẽ là đại học, học nghề hoặc đi làm.",
    options: [
      {
        label: "Học đại học",
        result: "Bạn đầu tư cho tương lai dài hạn.",
        effects: { education: "Đại học", cash: -5_000_000, intelligence: 8 },
        visual: { glasses: true, outfit: "#263f91", accessory: true, expression: "focused" }
      },
      {
        label: "Học nghề và đi làm",
        result: "Bạn bắt đầu kiếm tiền sớm.",
        effects: { education: "Học nghề", cash: 15_000_000, discipline: 8 },
        visual: { outfit: "#d17a35", accessory: true, smile: true, expression: "happy" }
      }
    ]
  }
];

function resize() {
  const width = Math.max(320, sceneHost.clientWidth);
  const height = Math.max(320, sceneHost.clientHeight);
  canvas.width = 320;
  canvas.height = Math.max(240, Math.round(320 * height / width));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.imageSmoothingEnabled = false;
}

function drawPixelScene(time) {
  const width = canvas.width;
  const height = canvas.height;
  const floorY = Math.round(height * 0.72);
  context.clearRect(0, 0, width, height);

  context.fillStyle = "#0b0e1e";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#171b31";
  context.fillRect(0, 0, width, floorY);
  context.fillStyle = "#222846";
  context.fillRect(0, floorY, width, height - floorY);

  for (let x = 0; x < width; x += 16) {
    context.fillStyle = x % 32 === 0 ? "#2b3158" : "#252b4c";
    context.fillRect(x, floorY, 1, height - floorY);
  }
  for (let y = floorY; y < height; y += 12) {
    context.fillStyle = "#1c2240";
    context.fillRect(0, y, width, 1);
  }

  drawWindow(width - 72, 30);
  drawFurniture(floorY);
  drawSceneAction(floorY);
  drawPixelCharacter(Math.round(width * 0.5), floorY - 5, time);
  drawSparkles(time);
}

function drawWindow(x, y) {
  context.fillStyle = "#10152c";
  context.fillRect(x, y, 52, 65);
  context.fillStyle = "#33477a";
  context.fillRect(x + 5, y + 5, 42, 48);
  context.fillStyle = "#6b9bc3";
  context.fillRect(x + 8, y + 8, 36, 22);
  context.fillStyle = "#26365f";
  context.fillRect(x + 8, y + 35, 36, 15);
  context.fillStyle = "#f5c66b";
  context.fillRect(x + 7, y + 55, 38, 4);
}

function drawFurniture(floorY) {
  const rich = state.cash >= 100_000_000;
  context.fillStyle = rich ? "#59402b" : "#342b45";
  context.fillRect(20, floorY - 55, 72, 42);
  context.fillStyle = rich ? "#bd7b42" : "#6e4a68";
  context.fillRect(25, floorY - 50, 62, 18);
  context.fillStyle = "#151a31";
  context.fillRect(30, floorY - 26, 7, 26);
  context.fillRect(79, floorY - 26, 7, 26);
  context.fillStyle = "#0c1020";
  context.fillRect(220, floorY - 35, 55, 35);
  context.fillStyle = "#4b55a5";
  context.fillRect(226, floorY - 29, 43, 19);
  context.fillStyle = "#f5c66b";
  context.fillRect(243, floorY - 5, 8, 5);
}

function drawSceneAction(floorY) {
  const action = state.sceneAction;
  if (action === "school" || action === "study") {
    context.fillStyle = "#151a31";
    context.fillRect(112, floorY - 44, 58, 28);
    context.fillStyle = action === "school" ? "#4c6db6" : "#b77a3f";
    context.fillRect(118, floorY - 39, 46, 17);
    context.fillStyle = "#f5c66b";
    context.fillRect(139, floorY - 18, 8, 3);
  }
  if (action === "friends") {
    context.fillStyle = "#d28b5b";
    context.fillRect(94, floorY - 78, 8, 18);
    context.fillRect(188, floorY - 76, 8, 18);
    context.fillStyle = "#d85d70";
    context.fillRect(91, floorY - 60, 14, 17);
    context.fillStyle = "#1d8a78";
    context.fillRect(185, floorY - 58, 14, 15);
  }
  if (action === "reflection") {
    context.fillStyle = "#f5c66b";
    context.fillRect(145, floorY - 82, 30, 2);
    context.fillRect(159, floorY - 96, 2, 30);
  }
}

function drawPixelCharacter(centerX, baseY, time) {
  const scale = state.age < 6 ? 0.72 : state.age < 12 ? 0.86 : state.age < 18 ? 0.95 : 1;
  const bounce = Math.round(Math.sin(time * 2) * 2);
  const x = centerX - Math.round(34 * scale);
  const y = baseY - Math.round(118 * scale) + bounce;
  const s = scale;
  const pixel = (color, px, py, pw, ph) => {
    context.fillStyle = color;
    context.fillRect(Math.round(x + px * s), Math.round(y + py * s), Math.max(1, Math.round(pw * s)), Math.max(1, Math.round(ph * s)));
  };

  pixel("#090b17", 14, 111, 42, 5);
  pixel(state.visual.outfit, 18, 60, 32, 46);
  pixel("#d28b5b", 6, 62, 12, 35);
  pixel("#d28b5b", 50, 62, 12, 35);
  pixel("#172342", 20, 103, 11, 31);
  pixel("#172342", 37, 103, 11, 31);
  pixel("#090b12", 17, 130, 16, 7);
  pixel("#090b12", 37, 130, 16, 7);
  pixel("#d28b5b", 20, 25, 30, 34);
  pixel(state.visual.hair, 17, 18, 37, 14);
  pixel(state.visual.hair, 13, 25, 7, 15);
  pixel(state.visual.hair, 50, 25, 7, 15);
  pixel("#111525", 24, 39, 5, 4);
  pixel("#111525", 41, 39, 5, 4);
  pixel(state.visual.smile ? "#8f263d" : "#5c2832", 30, 49, state.visual.smile ? 12 : 7, 3);

  if (state.visual.glasses) {
    pixel("#223658", 19, 34, 15, 8);
    pixel("#223658", 40, 34, 15, 8);
    pixel("#8bc5df", 22, 36, 9, 4);
    pixel("#8bc5df", 43, 36, 9, 4);
    pixel("#223658", 34, 36, 7, 2);
  }

  if (state.visual.accessory) {
    pixel("#f5c04f", 54, 74, 6, 8);
    pixel("#f5c04f", 28, 62, 8, 4);
  }
  if (state.visual.expression === "focused") {
    pixel("#f5c66b", 20, 14, 8, 3);
    pixel("#f5c66b", 42, 14, 8, 3);
  }
}

function drawPortrait() {
  if (!portraitContext) return;
  const ctx = portraitContext;
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = "#171b31";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#222846";
  ctx.fillRect(0, 88, 128, 40);
  const scale = 0.82;
  const x = 64 - Math.round(34 * scale);
  const y = 5;
  const pixel = (color, px, py, pw, ph) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x + px * scale), Math.round(y + py * scale), Math.max(1, Math.round(pw * scale)), Math.max(1, Math.round(ph * scale)));
  };
  pixel("#090b17", 14, 111, 42, 5);
  pixel(state.visual.outfit, 18, 60, 32, 46);
  pixel("#d28b5b", 6, 62, 12, 35); pixel("#d28b5b", 50, 62, 12, 35);
  pixel("#172342", 20, 103, 11, 31); pixel("#172342", 37, 103, 11, 31);
  pixel("#090b12", 17, 130, 16, 7); pixel("#090b12", 37, 130, 16, 7);
  pixel("#d28b5b", 20, 25, 30, 34);
  pixel(state.visual.hair, 17, 18, 37, 14); pixel(state.visual.hair, 13, 25, 7, 15); pixel(state.visual.hair, 50, 25, 7, 15);
  pixel("#111525", 24, 39, 5, 4); pixel("#111525", 41, 39, 5, 4);
  pixel(state.visual.smile ? "#8f263d" : "#5c2832", 30, 49, state.visual.smile ? 12 : 7, 3);
  if (state.visual.glasses) {
    pixel("#223658", 19, 34, 15, 8); pixel("#223658", 40, 34, 15, 8);
    pixel("#8bc5df", 22, 36, 9, 4); pixel("#8bc5df", 43, 36, 9, 4); pixel("#223658", 34, 36, 7, 2);
  }
  if (state.visual.accessory) { pixel("#f5c04f", 54, 74, 6, 8); pixel("#f5c04f", 28, 62, 8, 4); }
}

function drawSparkles(time) {
  const count = state.visual.accessory ? 7 : 3;
  for (let i = 0; i < count; i += 1) {
    const x = 30 + ((i * 57 + Math.floor(time * 12)) % 270);
    const y = 25 + ((i * 31) % 115);
    context.fillStyle = i % 2 ? "#f5c66b" : "#8ce8bd";
    context.fillRect(x, y, 2, 2);
    if (i % 3 === 0) context.fillRect(x - 2, y + 1, 6, 1);
  }
}

function formatCash(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(value))} đ`;
}

function getTitle() {
  if (state.age < 6) return tr("Em bé đang lớn");
  if (state.age < 12) return tr("Học sinh tiểu học");
  if (state.age < 18) return tr("Học sinh trung học");
  if (state.cash >= 1_000_000_000) return tr("✦ Đại gia mới nổi");
  if (state.cash >= 100_000_000) return tr("Giám đốc doanh nghiệp");
  return tr("Người trẻ khởi nghiệp");
}

function updatePanel(message) {
  $("#age-value").textContent = `${state.age} · ${state.day}/12`;
  $("#cash-value").textContent = formatCash(state.cash);
  $("#character-title").textContent = getTitle();
  $("#health-value").textContent = `${state.health}%`;
  $("#happiness-value").textContent = `${state.happiness}%`;
  $("#energy-value").textContent = `${state.energy}%`;
  $("#health-bar").style.width = `${state.health}%`;
  $("#happiness-bar").style.width = `${state.happiness}%`;
  $("#energy-bar").style.width = `${state.energy}%`;
  $("#education-value").textContent = tr(state.education);
  $("#life-log").textContent = message;
  const progress = Math.round(state.yearProgress);
  $("#year-progress-value").textContent = `${progress}%`;
  $("#year-progress-bar").style.width = `${progress}%`;
  const ageButton = $("#age-up");
  if (ageButton) ageButton.disabled = !state.started || state.eventOpen || state.yearProgress < 100;
  drawPortrait();
}

function updateSceneStory(text, phase, action = state.sceneAction) {
  state.sceneAction = action;
  const story = $("#scene-story-text");
  const label = $("#scene-story-label");
  const scenePhase = $("#scene-phase");
  if (story) story.textContent = text;
  if (label) label.textContent = state.language === "en" ? "LIFE JOURNAL" : "NHẬT KÝ CUỘC ĐỜI";
  if (scenePhase) scenePhase.textContent = tr(phase);
}

function startLife(originKey) {
  const origin = origins[originKey];
  state.origin = originKey;
  state.age = 0;
  state.day = 0;
  state.cash = origin.cash;
  state.health = origin.health;
  state.happiness = origin.happiness;
  state.intelligence = origin.intelligence;
  state.discipline = 50;
  state.stress = 10;
  state.energy = 82;
  state.education = "Chưa đi học";
  state.speed = 0;
  state.yearProgress = 0;
  state.sceneAction = "home";
  state.visual = { hair: "#24150f", outfit: "#3475d1", accessory: false, glasses: false, smile: false, expression: "neutral" };
  state.started = true;
  updateSceneStory(state.language === "en" ? "A new life begins in a small room. Every ordinary day will shape who you become." : "Một cuộc đời mới bắt đầu trong căn phòng nhỏ. Mỗi ngày bình thường sẽ tạo nên con người bạn.", "MỘT NGÀY MỚI", "home");
  updatePanel(state.language === "en" ? `You were born into a ${tr(origin.label).toLowerCase()} background. Choose your moments wisely.` : `Bạn sinh ra trong hoàn cảnh: ${origin.label}. Hãy sống chậm và chọn đúng thời điểm.`);
  setSpeed(0);
  showNextEvent();
}

function setSpeed(speed) {
  state.speed = speed;
  document.querySelectorAll(".speed-button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.speed) === speed);
  });
}

function tickDay() {
  if (!state.started || state.eventOpen || state.speed === 0) return;
  state.day += 1;
  state.yearProgress = Math.min(100, Math.round((state.day / 12) * 100));
  state.energy = Math.max(0, state.energy - 3);
  state.happiness = Math.max(0, state.happiness - (state.energy < 20 ? 2 : 0));
  state.stress = Math.min(100, state.stress + (state.energy < 20 ? 2 : 0));
  if (state.day >= 12) {
    setSpeed(0);
    updateSceneStory(state.language === "en" ? "The year is complete. You have earned the right to decide whether to grow into the next chapter." : "Một năm đã hoàn tất. Bạn đã sẵn sàng quyết định có bước sang chương tiếp theo hay chưa.", "NĂM ĐÃ SẴN SÀNG", "reflection");
    updatePanel(state.language === "en" ? "The year is ready to close. Choose when you are ready to grow." : "Năm đã sẵn sàng khép lại. Hãy chọn thời điểm bạn muốn trưởng thành.");
  } else {
    const action = state.age < 6 ? "home" : state.age < 12 ? "school" : state.age < 15 ? "friends" : "study";
    updateSceneStory(state.language === "en" ? `Day ${state.day}: a small choice becomes part of your story.` : `Ngày ${state.day}: một lựa chọn nhỏ đang trở thành một phần câu chuyện của bạn.`, "MỘT NGÀY MỚI", action);
    updatePanel(state.language === "en" ? `Day ${state.day}/12 of age ${state.age}. Needs and mood are changing.` : `Ngày ${state.day}/12 của tuổi ${state.age}. Nhu cầu và tâm trạng đang thay đổi.`);
  }
}

function advanceYear() {
  if (state.yearProgress < 100 || state.eventOpen) return;
  state.day = 0;
  state.yearProgress = 0;
  state.age += 1;
  state.energy = Math.min(100, state.energy + 35);
  state.health = Math.max(20, state.health - (state.age > 50 ? 2 : 0));
  state.cash += state.age < 18 ? 1_000_000 : 25_000_000;
  if (state.age === 6) state.education = "Tiểu học";
  if (state.age === 12) state.education = "THCS";
  if (state.age === 15 && state.education === "THCS") state.education = "THPT";
  updateSceneStory(state.language === "en" ? `You turned ${state.age}. The room changes, and a new chapter waits outside.` : `Bạn đã ${state.age} tuổi. Căn phòng thay đổi, một chương mới đang chờ phía trước.`, "MỘT NGÃ RẼ", state.age < 6 ? "home" : "study");
  updatePanel(state.language === "en" ? `You just turned ${state.age}. A new year opens.` : `Bạn vừa bước sang tuổi ${state.age}. Một năm mới mở ra.`);
  showNextEvent();
}

function showNextEvent() {
  const event = events.find((candidate) => candidate.minAge === state.age);
  if (!event) return;
  displayEvent(event);
}

function displayEvent(event) {
  state.eventOpen = true;
  setSpeed(0);
  updateSceneStory(tr(event.description), event.category, state.age < 10 ? "school" : state.age < 15 ? "friends" : "study");
  $("#event-category").textContent = tr(event.category);
  $("#event-title").textContent = tr(event.title);
  $("#event-description").textContent = tr(event.description);
  const options = $("#event-options");
  options.innerHTML = "";
  event.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "event-option";
    button.textContent = tr(option.label);
    button.addEventListener("click", () => resolveEvent(option));
    options.appendChild(button);
  });
  $("#event-modal")?.classList.remove("is-hidden");
  playSfx("popup");
  updateAgeAction();
}

function resolveEvent(option) {
  Object.entries(option.effects).forEach(([key, value]) => {
    if (key === "education") state.education = value;
    else state[key] = Math.max(0, Math.min(key === "cash" ? Number.MAX_SAFE_INTEGER : 100, state[key] + value));
  });
  state.visual = { ...state.visual, ...option.visual };
  state.eventOpen = false;
  $("#event-modal")?.classList.add("is-hidden");
  updatePanel(`${tr(option.result)} ${state.language === "en" ? "Your appearance and mood changed with this choice." : "Diện mạo và tâm trạng của bạn đã thay đổi theo lựa chọn này."}`);
  updateSceneStory(tr(option.result), "MỘT NGÃ RẼ", state.age < 10 ? "school" : state.age < 15 ? "friends" : "study");
  playSfx("choice");
  document.querySelector(".character-portrait-frame")?.classList.add("portrait-bump");
  setTimeout(() => document.querySelector(".character-portrait-frame")?.classList.remove("portrait-bump"), 500);
  setSpeed(1);
  updateAgeAction();
}

function updateAgeAction() {
  const ageButton = $("#age-up");
  if (ageButton) ageButton.disabled = !state.started || state.eventOpen || state.yearProgress < 100;
}

let audioContext;
function ensureAudio() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
}
function playSfx(kind) {
  if (!state.sound) return;
  ensureAudio();
  const frequencies = { click: 440, menu: 330, popup: 220, choice: 660, age: 520 };
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = kind === "popup" ? "sine" : "square";
  oscillator.frequency.value = frequencies[kind] || 440;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.11);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function reset() {
  $("#event-modal")?.classList.add("is-hidden");
  $("#menu-drawer")?.classList.add("is-hidden");
  $("#game-shell").classList.add("game-hidden");
  $("#start-screen").classList.remove("is-hidden");
  state.started = false;
  setSpeed(0);
  updateAgeAction();
}

function showLoading(originKey) {
  const loading = $("#loading-screen");
  const bar = $("#loading-bar");
  const status = $("#loading-status");
  loading.classList.remove("is-hidden");
  let progress = 0;
  const statuses = ["Đang gieo hoàn cảnh xuất phát", "Đang dựng gia đình và ký ức", "Đang chuẩn bị những ngã rẽ", "Cuộc đời đã sẵn sàng"];
  const timer = setInterval(() => {
    progress += 4;
    bar.style.width = `${progress}%`;
    status.textContent = statuses[Math.min(statuses.length - 1, Math.floor(progress / 28))];
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loading.classList.add("is-hidden");
        $("#start-screen").classList.add("is-hidden");
        $("#game-shell").classList.remove("game-hidden");
        startLife(originKey);
      }, 380);
    }
  }, 35);
}

function showStartScreen() {
  const loading = $("#loading-screen");
  const bar = $("#loading-bar");
  const status = $("#loading-status");
  let progress = 0;
  const statuses = ["Đang nạp thành phố", "Đang chuẩn bị gia đình", "Đang gieo những ngã rẽ", "Sẵn sàng bắt đầu"];
  const timer = setInterval(() => {
    progress += 5;
    bar.style.width = `${progress}%`;
    status.textContent = statuses[Math.min(statuses.length - 1, Math.floor(progress / 28))];
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        loading.classList.add("is-hidden");
        $("#start-screen").classList.remove("is-hidden");
      }, 380);
    }
  }, 35);
}

function on(selector, event, handler) {
  const element = $(selector);
  if (element) element.addEventListener(event, handler);
}

document.querySelectorAll(".origin-option").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".origin-option").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});
on("#start-game", "click", () => {
  playSfx("click");
  const selected = $(".origin-option.is-selected");
  let originKey = selected?.dataset.origin || "balanced";
  if (originKey === "random") originKey = ["balanced", "orphan"][Math.floor(Math.random() * 2)];
  showLoading(originKey);
});
on("#age-up", "click", () => {
  if (!state.started || state.eventOpen) return;
  playSfx("age");
  advanceYear();
});
on("#reset", "click", reset);
document.querySelectorAll(".speed-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (state.eventOpen) return;
    playSfx("click");
    setSpeed(Number(button.dataset.speed));
  });
});
on("#menu-button", "click", () => {
  playSfx("menu");
  $("#menu-drawer").classList.remove("is-hidden");
});
on("#close-menu", "click", () => $("#menu-drawer")?.classList.add("is-hidden"));
on("#back-home", "click", reset);
on("#sound-toggle", "click", () => {
  state.sound = !state.sound;
  localStorage.setItem("life-sound", state.sound ? "on" : "off");
  if (state.sound) { ensureAudio(); playSfx("click"); }
  applyLanguage();
});
on("#lang-vi", "click", () => {
  state.language = "vi";
  localStorage.setItem("life-language", "vi");
  applyLanguage();
});
on("#lang-en", "click", () => {
  state.language = "en";
  localStorage.setItem("life-language", "en");
  applyLanguage();
});

window.addEventListener("resize", resize);
resize();
applyLanguage();
drawPortrait();
setInterval(tickDay, 1000);
showStartScreen();

let lastFrame = 0;
function animate(time) {
  requestAnimationFrame(animate);
  if (time - lastFrame > 45) {
    drawPixelScene(time / 1000);
    drawPortrait();
    lastFrame = time;
  }
}
animate(0);
