const log = require("../utils/logger");
const { awardTipXp } = require("../services/levels");

function registerTipHandler(bot) {
  bot.on("Tip", async (sender, receiver, item) => {
    try {
      log.info(
        "Tip",
        `${sender.username} tipped ${receiver.username} ${item.amount} ${item.type}`
      );
      awardTipXp(sender.id);
      awardTipXp(sender.id);
    } catch (err) {
      log.error("TipHandler", err.message);
    }
  });
}

module.exports = registerTipHandler;
