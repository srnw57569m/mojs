const { isAdmin, isOwner } = require("../services/permissions");
const {
  saveBotPosition,
  saveCreatedPosition,
  loadCreatedPosition,
  deleteCreatedPosition
} = require("../services/positions");
const { normalizeText } = require("../utils/text");
const log = require("../utils/logger");

// دالة مساعدة لإرسال الرسائل الخاصة مع التعامل مع خطأ عدم وجود المحادثة
async function safeWhisper(bot, userId, message) {
  try {
    await bot.whisper.send(userId, message);
  } catch (err) {
    log.error("WhisperError", `Failed to send whisper to ${userId}: ${err.message}`);
    try {
      const errorNotice = 
        `⚠️ @${userId} يرجى بدء محادثة مع البوت في الخاص أولاً لتتمكن من استقبال الرسائل!\n` +
        `⚠️ Please start a private chat/conversation with the bot first to receive PMs!`;
      await bot.room.message.send(errorNotice);
    } catch (e) {
      log.error("RoomMessageError", e.message);
    }
  }
}

// دالة متطورة للبحث عن موقع أي مستخدم في الغرفة
async function findRoomUserData(bot, identifier) {
  try {
    const response = await bot.room.users.get();
    
    // تفكيك استجابة Highrise SDK بغض النظر عن شكل الـ Structure
    let usersList = [];
    if (Array.isArray(response)) {
      usersList = response;
    } else if (response && Array.isArray(response.users)) {
      usersList = response.users;
    } else if (response && typeof response.values === "function") {
      usersList = Array.from(response.values());
    } else if (response && typeof response === "object") {
      usersList = Object.values(response);
    }

    const cleanIdentifier = String(identifier || "").toLowerCase().trim();

    for (const item of usersList) {
      if (!item) continue;

      // Highrise تُرجع أحياناً [user, position] أو { user, position }
      const uObj = item.user || item[0] || item;
      const posObj = item.position || item[1] || item.pos || null;

      if (uObj) {
        const userId = String(uObj.id || uObj.userId || "").toLowerCase();
        const username = String(uObj.username || "").toLowerCase();

        if (userId === cleanIdentifier || username === cleanIdentifier) {
          return {
            user: uObj,
            position: posObj
          };
        }
      }
    }
  } catch (err) {
    log.error("FindUserError", err.message);
  }
  return null;
}

// دالة مستخرجة للبحث عن المستخدم وموقعه بدقة من استجابة bot.room.users.get()
async function findRoomUserData(bot, targetUsername) {
  try {
    const rawData = await bot.room.users.get();
    
    // استخراج مصفوفة المستخدمين سواء كانت داخل rawData.users أو rawData مباشرة
    let usersList = [];
    if (rawData && Array.isArray(rawData.users)) {
      usersList = rawData.users;
    } else if (Array.isArray(rawData)) {
      usersList = rawData;
    } else if (rawData && typeof rawData.values === "function") {
      usersList = Array.from(rawData.values());
    } else if (typeof rawData === "object") {
      usersList = Object.values(rawData);
    }

    const cleanTarget = String(targetUsername).toLowerCase().trim();

    for (const entry of usersList) {
      if (!entry) continue;
      const uObj = entry.user || entry;
      if (uObj && uObj.username && String(uObj.username).toLowerCase() === cleanTarget) {
        return {
          user: uObj,
          position: entry.position || null
        };
      }
    }
  } catch (err) {
    log.error("FindUserError", err.message);
  }
  return null;
}

