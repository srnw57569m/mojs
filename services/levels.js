const { users, getUserData, saveUsers } = require("./users");
const { t } = require("./i18n");

// ============================================================
// XP SETTINGS
// ============================================================

const CHAT_XP = 5;
const DIRECT_XP = 5;
const EMOTE_XP = 2;
const TIP_XP = 5;

const CHAT_COOLDOWN_MS = 20 * 1000;
const DIRECT_COOLDOWN_MS = 20 * 1000;
const EMOTE_COOLDOWN_MS = 30 * 1000;

const MAX_LEVEL = 100;

// ============================================================
// COOLDOWNS
// ============================================================

const chatCooldowns = new Map();
const directCooldowns = new Map();
const emoteCooldowns = new Map();

// ============================================================
// LEVEL REQUIREMENTS
// ============================================================
//
// Level 1 -> 2 = 100 XP
// Level 2 -> 3 = 175 XP
// Level 3 -> 4 = 250 XP
// ...
//
// كل Level جديد بيحتاج XP أكتر من اللي قبله.
//
// ============================================================

function thresholdForLevel(level) {
const n = Math.max(1, Number(level) || 1);

return 100 + (n - 1) * 75;
}

// ============================================================
// PROGRESS BAR
// ============================================================

function progressBar(percent, size = 10) {
const safePercent = Math.max(
0,
Math.min(100, Number(percent) || 0)
);

const filled = Math.round(
(safePercent / 100) * size
);

return (
"█".repeat(filled) +
"░".repeat(size - filled)
);
}

// ============================================================
// ENSURE LEVEL DATA
// ============================================================

function ensureLevelData(user) {
if (!user || typeof user !== "object") {
return;
}

if (!user.levelStats || typeof user.levelStats !== "object") {
user.levelStats = {};
}

if (!Number.isFinite(user.xp)) {
user.xp = 0;
}

if (!Number.isFinite(user.totalXp)) {
user.totalXp = user.xp;
}

if (
!Number.isFinite(user.level) ||
user.level < 1
) {
user.level = 1;
}

if (user.level > MAX_LEVEL) {
user.level = MAX_LEVEL;
}

// لو البيانات القديمة عندها XP أكبر من المطلوب
// وهي بالفعل Level 100، منسيبش XP يعمل Overflow بلا داعي.
if (user.level === MAX_LEVEL) {
user.xp = Math.max(0, user.xp);
}
}

// ============================================================
// GET LEVEL STATS
// ============================================================

function getLevelStats(userId) {
const user = getUserData(userId);

ensureLevelData(user);

const level = Math.min(
Math.max(1, user.level),
MAX_LEVEL
);

// Level 100 هو آخر Level.
if (level >= MAX_LEVEL) {
return {
level: MAX_LEVEL,
xp: user.xp,
totalXp: user.totalXp,
nextLevelXp: 0,
percent: 100,
bar: progressBar(100),
maxLevel: true
};
}

const currentThreshold =
thresholdForLevel(level);

const percent = Math.floor(
(user.xp / currentThreshold) * 100
);

return {
level,
xp: user.xp,
totalXp: user.totalXp,
nextLevelXp: currentThreshold,
percent: Math.max(0, Math.min(100, percent)),
bar: progressBar(percent),
maxLevel: false
};
}

// ============================================================
// LEADERBOARD
// ============================================================

function getTopPlayers(limit = 5) {
const safeLimit = Math.max(1, Math.min(20, Number(limit) || 5));

return Object.entries(users)
.map(([id, user]) => {
ensureLevelData(user);

return {
id,
username: String(user?.username || "Player").trim() || "Player",
level: Math.min(Math.max(1, Number(user?.level) || 1), MAX_LEVEL),
totalXp: Math.max(0, Number(user?.totalXp) || 0)
};
})
.filter((player) => player.username !== "Player" || player.totalXp > 0)
.sort((a, b) => {
if (b.level !== a.level) return b.level - a.level;
if (b.totalXp !== a.totalXp) return b.totalXp - a.totalXp;
return a.username.localeCompare(b.username);
})
.slice(0, safeLimit);
}

