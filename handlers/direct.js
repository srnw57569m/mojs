const {
  getUserData
} = require("../services/users");

const {
  isOwner,
  resolveOwnerId
} = require("../services/permissions");

const {
  isBotLanguageConfigured,
  getBotLanguage,
  setBotLanguage
} = require("../services/language");

const {
  handleRegistration
} = require("../commands/registry");

const {
  handleAdminCommands
} = require("../commands/admin");

const {
  handleUserCommands
} = require("../commands/user");

const {
  emotes,
  resolveEmote,
  startEmote,
  handleNaturalEmoteRequest,
  looksLikeEmoteRequest,
  getLastEmote,
  isRepeatRequest
} = require("../services/emotes");

const {
  askGroq,
  aiFallback
} = require("../services/ai");

const {
  normalizeText
} = require("../utils/text");

const log = require("../utils/logger");

const {
  awardDirectXp,
  formatLevelUp
} = require("../services/levels");

const {
  t
} = require("../services/i18n");


async function sendDirectConversation(
  bot,
  conversationId,
  text
) {
  if (!conversationId) {
    log.warn(
      "Direct",
      "Cannot send message: missing conversation ID."
    );

    return false;
  }

  if (
    typeof text !== "string" ||
    !text.trim()
  ) {
    log.warn(
      "Direct",
      "Cannot send message: message is empty."
    );

    return false;
  }

  try {
    const result =
      await bot.direct.send(
        conversationId,
        text
      );

    if (
      result &&
      !result.ok
    ) {
      log.warn(
        "Direct",
        result.error ||
          "Failed to send Direct message."
      );

      return false;
    }

    return true;

  } catch (error) {
    log.error(
      "Direct",
      error.stack ||
        error.message
    );

    return false;
  }
}


function registerDirectHandler(bot) {
  bot.on(
    "Direct",
    async (
      user,
      message,
      conversation
    ) => {
      try {
        await resolveOwnerId(bot);

        const conversationId =
          conversation?.id ||
          conversation;

        if (!conversationId) {
          log.warn(
            "DirectHandler",
            "Received direct event without a valid conversation ID."
          );

          return;
        }

        if (!user.username) {
          const found =
            await bot.room.users.find(
              user.id
            );

          if (
            found &&
            found.user
          ) {
            user.username =
              found.user.username;
          }
        }

        const content =
          String(
            message?.content || ""
          ).trim();

        if (!content) return;


        // --------------------------------------------------
        // Registration
        // --------------------------------------------------

        const registered =
          await handleRegistration(
            bot,
            user,
            message,
            conversation
          );

        if (registered) return;


        // --------------------------------------------------
        // Make sure user data exists
        // --------------------------------------------------

        const userData =
          getUserData(user.id);

        // Keep the latest Direct conversation ID.
        if (
          userData.conversationId !==
          conversationId
        ) {
          userData.conversationId =
            conversationId;
        }

        const userLang =
          getBotLanguage() || "ar";


        // --------------------------------------------------
        // Direct XP
        // --------------------------------------------------

        const xpResult =
          awardDirectXp(user.id);

        if (xpResult.leveledUp) {
          await sendDirectConversation(
            bot,
            conversationId,
            formatLevelUp(
              user,
              userLang,
              xpResult
            )
          );
        }

        const normalized =
          normalizeText(content);


        // --------------------------------------------------
        // 1. Bot Language
        // --------------------------------------------------

        const languageMatch =
          content.match(
            /^(?:lang|language)\s*(?:[:=]?\s*)?(ar|en)$/i
          );

        if (languageMatch) {
          // Owner only
          if (!isOwner(user)) {
            await sendDirectConversation(
              bot,
              conversationId,
              "👑 Only the bot owner can change the bot language."
            );

            return;
          }

          const requestedLanguage =
            languageMatch[1].toLowerCase();

          const changed =
            setBotLanguage(
              requestedLanguage
            );

          if (!changed) {
            await sendDirectConversation(
              bot,
              conversationId,
              "❌ Invalid language. Use: lang ar or lang en"
            );

            return;
          }

          const languageName =
            requestedLanguage === "ar"
              ? "العربية 🇪🇬"
              : "English 🇬🇧";

          await sendDirectConversation(
            bot,
            conversationId,
            `👑 Bot language changed to ${languageName}`
          );

          log.info(
            "Direct",
            `Owner changed bot language to: ${requestedLanguage}`
          );

          return;
        }


        // --------------------------------------------------
        // 2. Random dance
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
          if (
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
                conversationId
              }
            );

            const danceMsg =
              userLang === "ar"
                ? `💃 جاري تشغيل رقصة عشوائية لك:\n📌 **${randomEmote.name}** (#${randomEmote.number})`
                : `💃 Playing a random dance for you:\n📌 **${randomEmote.name}** (#${randomEmote.number})`;

            await sendDirectConversation(
              bot,
              conversationId,
              danceMsg
            );

            return;
          }
        }


        // --------------------------------------------------
        // 3. Help
        // --------------------------------------------------

        const helpKeywords = [
          "help",
          "commands",
          "الاوامر",
          "أوامر",
          "اوامر"
        ];

        if (
          helpKeywords.includes(
            normalized
          )
        ) {
          const helpMsg =
            t(
              "help",
              userLang
            );

          await sendDirectConversation(
            bot,
            conversationId,
            helpMsg
          );

          return;
        }


        // --------------------------------------------------
        // 4. Bot language configuration
        // --------------------------------------------------

        if (
          isOwner(user) &&
          !isBotLanguageConfigured()
        ) {
          await sendDirectConversation(
            bot,
            conversationId,
            "👑 Please configure bot language first:\nar / en"
          );

          return;
        }


        // --------------------------------------------------
        // 5. User commands
        // --------------------------------------------------

        const userCmd =
          await handleUserCommands(
            bot,
            user,
            message,
            userLang,
            conversationId
          );

        if (userCmd) return;


        // --------------------------------------------------
        // 6. Exact emote
        // --------------------------------------------------

        const exactEmote =
          resolveEmote(content);

        if (exactEmote) {
          await startEmote(
            bot,
            user,
            exactEmote,
            {
              conversationId
            }
          );

          return;
        }


        // --------------------------------------------------
        // 7. Repeat emote
        // --------------------------------------------------

        if (
          isRepeatRequest(content)
        ) {
          const last =
            getLastEmote(user.id);

          if (last) {
            await startEmote(
              bot,
              user,
              last,
              {
                conversationId
              }
            );

            return;
          }
        }


        // --------------------------------------------------
        // 8. Admin commands
        // --------------------------------------------------

        const adminDone =
          await handleAdminCommands(
            bot,
            user,
            message,
            {
              whisper: false
            }
          );

        if (adminDone) return;


        // --------------------------------------------------
        // 9. Natural emote requests
        // --------------------------------------------------

        if (
          looksLikeEmoteRequest(
            content
          )
        ) {
          await handleNaturalEmoteRequest(
            bot,
            user,
            content,
            userLang,
            conversation,
            {
              public: false
            }
          );

          return;
        }


        // --------------------------------------------------
        // 10. AI fallback
        // --------------------------------------------------

        const aiReply =
          await askGroq(
            user.id,
            content,
            userLang
          );

        if (aiReply) {
          await sendDirectConversation(
            bot,
            conversationId,
            aiReply
          );

          return;
        }

        const fallback =
          aiFallback(userLang);

        await sendDirectConversation(
          bot,
          conversationId,
          fallback
        );

      } catch (err) {
        log.error(
          "DirectHandler",
          err.stack ||
            err.message
        );
      }
    }
  );
}


module.exports =
  registerDirectHandler;