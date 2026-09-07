const { loadBotPosition } = require("../services/positions");
const { resolveOwnerId } = require("../services/permissions");
const { getBotLanguage } = require("../services/language");
const { getTopPlayers } = require("../services/levels");
const log = require("../utils/logger");

let messageLoopStarted = false;

const PROMO_MESSAGES = {
  ar: [
    "<#7dd3fc>الڤايب محتاج upgrade\n<#fdfcdc>AI في الخاص وراديوهات وميوزك وموديريشن في مكان واحد\n<#fbbf24>beatly.click",
    "<#c4b5fd>من الخاص للروم كل حاجة ماشية مع بعض\n<#fdfcdc>AI وميوزك وراديوهات وموديريشن على Beatly\n<#fbbf24>beatly.click",
    "<#f9a8d4>مود الروم عليك والمساعدة علينا\n<#fdfcdc>AI ذكي وراديوهات وميوزك وموديريشن متجمعين هنا\n<#fbbf24>beatly.click",
    "<#86efac>اختار المود اللي يعجبك\n<#fdfcdc>راديوهات وميوزك وAI وموديريشن في عالم Beatly\n<#fbbf24>beatly.click",
    "<#fde68a>وراء Beatly في حكاية أكبر من شات\n<#fdfcdc>AI وراديوهات وميوزك وموديريشن شغالين مع بعض\n<#fbbf24>beatly.click",
    "<#67e8f9>الروم ليه مود والمود ليه Beatly\n<#fdfcdc>جرب AI والراديو والميوزك وأدوات الموديريشن\n<#fbbf24>beatly.click",
    "<#f0abfc>كل اللي محتاجه لجو الروم في مكانه\n<#fdfcdc>AI وراديوهات وميوزك وموديريشن من Beatly\n<#fbbf24>beatly.click",
    "<#a7f3d0>لو لسه ما شوفتش عالم Beatly\n<#fdfcdc>هتلاقي AI وراديوهات وميوزك وموديريشن في نفس المكان\n<#fbbf24>beatly.click",
    "<#93c5fd>خلي الروم أذكى وأروق\n<#fdfcdc>AI في الخاص وراديوهات وميوزك وموديريشن لـ Beatly\n<#fbbf24>beatly.click",
    "<#fda4af>مش مجرد بوت وخلاص\n<#fdfcdc>Beatly بيجمع AI والراديو والميوزك والموديريشن في تجربة واحدة\n<#fbbf24>beatly.click",
    "<#ddd6fe>من أول أغنية لآخر رسالة\n<#fdfcdc>AI وراديوهات وميوزك وموديريشن موجودين على Beatly\n<#fbbf24>beatly.click",
    "<#99f6e4>خلّي القعدة تمشي على مزاجك\n<#fdfcdc>اكتشف AI والراديوهات والميوزك والموديريشن مع Beatly\n<#fbbf24>beatly.click"
  ],
  en: [
    "<#7dd3fc>Give your room a real upgrade\n<#fdfcdc>Private AI radio music and moderation in one Beatly world\n<#fbbf24>beatly.click",
    "<#c4b5fd>More than a chat bot\n<#fdfcdc>Beatly brings together private AI radio music and moderation\n<#fbbf24>beatly.click",
    "<#f9a8d4>Your room vibe has a home\n<#fdfcdc>Explore private AI radio music and moderation with Beatly\n<#fbbf24>beatly.click",
    "<#86efac>Pick the vibe and let Beatly handle the rest\n<#fdfcdc>AI radio music and moderation all in one place\n<#fbbf24>beatly.click",
    "<#fde68a>Behind the bot is a whole Beatly world\n<#fdfcdc>Private AI radio music and moderation working together\n<#fbbf24>beatly.click",
    "<#67e8f9>For rooms that want more than the usual\n<#fdfcdc>Try Beatly private AI radio music and moderation\n<#fbbf24>beatly.click",
    "<#f0abfc>Everything a room needs for a better vibe\n<#fdfcdc>AI radio music and moderation from Beatly\n<#fbbf24>beatly.click",
    "<#a7f3d0>There is more to Beatly than meets the chat\n<#fdfcdc>Find private AI radio music and moderation at\n<#fbbf24>beatly.click",
    "<#93c5fd>Make the room smarter and smoother\n<#fdfcdc>Private AI radio music and moderation are waiting on Beatly\n<#fbbf24>beatly.click",
    "<#fda4af>One room one vibe one Beatly world\n<#fdfcdc>AI radio music and moderation together\n<#fbbf24>beatly.click",
    "<#ddd6fe>From the first song to the last message\n<#fdfcdc>Beatly connects private AI radio music and moderation\n<#fbbf24>beatly.click",
    "<#99f6e4>Build the room mood your way\n<#fdfcdc>Discover private AI radio music and moderation with Beatly\n<#fbbf24>beatly.click"
  ]
};

