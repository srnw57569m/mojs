const {
isBotLanguageConfigured,
getBotLanguage
} = require("../services/language");

const {
requireRegistration
} = require("../commands/registry");

const {
handleAdminCommands
} = require("../commands/admin");

const {
handleUserCommands
} = require("../commands/user");

const {
awardChatXp,
formatLevelUp
} = require("../services/levels");

const {
getUserData
} = require("../services/users");

const {
emotes,
resolveEmote,
startEmote,
stopEmote,
getLastEmote,
isRepeatRequest
} = require("../services/emotes");

const {
loadCreatedPosition
} = require("../services/positions");

const {
normalizeText
} = require("../utils/text");

const log = require("../utils/logger");

function registerChatHandler(bot) {
bot.on("Chat", async (user, message) => {
try {
const content = String(
message?.content || ""
).trim();


  if (!content) return;

  if (!isBotLanguageConfigured()) {
    await bot.whisper.send(
      user.id,
      "👑 The bot owner must configure the bot language first: ar / en"
    );
    return;
  }

  const botLang =
    getBotLanguage() || "ar";

  // --------------------------------------------------
  // Saved Direct conversation
  // --------------------------------------------------

  const userData =
    getUserData(user.id);

  const conversationId =
    userData?.conversationId || null;

  // --------------------------------------------------
  // Chat XP
  // --------------------------------------------------

  const xpResult =
    awardChatXp(user.id);

  // Level Up from room chat MUST be sent
  // through Highrise Direct, never public chat.
  if (
    xpResult.leveledUp &&
    conversationId
  ) {
    const levelUpMessage =
      formatLevelUp(
        user,
        botLang,
        xpResult
      );

    if (
      typeof levelUpMessage === "string" &&
      levelUpMessage.trim()
    ) {
      try {
        const result =
          await bot.direct.send(
            conversationId,
            levelUpMessage
          );

        if (
          result &&
          !result.ok
        ) {
          log.warn(
            "Direct",
            result.error ||
              "Failed to send level-up message."
          );
        }
      } catch (error) {
        log.error(
          "Direct",
          error.stack ||
            error.message
        );
      }
    }
  } else if (
    xpResult.leveledUp &&
    !conversationId
  ) {
    log.warn(
      "Direct",
      `Cannot send level-up to ${user.username || user.id}: missing conversationId.`
    );
  }

  const normalized =
    normalizeText(content);

  // The room chat is intentionally command-only.  In particular, do not add
  // natural-language emote matching or the general AI fallback here: both can
  // generate a conversational reply and are reserved for Direct messages.
  // The handlers below remain available for the existing public commands.

  // --------------------------------------------------
  // User commands
  // --------------------------------------------------

  const userCmd =
    await handleUserCommands(
      bot,
      user,
      message,
      botLang,
      conversationId
    );

  if (userCmd) return;

  // --------------------------------------------------
  // 1. Stop emote
  // --------------------------------------------------

  if (
    normalized === "stop" ||
    normalized === "توقف"
  ) {
    await stopEmote(
      bot,
      user
    );

    return;
  }

  // --------------------------------------------------
  // 2. Created positions
  // --------------------------------------------------

  const customPosition =
    loadCreatedPosition(
      normalized
    );

  if (customPosition) {
    const registered =
      await requireRegistration(
        bot,
        user
      );

    if (registered) {
      try {
        await bot.player.teleport(
          user.id,
          customPosition.x,
          customPosition.y,
          customPosition.z
        );
      } catch (err) {
        log.error(
          "Teleport",
          `Failed to teleport ${user.username}: ${err.message}`
        );
      }
    }

    return;
  }

  // --------------------------------------------------
  // 3. Random dance
  // --------------------------------------------------

  const danceKeywords = [
    "رقصني",
    "رقصنى",
    "رقص",
    "رقصة عشوائية",
    "رقصه عشوائيه",
    "dance",
    "random dance"
  ];

  if (
    danceKeywords.includes(
      normalized
    )
  ) {
    const registered =
      await requireRegistration(
        bot,
        user
      );

    if (
      registered &&
      Array.isArray(emotes) &&
      emotes.length > 0
    ) {
      const randomEmote =
        emotes[
          Math.floor(
            Math.random() *
              emotes.length
          )
        ];

      await startEmote(
        bot,
        user,
        randomEmote,
        {
          publicLevelUp: false
        }
      );

      const danceMsg =
        botLang === "ar"
          ? `💃 شغلتلك رقصة: ${randomEmote.name} (#${randomEmote.number})`
          : `💃 Playing: ${randomEmote.name} (#${randomEmote.number})`;

      await bot.whisper.send(
        user.id,
        danceMsg
      );
    }

    return;
  }

  // --------------------------------------------------
  // 4. Exact emote
  // --------------------------------------------------

  const exactEmote =
    resolveEmote(content);

  if (exactEmote) {
    const registered =
      await requireRegistration(
        bot,
        user
      );

    if (registered) {
      await startEmote(
        bot,
        user,
        exactEmote,
        {
          publicLevelUp: false
        }
      );
    }

    return;
  }

  // --------------------------------------------------
  // 5. Repeat last emote
  // --------------------------------------------------

  if (
    isRepeatRequest(content)
  ) {
    const registered =
      await requireRegistration(
        bot,
        user
      );

    if (registered) {
      const last =
        getLastEmote(user.id);

      if (last) {
        await startEmote(
          bot,
          user,
          last,
          {
            publicLevelUp: false
          }
        );
      }
    }

    return;
  }

  // --------------------------------------------------
  // 6. Admin commands
  // --------------------------------------------------

  const adminDone =
    await handleAdminCommands(
      bot,
      user,
      message,
      {
        whisper: true
      }
    );

  if (adminDone) return;

} catch (err) {
  log.error(
    "ChatHandler",
    err.stack ||
      err.message
  );
}


});
}

module.exports =
registerChatHandler;
