/**
 * Milestone 1 (R1) Verification Test Suite
 * Tests:
 * 1. LiveLeaderboardClient deduplication & dummy filtering
 * 2. Player record priority over duplicates
 * 3. Tie-breaking by netWorth, peakNetWorth, ts
 * 4. Vietnamese name generation logic
 * 5. Clean default names across source files
 * 6. DOM element ID integrity
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const GAME_JS = path.join(ROOT_DIR, "web", "game.js");
const LEADERBOARD_JS = path.join(ROOT_DIR, "web", "live_leaderboard.js");
const WEB_HTML = path.join(ROOT_DIR, "web", "index.html");
const ROOT_HTML = path.join(ROOT_DIR, "index.html");

console.log("=== Running Milestone 1 (R1) Test Suite ===\n");

// -----------------------------------------------------------------------------
// Test 1: Clean Defaults Across Codebase
// -----------------------------------------------------------------------------
console.log("Test 1: Clean Defaults Verification (No hardcoded 'Nguyễn Gia Huy')...");
const webHtmlContent = fs.readFileSync(WEB_HTML, "utf8");
const rootHtmlContent = fs.readFileSync(ROOT_HTML, "utf8");
const gameJsContent = fs.readFileSync(GAME_JS, "utf8");
const leaderboardJsContent = fs.readFileSync(LEADERBOARD_JS, "utf8");

assert(!gameJsContent.includes('"Nguyễn Gia Huy"'), "web/game.js must not contain hardcoded 'Nguyễn Gia Huy'");
assert(!webHtmlContent.includes("Nguyễn Gia Huy"), "web/index.html must not contain hardcoded 'Nguyễn Gia Huy'");
assert(!rootHtmlContent.includes("Nguyễn Gia Huy"), "index.html must not contain hardcoded 'Nguyễn Gia Huy'");
assert(webHtmlContent.includes('id="hud-name">Người chơi</div>'), "web/index.html HUD initial name should be 'Người chơi'");
assert(rootHtmlContent.includes('id="hud-name">Người chơi</div>'), "root index.html HUD initial name should be 'Người chơi'");
console.log("  PASS: Clean defaults verified!\n");

// -----------------------------------------------------------------------------
// Test 2: DOM Elements in web/index.html and index.html
// -----------------------------------------------------------------------------
console.log("Test 2: DOM Element ID Integrity...");
const requiredIds = [
  "new-life-modal",
  "btn-close-new-life",
  "input-char-name",
  "btn-random-name",
  "btn-gender-male",
  "btn-gender-female",
  "btn-start-new-life",
  "btn-newlife-open-load",
  "hud-name",
  "leaderboard-list"
];

for (const id of requiredIds) {
  assert(webHtmlContent.includes(`id="${id}"`), `web/index.html missing ID: ${id}`);
  assert(rootHtmlContent.includes(`id="${id}"`), `root index.html missing ID: ${id}`);
}
console.log("  PASS: All required DOM IDs present in both HTML files!\n");

// -----------------------------------------------------------------------------
// Test 3: Leaderboard Deduplication & Dummy Filtering Logic
// -----------------------------------------------------------------------------
console.log("Test 3: Leaderboard Deduplication & Hygiene Logic...");

// Mock environment for LiveLeaderboardClient
const mockLocalStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

global.localStorage = mockLocalStorage;
global.window = {};

// Evaluate leaderboard code
const vm = require("vm");
const context = {
  window: {},
  localStorage: mockLocalStorage,
  sessionStorage: mockLocalStorage,
  Date,
  Math,
  Number,
  String,
  Object,
  Array,
  Map,
  URLSearchParams: require("url").URLSearchParams,
  console
};
vm.createContext(context);
vm.runInContext(leaderboardJsContent, context);

const client = context.window.ZTBLiveBoard;
assert(client, "ZTBLiveBoard should be instantiated on window");

// Setup test player uid
const myUid = client.uid;

// Add diverse player entries:
// 1. Current player (age: 0, netWorth: 0, isPlayer = true -> should NOT be filtered out!)
client.players[myUid] = {
  uid: myUid,
  name: "Trần Minh Quân",
  age: 0,
  gen: 1,
  job: "Trẻ nhỏ",
  netWorth: 0,
  peakNetWorth: 0,
  vip: false,
  alive: true,
  ts: 1000
};

// 2. Dummy entries from peers (age: 0, netWorth: 0, !isPlayer -> MUST BE FILTERED OUT!)
client.players["dummy_1"] = {
  uid: "dummy_1",
  name: "Nguyễn Gia Huy",
  age: 0,
  gen: 1,
  job: "Trẻ nhỏ",
  netWorth: 0,
  peakNetWorth: 0,
  vip: false,
  alive: true,
  ts: 100
};
client.players["dummy_2"] = {
  uid: "dummy_2",
  name: "  nguyễn gia huy  ",
  age: 0,
  gen: 1,
  job: "Trẻ nhỏ",
  netWorth: -500,
  peakNetWorth: 0,
  vip: false,
  alive: true,
  ts: 200
};

// 3. Valid peer with a real net worth
client.players["peer_real_1"] = {
  uid: "peer_real_1",
  name: "Phạm Nhật Vượng",
  age: 55,
  gen: 1,
  job: "Chủ tịch tập đoàn",
  netWorth: 100_000_000_000,
  peakNetWorth: 100_000_000_000,
  vip: true,
  alive: true,
  ts: 500
};

// 4. Duplicate peer entries with same normalized name but different netWorth / ts
client.players["dup_peer_low"] = {
  uid: "dup_peer_low",
  name: "Lê Hoàng Nam",
  age: 25,
  gen: 1,
  job: "Lập trình viên",
  netWorth: 50_000_000,
  peakNetWorth: 50_000_000,
  vip: false,
  alive: true,
  ts: 1000
};
client.players["dup_peer_high"] = {
  uid: "dup_peer_high",
  name: "  LÊ HOÀNG NAM  ",
  age: 30,
  gen: 1,
  job: "Kỹ sư AI",
  netWorth: 500_000_000,
  peakNetWorth: 500_000_000,
  vip: false,
  alive: true,
  ts: 2000
};
client.players["dup_peer_older"] = {
  uid: "dup_peer_older",
  name: "lê hoàng nam",
  age: 28,
  gen: 1,
  job: "Trưởng nhóm",
  netWorth: 500_000_000,
  peakNetWorth: 500_000_000,
  vip: false,
  alive: true,
  ts: 1500
};

// 5. A peer sharing player's exact name
client.players["peer_with_my_name"] = {
  uid: "peer_with_my_name",
  name: "TRẦN MINH QUÂN",
  age: 40,
  gen: 1,
  job: "Doanh nhân",
  netWorth: 999_999_999,
  peakNetWorth: 999_999_999,
  vip: true,
  alive: true,
  ts: 9999
};

const snapshot = client.getLeaderboardSnapshot();
console.log("  Snapshot total entries:", snapshot.entries.length);
snapshot.entries.forEach((e, idx) => {
  console.log(`    #${idx + 1}: ${e.name} | isPlayer: ${e.isPlayer} | netWorth: ${e.netWorth} | age: ${e.age}`);
});

// Assertions
// 1. Dummies with netWorth <= 0 && age === 0 && !isPlayer must be filtered
const dummyEntry = snapshot.entries.find((e) => e.name.toLowerCase().includes("nguyễn gia huy"));
assert(!dummyEntry, "Dummy unplayed entries must be filtered out!");

// 2. Player entry must be present despite netWorth: 0, age: 0
const myEntry = snapshot.entries.find((e) => e.isPlayer);
assert(myEntry, "Player record must be present in leaderboard");
assert.strictEqual(myEntry.uid, myUid, "Player record must have current player's uid");

// 3. Player entry must override peer with same name ("Trần Minh Quân")
const tmqEntries = snapshot.entries.filter((e) => e.name.trim().toLowerCase() === "trần minh quân");
assert.strictEqual(tmqEntries.length, 1, "There must be exactly 1 entry for 'Trần Minh Quân'");
assert.strictEqual(tmqEntries[0].isPlayer, true, "Player's record must be prioritized over peer duplicate");

// 4. Duplicate peer "Lê Hoàng Nam" must be collapsed into highest netWorth (500M) and most recent ts (2000)
const lhnEntries = snapshot.entries.filter((e) => e.name.trim().toLowerCase() === "lê hoàng nam");
assert.strictEqual(lhnEntries.length, 1, "There must be exactly 1 entry for 'Lê Hoàng Nam'");
assert.strictEqual(lhnEntries[0].netWorth, 500_000_000, "Highest net worth must be retained");
assert.strictEqual(lhnEntries[0].ts, 2000, "Most recent timestamp must be retained");

// 5. Check total unique names
const uniqueNames = new Set(snapshot.entries.map((e) => e.name.trim().toLowerCase()));
assert.strictEqual(uniqueNames.size, snapshot.entries.length, "All leaderboard entries must have unique normalized names");

console.log("  PASS: Leaderboard deduplication and hygiene verified!\n");

// -----------------------------------------------------------------------------
// Test 4: Dynamic Vietnamese Name Generator
// -----------------------------------------------------------------------------
console.log("Test 4: Dynamic Vietnamese Name Generator...");
// Extract generateVietnameseName function from game.js
const nameGenMatch = gameJsContent.match(/function generateVietnameseName\(gender, preferredSurname = ""\) \{[\s\S]*?\n  \}/);
assert(nameGenMatch, "generateVietnameseName function found in game.js");

const familyNamesMatch = gameJsContent.match(/const FAMILY_NAMES = \[[^\]]+\];/);
const maleMiddleMatch = gameJsContent.match(/const MALE_MIDDLE = \[[^\]]+\];/);
const maleGivenMatch = gameJsContent.match(/const MALE_GIVEN = \[[^\]]+\];/);
const femaleMiddleMatch = gameJsContent.match(/const FEMALE_MIDDLE = \[[^\]]+\];/);
const femaleGivenMatch = gameJsContent.match(/const FEMALE_GIVEN = \[[^\]]+\];/);
const randIntMatch = gameJsContent.match(/function randInt\(min, max\) \{[\s\S]*?\}/);

assert(familyNamesMatch && maleMiddleMatch && maleGivenMatch && femaleMiddleMatch && femaleGivenMatch, "Name arrays found");

const testContext = {
  Math,
  String
};
vm.createContext(testContext);
vm.runInContext(`
  ${randIntMatch[0]}
  ${familyNamesMatch[0]}
  ${maleMiddleMatch[0]}
  ${maleGivenMatch[0]}
  ${femaleMiddleMatch[0]}
  ${femaleGivenMatch[0]}
  ${nameGenMatch[0]}
`, testContext);

for (let i = 0; i < 20; i++) {
  const maleName = testContext.generateVietnameseName("Nam");
  assert(maleName && maleName.split(" ").length >= 2, `Male name must be valid Vietnamese name: ${maleName}`);
  const femaleName = testContext.generateVietnameseName("Nữ");
  assert(femaleName && femaleName.split(" ").length >= 2, `Female name must be valid Vietnamese name: ${femaleName}`);
  const customSurnameName = testContext.generateVietnameseName("Nam", "Hoàng");
  assert(customSurnameName.startsWith("Hoàng "), `Name must start with preferred surname: ${customSurnameName}`);
}
console.log("  PASS: Vietnamese name generator creates valid names with surnames, middle, and given names!\n");

// -----------------------------------------------------------------------------
// Test 5: Deferred Publication & Mandatory First-Run Check in game.js
// -----------------------------------------------------------------------------
console.log("Test 5: Deferred Broadcast & First-Run Modal Implementation...");
assert(/if\s*\(\s*loaded\s*\)\s*\{\s*this\.publishPlayerToLiveBoard\(true\);/.test(gameJsContent), "Live board broadcast must be guarded by 'loaded'");
assert(gameJsContent.includes("this.openNewLifeModal(true, true);"), "init() must call openNewLifeModal with mandatory=true when !loaded");
assert(gameJsContent.includes("this.isFirstRunMandatory = mandatory;"), "openNewLifeModal must track isFirstRunMandatory");
assert(gameJsContent.includes('closeBtn.style.display = "none";'), "Close button must be hidden when mandatory");
assert(gameJsContent.includes("closeBtn.disabled = true;"), "Close button must be disabled when mandatory");
assert(gameJsContent.includes('if (!localStorage.getItem(SAVE_KEY)) return;'), "publishPlayerToLiveBoard must not publish without save");

console.log("  PASS: Deferred broadcast and mandatory first-run modal confirmed!\n");

console.log("=== All Milestone 1 (R1) Tests Passed Successfully! ===");
