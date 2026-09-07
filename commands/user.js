const { stopEmote } = require("../services/emotes");
const { normalizeText } = require("../utils/text");
const {
  getLevelStats,
  formatLevelCard
} = require("../services/levels");
const { t } = require("../services/i18n");
const { getUserData } = require("../services/users");
const log = require("../utils/logger");

/**
 * Send a message through Highrise Direct.
 *
 * If conversationId is provided, use it directly.
 * Otherwise try to use the conversation saved for the user.
 */
async function sendUserDirect(bot, user, text, conversationId = null) {
  if (typeof text !== "string" || !text.trim()) {
    log.warn("Direct", "Attempted to send an empty message.");
    return false;
  }

  const userData = getUserData(user.id);
  const targetConversationId =
    conversationId || userData.conversationId;

  if (!targetConversationId) {
    log.warn(
      "Direct",
      `No Direct conversation found for ${user.username || user.id}.`
    );
    return false;
  }

  try {
    const result = await bot.direct.send(
      targetConversationId,
      text
    );

    if (result && !result.ok) {
      log.warn(
        "Direct",
        result.error || "Failed to send Direct message."
      );
      return false;
    }

    return true;
  } catch (error) {
    log.error(
      "Direct",
      error.stack || error.message
    );
    return false;
  }
}

async function handleUserCommands(
  bot,
  user,
  message,
  language,
  conversationId = null
) {
  const normalized = normalizeText(
    String(message?.content || "").trim()
  );

  // Stop emote
  if (
    normalized === "stop" ||
    normalized === "توقف"
  ) {
    await stopEmote(bot, user);
    return true;
  }

  // Help
  if (
    normalized === "!help" ||
    normalized === "!commands" ||
    normalized === "help" ||
    normalized === "commands"
  ) {
    const helpMessage = t("help", language);

    await sendUserDirect(
      bot,
      user,
      helpMessage,
      conversationId
    );

    return true;
  }

  // Level / Rank / XP
  if (
    normalized === "level" ||
    normalized === "!level" ||
    normalized === "rank" ||
    normalized === "!rank" ||
    normalized === "xp" ||
    normalized === "!xp"
  ) {
    const stats = getLevelStats(user.id);

    const levelMessage = formatLevelCard(
      user,
      language,
      { stats }
    );

    await sendUserDirect(
      bot,
      user,
      levelMessage,
      conversationId
    );

    return true;
  }

  return false;
}

module.exports = {
  handleUserCommands,
  sendUserDirect
};

