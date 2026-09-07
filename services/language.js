const fs = require("fs");
const path = require("path");
const log = require("../utils/logger");

const dataFolder = path.join(__dirname, "..", "data");
const roomStatePath = path.join(dataFolder, "room-state.json");

const DEFAULT_LANGUAGE = "ar";
const SUPPORTED_LANGUAGES = new Set(["ar", "en"]);

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

let botLanguage = null;

function normalizeLanguage(lang) {
  const value = String(lang || "").trim().toLowerCase();

  if (SUPPORTED_LANGUAGES.has(value)) {
    return value;
  }

  return null;
}

function loadRoomState() {
  try {
    if (!fs.existsSync(roomStatePath)) {
      botLanguage = null;
      return null;
    }

    const raw = fs.readFileSync(roomStatePath, "utf8");
    const state = JSON.parse(raw);

    const language = normalizeLanguage(state?.botLanguage);

    botLanguage = language;

    return botLanguage;
  } catch (error) {
    log.error(
      "RoomState",
      `Failed to load room-state.json: ${error.message}`
    );

    botLanguage = null;
    return null;
  }
}

function saveRoomState() {
  try {
    fs.writeFileSync(
      roomStatePath,
      JSON.stringify(
        {
          botLanguage: botLanguage || DEFAULT_LANGUAGE
        },
        null,
        2
      ),
      "utf8"
    );

    return true;
  } catch (error) {
    log.error(
      "RoomState",
      `Failed to save room-state.json: ${error.message}`
    );

    return false;
  }
}

function getBotLanguage() {
  // اقرأ أحدث قيمة من الملف في كل مرة.
  // ده يضمن إن UserJoined/UserLeft يستخدموا اللغة الحالية.
  const fileLanguage = loadRoomState();

  if (fileLanguage) {
    return fileLanguage;
  }

  // لو الملف مش موجود أو اللغة غير صالحة،
  // استخدم القيمة الموجودة في الذاكرة أو العربي كـ fallback.
  return normalizeLanguage(botLanguage) || DEFAULT_LANGUAGE;
}

function setBotLanguage(lang) {
  const normalized = normalizeLanguage(lang);

  if (!normalized) {
    log.warn(
      "RoomState",
      `Invalid bot language "${lang}". Supported languages: ar, en.`
    );

    return false;
  }

  botLanguage = normalized;
  saveRoomState();

  log.info(
    "RoomState",
    `Bot language changed to: ${botLanguage}`
  );

  return true;
}

function isBotLanguageConfigured() {
  return Boolean(normalizeLanguage(botLanguage));
}

loadRoomState();

module.exports = {
  getBotLanguage,
  setBotLanguage,
  isBotLanguageConfigured,
  loadRoomState,
  saveRoomState
};