async function handleAdminCommands(bot, user, message, options = {}) {
  if (!isAdmin(user)) return false;

  const content = String(message.content || "").trim();
  if (!content) return false;

  const normalized = normalizeText(content);
  const lowerContent = content.toLowerCase();

  // --- أمر إيقاف البوت !shutdown ---
  if (normalized === "!shutdown" || normalized === "shutdown") {
    if (!isOwner(user)) return false;
    log.info("Admin", `Shutdown initiated by owner ${user.username}`);
    if (options.whisper) {
      await safeWhisper(bot, user.id, "🛑 Shutting down bot...");
    }
    if (bot.looper && typeof bot.looper.destroy === "function") {
      bot.looper.destroy();
    }
    if (typeof bot.destroy === "function") {
      bot.destroy();
    }
    process.exit(0);
  }

// --- أمر حفظ موقع البوت !setpos ---
  if (normalized === "!setpos" || normalized === "setpos") {
    try {
      // 1. تجربة البحث عن موقع الأدمن بالـ ID أو الـ Username
      let userData = await findRoomUserData(bot, user.id);
      if (!userData || !userData.position) {
        userData = await findRoomUserData(bot, user.username);
      }

      if (userData && userData.position) {
        const pos = userData.position;

        // 2. حفظ الموقع الجديد في الملفات
        saveBotPosition(pos);

        // 3. عمل Teleport للبوت فوراً باستخدام bot.self.id أو جلب ID البوت من قائمة الروم
        try {
          let botId = bot.self?.id || bot.info?.user?.id || bot.user?.id;

          // إذا لم يجد ID البوت، يبحث عنه في قائمة الغرفة باسمه
          if (!botId) {
            const botDataInRoom = await findRoomUserData(bot, "BeatlYBoT");
            if (botDataInRoom && botDataInRoom.user) {
              botId = botDataInRoom.user.id;
            }
          }

          if (botId) {
            await bot.player.teleport(botId, pos.x, pos.y, pos.z, pos.facing);
          } else {
            // fallback في حال تعذر الحصول على الـ ID
            await bot.move.walk(pos.x, pos.y, pos.z, pos.facing);
          }
        } catch (teleErr) {
          log.error("SetPosTeleport", `Failed to teleport bot: ${teleErr.message}`);
        }

        if (options.whisper) {
          await safeWhisper(bot, user.id, "✅ Bot position saved & teleported to your location!");
        }
      } else {
        if (options.whisper) {
          await safeWhisper(
            bot,
            user.id,
            "❌ Could not retrieve your position. Move a step and try again!"
          );
        }
      }
      return true;
    } catch (err) {
      log.error("Admin", `Failed to set position: ${err.message}`);
      return true;
    }
  }

  // --- أمر التحديث !refresh ---
  if (normalized === "!refresh" || normalized === "refresh") {
    if (options.whisper) {
      await safeWhisper(bot, user.id, "🔄 Refreshed.");
    }
    return true;
  }

  // --- أمر إنشاء نقطة انتقال !create tele ---
  if (
    lowerContent.startsWith("!create tele") ||
    lowerContent.startsWith("create tele")
  ) {
    const name = content.replace(/^!?create tele\s*/i, "").trim();
    if (name) {
      try {
        const adminData = await findRoomUserData(bot, user.username);
        if (adminData && adminData.position) {
          saveCreatedPosition(name, adminData.position);
          if (options.whisper) {
            await safeWhisper(bot, user.id, `✅ Teleport '${name}' created.`);
          }
        } else if (options.whisper) {
          await safeWhisper(bot, user.id, "❌ Could not get your current position.");
        }
      } catch (e) {
        log.error("Admin", `Failed to create tele: ${e.message}`);
      }
    } else if (options.whisper) {
      await safeWhisper(bot, user.id, "⚠️ Usage: !create tele <name>");
    }
    return true;
  }

  // --- أمر حذف نقطة انتقال !remove tele ---
  if (
    lowerContent.startsWith("!remove tele") ||
    lowerContent.startsWith("remove tele")
  ) {
    const name = content.replace(/^!?remove tele\s*/i, "").trim();
    if (name) {
      deleteCreatedPosition(name);
      if (options.whisper) {
        await safeWhisper(bot, user.id, `✅ Teleport '${name}' removed.`);
      }
    } else if (options.whisper) {
      await safeWhisper(bot, user.id, "⚠️ Usage: !remove tele <name>");
    }
    return true;
  }

  // --- أمر الانتقال السريع !tele ---
  if (
    lowerContent.startsWith("!tele") ||
    lowerContent.startsWith("tele")
  ) {
    const target = content.replace(/^!?tele\s*/i, "").trim();
    if (target) {
      const pos = loadCreatedPosition(target);
      if (pos) {
        try {
          await bot.player.teleport(user.id, pos.x, pos.y, pos.z, pos.facing);
          if (options.whisper) {
            await safeWhisper(bot, user.id, `⚡ Teleported to '${target}'.`);
          }
        } catch (e) {
          log.error("Admin", `Teleport error: ${e.message}`);
        }
      } else if (options.whisper) {
        await safeWhisper(bot, user.id, `❌ Teleport location '${target}' not found.`);
      }
    } else if (options.whisper) {
      await safeWhisper(bot, user.id, "⚠️ Usage: !tele <name>");
    }
    return true;
  }

  // --- أمر الذهاب إلى لاعب !goto @username ---
  if (
    lowerContent.startsWith("!goto") ||
    lowerContent.startsWith("goto")
  ) {
    const targetMention = String(
      content.replace(/^!?goto\s*/i, "").replace("@", "") || ""
    ).trim();

    if (targetMention) {
      try {
        const targetData = await findRoomUserData(bot, targetMention);

        if (!targetData || !targetData.user) {
          if (options.whisper) {
            await safeWhisper(bot, user.id, `❌ User '${targetMention}' not found in room.`);
          }
          return true;
        }

        if (!targetData.position) {
          if (options.whisper) {
            await safeWhisper(bot, user.id, `❌ Could not get position for @${targetData.user.username}`);
          }
          return true;
        }

        const { x, y, z, facing } = targetData.position;
        await bot.player.teleport(user.id, x, y, z, facing);

        if (options.whisper) {
          await safeWhisper(bot, user.id, `🚀 Teleported to @${targetData.user.username}.`);
        }
      } catch (e) {
        log.error("Admin", `Goto error: ${e.message}`);
      }
    } else if (options.whisper) {
      await safeWhisper(bot, user.id, "⚠️ Usage: !goto @username");
    }
    return true;
  }

  // --- أمر جلب لاعب !get @username ---
  if (
    lowerContent.startsWith("!get") ||
    lowerContent.startsWith("get")
  ) {
    const targetMention = String(
      content.replace(/^!?get\s*/i, "").replace("@", "") || ""
    ).trim();

    if (targetMention) {
      try {
        const targetData = await findRoomUserData(bot, targetMention);

        if (!targetData || !targetData.user) {
          if (options.whisper) {
            await safeWhisper(bot, user.id, `❌ User '${targetMention}' not found in room.`);
          }
          return true;
        }

        // جلب موقع الأدمن
        const adminData = await findRoomUserData(bot, user.username);
        if (!adminData || !adminData.position) {
          if (options.whisper) {
            await safeWhisper(bot, user.id, `❌ Could not determine your position.`);
          }
          return true;
        }

        const { x, y, z, facing } = adminData.position;
        await bot.player.teleport(targetData.user.id, x, y, z, facing);

        if (options.whisper) {
          await safeWhisper(bot, user.id, `🧲 Brought @${targetData.user.username} to you.`);
        }
      } catch (e) {
        log.error("Admin", `Get error: ${e.message}`);
      }
    } else if (options.whisper) {
      await safeWhisper(bot, user.id, "⚠️ Usage: !get @username");
    }
    return true;
  }

  // --- أمر جلب معلومات حساب !info @username ---
  if (
    lowerContent.startsWith("!info") ||
    lowerContent.startsWith("info")
  ) {
    const rawTarget = content.replace(/^!?info\s*/i, "").replace("@", "").trim();
    const target = String(rawTarget || user.username).trim();

    try {
      const profile = await bot.webapi.users.get(target);

      if (!profile || !profile.ok) {
        if (options.whisper) {
          await safeWhisper(bot, user.id, `❌ Could not find user: ${target}`);
        }
        return true;
      }

      const lines = [
        `\n👤 User: ${profile.username} \n(ID: ${profile.id})`,
        `👥 Followers: ${profile.followers} | Following: ${profile.following}`,
        `🎂 Joined: ${new Date(profile.joinedAt).toLocaleDateString()}`,
        `🔞 Voice Verified: ${profile.voiceEnabled ? "Yes" : "No"}`
      ];

      if (profile.bio) lines.push(`📝 Bio: ${profile.bio}`);
      if (profile.crew) lines.push(`🛡️ Crew: ${profile.crew.name}`);
      if (profile.countryCode) lines.push(`🌐 Country: ${profile.countryCode}`);
      if (profile.activeRoom) lines.push(`🏠 Active Room: ${profile.activeRoom.name}`);

      await safeWhisper(bot, user.id, lines.join("\n"));
    } catch (e) {
      log.error("Admin", `Info error: ${e.message}`);
    }
    return true;
  }

  return false;
}

module.exports = {
  handleAdminCommands
};
