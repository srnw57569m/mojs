const { getBotLanguage } = require("./language");

const DICT = {
  registrationHint: {
    ar: "👋 أهلاً! أنا Beatly. عشان تستخدم الميزات الخاصة وتوصلك الإشعارات، ابعتلي في الخاص: register أو تسجيل.",
    en: "👋 Hey! I'm Beatly. To use private features and receive notifications, send me a private message with: register."
  },

  languageSetup: {
    ar: "👑 اختار لغة البوت بإرسال: ar — عربي أو en — English",
    en: "👑 Choose the bot language by sending: ar — Arabic or en — English"
  },

  registered: {
    ar: "✅ تم تسجيلك. تقدر تستخدم Beatly دلوقتي.",
    en: "✅ You're registered. You can use Beatly now."
  },

  languageChanged: {
    ar: "🇪🇬 تم تغيير لغة Beatly للعربي.",
    en: "🇬🇧 Beatly language changed to English."
  },

  help: {
    ar: "🤖 مساعدة Beatly:\n• ابعت اسم أو رقم الرقصة لتشغيلها.\n• ابعت stop أو توقف لإيقافها.\n• level / rank / xp لعرض مستواك.\n• ابعت تسجيل أو register في الخاص للتسجيل.",
    en: "🤖 Beatly Help:\n• Send an emote name or number to play it.\n• Send stop to stop it.\n• level / rank / xp to view your level.\n• Send register in private chat to register."
  },

  level: {
    ar: (u, l, x, n, p, b) =>
      `⭐ ${u}\nالمستوى: ${l}\nXP: ${x}/${n}\n${b} ${p}%`,

    en: (u, l, x, n, p, b) =>
      `⭐ ${u}\nLevel: ${l}\nXP: ${x}/${n}\n${b} ${p}%`
  },

  levelUp: {
    ar: (u, l, g, x, n, p, b) =>
      `\n✦ ✦ ✦ LEVEL UP ✦ ✦ ✦\n<#06d6a0>@${u} <#ffffff>وصلت للمستوى ${l}!\n<#ffd166>+${g} XP <#d2f2ff>• ${x}/${n} XP للمستوى الجاي\n<#a8dadc>${b} <#ffffff>${p}% <#a8dadc>جاهز للجولة اللي بعدها 🚀`,

    en: (u, l, g, x, n, p, b) =>
      `\n✦ ✦ ✦ LEVEL UP ✦ ✦ ✦\n<#06d6a0>@${u} <#ffffff>reached Level ${l}!\n<#ffd166>+${g} XP <#d2f2ff>• ${x}/${n} XP to the next level\n<#a8dadc>${b} <#ffffff>${p}% <#a8dadc>keep climbing 🚀`
  },

  moderation: {
    ar: (mod, act, target, dur) =>
      `🛡️ Moderation Alert\n👮 ${mod} قام بـ ${act} على ${target}${dur ? ` لمدة ${dur}` : ""}.`,

    en: (mod, act, target, dur) =>
      `🛡️ Moderation Alert\n👮 ${mod} performed ${act} on ${target}${dur ? ` for ${dur}` : ""}.`
  },

  actions: {
    ar: {
      kick: "طرد",
      mute: "كتم",
      unmute: "إلغاء الكتم",
      ban: "حظر",
      unban: "إلغاء الحظر"
    },

    en: {
      kick: "kick",
      mute: "mute",
      unmute: "unmute",
      ban: "ban",
      unban: "unban"
    }
  }
};

function lang(value) {
  return value === "en" ? "en" : "ar";
}

function t(key, language, ...args) {
  const l = lang(language || getBotLanguage());
  const value = DICT[key];

  // Key itself does not exist
  if (value === undefined || value === null) {
    return key;
  }

  // Direct function translation
  if (typeof value === "function") {
    return value(...args);
  }

  // Language-based translation
  if (typeof value === "object" && value[l] !== undefined) {
    const translated = value[l];

    // IMPORTANT:
    // Some translations are functions and need arguments.
    if (typeof translated === "function") {
      return translated(...args);
    }

    return translated;
  }

  return key;
}

function getLanguage() {
  return lang(getBotLanguage());
}

module.exports = {
  DICT,
  t,
  getLanguage,
  lang
};

