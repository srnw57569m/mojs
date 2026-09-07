const fs = require("fs");
const path = require("path");
const log = require("../utils/logger");

const botPositionPath = path.join(__dirname, "..", "bot_pos.json");
const positionsFolder = path.join(__dirname, "..", "Positions");

if (!fs.existsSync(positionsFolder)) {
  fs.mkdirSync(positionsFolder, { recursive: true });
}

let botPosition = null;

/**
 * التحقق من صيغة الموديل الخاص بالإحداثيات المعتمد لدى highrise.bot
 */
function isCoordinatePosition(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.x === "number" &&
    typeof obj.y === "number" &&
    typeof obj.z === "number"
  );
}

function saveBotPosition(position) {
  try {
    botPosition = position;
    fs.writeFileSync(botPositionPath, JSON.stringify(position, null, 2), "utf8");
  } catch (error) {
    log.error("Positions", `Failed to save bot_pos.json: ${error.message}`);
  }
}

function loadBotPosition() {
  try {
    if (fs.existsSync(botPositionPath)) {
      const data = JSON.parse(fs.readFileSync(botPositionPath, "utf8"));
      if (isCoordinatePosition(data)) {
        botPosition = data;
        return data;
      }
    }
  } catch (error) {
    log.error("Positions", `Failed to load bot_pos.json: ${error.message}`);
  }
  return null;
}

function saveCreatedPosition(name, position) {
  try {
    const file = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    fs.writeFileSync(file, JSON.stringify(position, null, 2), "utf8");
    return true;
  } catch (error) {
    log.error("Positions", `Failed to save position ${name}: ${error.message}`);
    return false;
  }
}

function loadCreatedPosition(name) {
  try {
    const file = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
  } catch (error) {
    log.error("Positions", `Failed to load position ${name}: ${error.message}`);
  }
  return null;
}

function deleteCreatedPosition(name) {
  try {
    const file = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      return true;
    }
  } catch (error) {
    log.error("Positions", `Failed to delete position ${name}: ${error.message}`);
  }
  return false;
}

module.exports = {
  botPosition,
  isCoordinatePosition,
  saveBotPosition,
  loadBotPosition,
  saveCreatedPosition,
  loadCreatedPosition,
  deleteCreatedPosition
};
