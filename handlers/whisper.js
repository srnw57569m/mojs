const log = require("../utils/logger");

function registerWhisperHandler(bot) {
  bot.on("Whisper", async (user, message) => {
    // Retained for hook flexibility according to source logic
  });
}

module.exports = registerWhisperHandler;
