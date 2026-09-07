const fs = require("fs");
const path = require("path");
require("dotenv").config();

const configPath = path.join(__dirname, "config.json");

if (!fs.existsSync(configPath)) {
  console.error("[ERROR] config.json not found.");
  process.exit(1);
}

let config = {};

try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch (error) {
  console.error("[ERROR] Failed to read config.json:", error.message);
  process.exit(1);
}

if (!config.token || !config.room || !config.owner) {
  console.error("[ERROR] config.json requires: token, room, owner");
  process.exit(1);
}

module.exports = config;