// ============================================================
// AWARD XP
// ============================================================

function awardXp(
userId,
amount,
source = "activity"
) {
if (
!Number.isFinite(amount) ||
amount <= 0
) {
return {
gained: 0,
leveledUp: false,
stats: getLevelStats(userId)
};
}

const user = getUserData(userId);

ensureLevelData(user);

const oldLevel = user.level;

// Level 100 reached already.
if (user.level >= MAX_LEVEL) {
return {
gained: 0,
leveledUp: false,
oldLevel: MAX_LEVEL,
newLevel: MAX_LEVEL,
stats: getLevelStats(userId)
};
}

user.xp += amount;
user.totalXp += amount;

user.levelStats[source] =
(Number(user.levelStats[source]) || 0) + amount;

let leveledUp = false;

while (
user.level < MAX_LEVEL &&
user.xp >= thresholdForLevel(user.level)
) {
user.xp -= thresholdForLevel(user.level);
user.level += 1;
leveledUp = true;
}

saveUsers();

return {
gained: amount,
leveledUp,
oldLevel,
newLevel: user.level,
stats: getLevelStats(userId)
};
}

// ============================================================
// CHAT XP
// ============================================================

function awardChatXp(userId) {
const now = Date.now();
const last = chatCooldowns.get(userId) || 0;

if (
now - last <
CHAT_COOLDOWN_MS
) {
return {
gained: 0,
leveledUp: false,
stats: getLevelStats(userId)
};
}

chatCooldowns.set(userId, now);

return awardXp(
userId,
CHAT_XP,
"chat"
);
}

// ============================================================
// DIRECT XP
// ============================================================

function awardDirectXp(userId) {
const now = Date.now();
const last = directCooldowns.get(userId) || 0;

if (
now - last <
DIRECT_COOLDOWN_MS
) {
return {
gained: 0,
leveledUp: false,
stats: getLevelStats(userId)
};
}

directCooldowns.set(userId, now);

return awardXp(
userId,
DIRECT_XP,
"direct"
);
}

// ============================================================
// EMOTE XP
// ============================================================

function awardEmoteXp(userId) {
const now = Date.now();
const last = emoteCooldowns.get(userId) || 0;

if (
now - last <
EMOTE_COOLDOWN_MS
) {
return {
gained: 0,
leveledUp: false,
stats: getLevelStats(userId)
};
}

emoteCooldowns.set(userId, now);

return awardXp(
userId,
EMOTE_XP,
"emote"
);
}

// ============================================================
// TIP XP
// ============================================================

function awardTipXp(userId) {
return awardXp(
userId,
TIP_XP,
"tip"
);
}

// ============================================================
// LEVEL CARD
// ============================================================

function formatLevelCard(
user,
language,
result
) {
const stats =
result?.stats ||
getLevelStats(user.id);

return t(
"level",
language,
user.username || "User",
stats.level,
stats.xp,
stats.nextLevelXp,
stats.percent,
stats.bar
);
}

// ============================================================
// LEVEL UP
// ============================================================

function formatLevelUp(
user,
language,
result
) {
const stats = result.stats;

return t(
"levelUp",
language,
user.username || "User",
stats.level,
result.gained,
stats.xp,
stats.nextLevelXp,
stats.percent,
stats.bar
);
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
CHAT_XP,
DIRECT_XP,
EMOTE_XP,
TIP_XP,

CHAT_COOLDOWN_MS,
DIRECT_COOLDOWN_MS,
EMOTE_COOLDOWN_MS,

MAX_LEVEL,

thresholdForLevel,
progressBar,

getLevelStats,
getTopPlayers,

awardXp,
awardChatXp,
awardDirectXp,
awardEmoteXp,
awardTipXp,

formatLevelCard,
formatLevelUp
};
