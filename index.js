const { Highrise } = require("highrise.bot");
const config = require("./config");
const log = require("./utils/logger");

const registerReadyHandler = require("./handlers/ready");
const registerChatHandler = require("./handlers/chat");
const registerDirectHandler = require("./handlers/direct");
const registerUserJoinedHandler = require("./handlers/userJoined");
const registerUserLeftHandler = require("./handlers/userLeft");
const registerTipHandler = require("./handlers/tip");
const registerWhisperHandler = require("./handlers/whisper");
const registerModerationHandler = require("./handlers/moderation");

const bot = new Highrise();

registerReadyHandler(bot);
registerChatHandler(bot);
registerDirectHandler(bot);
registerUserJoinedHandler(bot);
registerUserLeftHandler(bot);
registerTipHandler(bot);
registerWhisperHandler(bot);
registerModerationHandler(bot);

process.on("unhandledRejection", (reason, promise) => {
  log.error("System", `Unhandled Rejection: ${reason}`);
});

process.on("uncaughtException", (error) => {
  log.error("System", `Uncaught Exception: ${error.stack || error.message}`);
});

const gracefulShutdown = () => {
  log.info("System", "Shutting down gracefully...");
  if (bot.looper && typeof bot.looper.destroy === "function") {
    bot.looper.destroy();
  }
  if (typeof bot.destroy === "function") {
    bot.destroy();
  }
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

bot.login(config.token, config.room);
