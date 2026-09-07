const { getBotLanguage } = require("../services/language");
const log = require("../utils/logger");
const {
  generateWelcome,
  generateWelcomeBatch,
  addWelcomeColor,
  cleanGreetingText,
  styleGreetingUsername,
  protectMultipleUsernames
} = require("../services/ai");

let welcomeQueue = [];
let welcomeTimer = null;

const WELCOME_BATCH_DELAY = 2000;
const MAX_WELCOME_BATCH_SIZE = 5;

function cleanUsername(username) {
  return String(username || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
    .trim()
    .slice(0, 40);
}

function buildWelcomeMessage(usernames, language) {
  if (usernames.length !== 1) {
    return language === "en"
      ? "✨ Welcome everyone\nGlad youre here enjoy your time"
      : "✨ يا أهلا بيكم\nنورتوا الروم يا نجوم 🎉";
  }

  const username = cleanUsername(usernames[0]) || "نجم جديد";
  return language === "en"
    ? `✨ ${username} welcome to the room glad youre here 🎉`
    : `✨ ${username} نورت الروم يا نجم يلا بينا نعيش أجواء الروم 🎉`;
}

async function processWelcomeQueue(bot) {
  welcomeTimer = null;

  try {
    const batch = welcomeQueue.splice(0, MAX_WELCOME_BATCH_SIZE);
    const usernames = batch.map((item) => item.username).filter(Boolean);
    if (!usernames.length) return;

    const language = getBotLanguage();
    const aiMessage = usernames.length === 1
      ? await generateWelcome(usernames[0], language)
      : await generateWelcomeBatch(usernames, language);

    let welcomeMessage = aiMessage;
    if (!welcomeMessage) {
      welcomeMessage = cleanGreetingText(buildWelcomeMessage(usernames, language));
      welcomeMessage = usernames.length === 1
        ? styleGreetingUsername(welcomeMessage, usernames[0], "fdfcdc", "fff0a5")
        : protectMultipleUsernames(welcomeMessage, usernames, "fdfcdc", "fff0a5");
    }

    await bot.message.send(addWelcomeColor(welcomeMessage));
    log.info("UserJoined", `Welcome sent for ${usernames.length} user(s).`);
  } catch (error) {
    log.error("WelcomeQueue", error.stack || error.message || String(error));
  } finally {
    if (welcomeQueue.length && !welcomeTimer) {
      welcomeTimer = setTimeout(() => processWelcomeQueue(bot), WELCOME_BATCH_DELAY);
    }
  }
}

function queueUserWelcome(bot, user) {
  const username = cleanUsername(user?.username);
  if (!username) return;

  if (welcomeQueue.some((item) => item.username.toLowerCase() === username.toLowerCase())) {
    return;
  }

  welcomeQueue.push({ username });

  if (!welcomeTimer) {
    welcomeTimer = setTimeout(() => processWelcomeQueue(bot), WELCOME_BATCH_DELAY);
  }

  if (welcomeQueue.length >= MAX_WELCOME_BATCH_SIZE) {
    clearTimeout(welcomeTimer);
    welcomeTimer = null;
    processWelcomeQueue(bot);
  }
}

function registerUserJoinedHandler(bot) {
  bot.on("UserJoined", async (user) => {
    try {
      const username = cleanUsername(user?.username);
      if (!username) return;

      log.info("UserJoined", `User joined: ${username}`);
      queueUserWelcome(bot, user);
    } catch (error) {
      log.error("UserJoinedHandler", error.stack || error.message || String(error));
    }
  });
}

module.exports = registerUserJoinedHandler;
