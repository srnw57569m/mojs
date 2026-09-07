const config = require("../config");
const log = require("../utils/logger");

const {
  generateGoodbye,
  addGoodbyeColor,
  cleanGreetingText,
  styleGreetingUsername
} = require("../services/ai");

const {
  getBotLanguage
} = require("../services/language");

function registerUserLeftHandler(bot) {
  bot.on("UserLeft", async (user) => {
    try {
      const username = String(
        user?.username || ""
      ).trim();

      if (!username) {
        log.warn(
          "UserLeft",
          "UserLeft event received without username."
        );
        return;
      }

      const language =
        getBotLanguage();

      log.info(
        "UserLeft",
        `User ${username} left.`
      );

      const aiMessage = await generateGoodbye(username, language);

      if (aiMessage) {
        await bot.message.send(addGoodbyeColor(aiMessage));
        log.info("UserLeft", `AI goodbye sent for ${username}.`);
        return;
      }

      // ======================================================
      // CONFIG MESSAGE (non-AI room message)
      // ======================================================

      if (Array.isArray(config.bye_message) && config.bye_message.length) {
        const validMsgs = config.bye_message.filter(Boolean);

        if (validMsgs.length) {
          const msg =
            validMsgs[Math.floor(Math.random() * validMsgs.length)];

          const rawMessage = String(msg).replace(
            /\{username\}/gi,
            username
          );

          const finalMessage = addGoodbyeColor(
            styleGreetingUsername(
              cleanGreetingText(rawMessage),
              username,
              "d64b4b",
              "ffd0d0"
            )
          );

          await bot.message.send(finalMessage);

          log.info(
            "UserLeft",
            `Fallback goodbye sent for ${username}: ${finalMessage}`
          );

          return;
        }
      }

      // ======================================================
      // FINAL FALLBACK
      // ======================================================

      const fallback =
       language === "en"
          ? `See you later ${username} 👋❤️`
          : `👋 ${username} مع السلامة يا نجم مستنيينك ترجع ❤️`;

      const finalMessage = addGoodbyeColor(
        styleGreetingUsername(
          cleanGreetingText(fallback),
          username,
          "d64b4b",
          "ffd0d0"
        )
      );

      await bot.message.send(finalMessage);

      log.info(
        "UserLeft",
        `Default goodbye sent for ${username}: ${finalMessage}`
      );
    } catch (err) {
      log.error(
        "UserLeftHandler",
        err?.stack ||
          err?.message ||
          String(err)
      );
    }
  });
}

module.exports =
  registerUserLeftHandler;