const lastPromoIndex = {
  ar: -1,
  en: -1
};

function getPeriodicPromo(language) {
  const locale = language === "en" ? "en" : "ar";
  const messages = PROMO_MESSAGES[locale];

  let index = Math.floor(Math.random() * messages.length);
  if (messages.length > 1 && index === lastPromoIndex[locale]) {
    index = (index + 1) % messages.length;
  }

  lastPromoIndex[locale] = index;
  return messages[index];
}

function formatHourlyLeaderboard(language) {
  const isEnglish = language === "en";
  const players = getTopPlayers(5);

  if (!players.length) {
    return isEnglish
      ? "<#fbbf24>🏆 Hourly Top Levels\n<#fdfcdc>No players on the board yet"
      : "<#fbbf24>🏆 توب اللفلات كل ساعة\n<#fdfcdc>لسه مفيش لاعبين في الترتيب";
  }

  const medals = ["🥇", "🥈", "🥉", "4", "5"];
  const rows = players.map((player, index) => {
    const name = String(player.username)
      .replace(/[\r\n<>]/g, "")
      .slice(0, 24);

    return isEnglish
      ? `<#fdfcdc>${medals[index]} ${name}  <#a78bfa>Level ${player.level}  <#94a3b8>${player.totalXp} XP`
      : `<#fdfcdc>${medals[index]} ${name}  <#a78bfa>لفل ${player.level}  <#94a3b8>${player.totalXp} XP`;
  });

  return isEnglish
    ? `<#fbbf24>🏆 Hourly Top 5 Levels\n${rows.join("\n")}`
    : `<#fbbf24>🏆 توب 5 لفلات كل ساعة\n${rows.join("\n")}`;
}

function startMessageLoop(bot) {
  if (messageLoopStarted) return;
  messageLoopStarted = true;

  setInterval(async () => {
    try {
      await bot.message.send(
        getPeriodicPromo(getBotLanguage())
      );
    } catch (error) {
      log.error("PeriodicMsg", error.message || String(error));
    }
  }, 600000);

  setInterval(async () => {
    try {
      await bot.message.send(
        formatHourlyLeaderboard(getBotLanguage())
      );
    } catch (error) {
      log.error(
        "HourlyLeaderboard",
        error.message || String(error)
      );
    }
  }, 60 * 60 * 1000);
}

function registerReadyHandler(bot) {
  // The SDK guide specifies Ready metadata.botId as the canonical bot identity.
  // `once` prevents duplicate initialization after reconnects.
  bot.once("Ready", async (metadata) => {
    try {
      const activeMetadata = metadata || bot.metadata;
      const roomName = activeMetadata?.room?.roomName || "Unknown";
      const botId = activeMetadata?.botId || bot.metadata?.botId;

      log.info("Ready", `Bot connected. Room: ${roomName}`);

      await resolveOwnerId(bot);
      startMessageLoop(bot);

      const savedPos = loadBotPosition();
      if (!savedPos) return;

      if (!botId) {
        log.warn("Ready", "Bot metadata did not include botId; saved position was not restored.");
        return;
      }

      setTimeout(async () => {
        try {
          const result = await bot.player.teleport(
            botId,
            savedPos.x,
            savedPos.y,
            savedPos.z,
            savedPos.facing
          );

          if (result && !result.ok) {
            log.warn("Ready", `Could not restore saved position: ${result.error || "request failed"}`);
            return;
          }

          log.info("Ready", "Bot restored to its saved position.");
        } catch (error) {
          log.warn("Ready", `Could not restore saved position: ${error.message || String(error)}`);
        }
      }, 2000);
    } catch (error) {
      log.error("ReadyHandler", error.stack || error.message || String(error));
    }
  });
}

module.exports = registerReadyHandler;
