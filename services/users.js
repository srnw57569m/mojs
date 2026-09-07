const fs = require("fs");
const path = require("path");
const log = require("../utils/logger");

const usersDataPath = path.join(__dirname, "..", "users.json");
let users = {};

function loadUsers() {
  try {
    if (!fs.existsSync(usersDataPath)) {
      users = {};
      return;
    }
    users = JSON.parse(fs.readFileSync(usersDataPath, "utf8"));
    if (!users || typeof users !== "object") users = {};
    for (const data of Object.values(users)) {
      if (!data || typeof data !== "object") continue;
      if (!Number.isFinite(data.xp)) data.xp = 0;
      if (!Number.isFinite(data.totalXp)) data.totalXp = data.xp;
      if (!Number.isFinite(data.level) || data.level < 1) data.level = 1;
      if (!data.levelStats || typeof data.levelStats !== "object") data.levelStats = {};
    }
    for (const data of Object.values(users)) {
      if (!data || typeof data !== "object") continue;
      if (!Number.isFinite(data.xp)) data.xp = 0;
      if (!Number.isFinite(data.totalXp)) data.totalXp = data.xp;
      if (!Number.isFinite(data.level) || data.level < 1) data.level = 1;
      if (!data.levelStats || typeof data.levelStats !== "object") data.levelStats = {};
    }
    for (const data of Object.values(users)) {
      if (!data || typeof data !== "object") continue;
      if (!Number.isFinite(data.xp)) data.xp = 0;
      if (!Number.isFinite(data.totalXp)) data.totalXp = data.xp;
      if (!Number.isFinite(data.level) || data.level < 1) data.level = 1;
      if (!data.levelStats || typeof data.levelStats !== "object") data.levelStats = {};
    }
    for (const data of Object.values(users)) {
      if (!data || typeof data !== "object") continue;
      if (!Number.isFinite(data.xp)) data.xp = 0;
      if (!Number.isFinite(data.totalXp)) data.totalXp = data.xp;
      if (!Number.isFinite(data.level) || data.level < 1) data.level = 1;
      if (!data.levelStats || typeof data.levelStats !== "object") data.levelStats = {};
    }
  } catch (error) {
    log.error("Users", `Failed to load users.json: ${error.message}`);
    users = {};
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(usersDataPath, JSON.stringify(users, null, 2), "utf8");
  } catch (error) {
    log.error("Users", `Failed to save users.json: ${error.message}`);
  }
}

function getUserData(userId) {
  if (!users[userId]) {
    users[userId] = {
      registered: false,
      conversationId: null,
      language: null,
      username: null,
      xp: 0,
      totalXp: 0,
      level: 1,
      levelStats: {}
    };
  }
  return users[userId];
}

function hasConversation(userId) {
  const data = getUserData(userId);
  return Boolean(data.registered && data.conversationId);
}

function getLanguage(userId) {
  const data = getUserData(userId);
  return data.language || null;
}

function setLanguage(userId, language) {
  const data = getUserData(userId);
  data.language = language;
  saveUsers();
}

loadUsers();

module.exports = {
  users,
  loadUsers,
  saveUsers,
  getUserData,
  hasConversation,
  getLanguage,
  setLanguage
};
