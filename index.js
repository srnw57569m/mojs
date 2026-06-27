const { formToJSON } = require("axios");
const { Highrise, WebApi, GatewayIntentBits } = require("highrise.sdk");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require("colors");
const settings = {
    events: ['ready', 'playerJoin', 'playerTip', 'playerMove', 'playerReact', 'playerLeave', 'messages'],
    reconnect: 5
};

const taskGroup = {
  tasks: new Map(),

  createTask(user, promise) {
      this.cancelTask(user); // Ensures only one active task per user
      const task = {
          promise,
          cancel() {
              this.cancelled = true;
          },
          cancelled: false
      };
      this.tasks.set(user.username, task);
      return task;
  },

  cancelTask(user) {
      if (this.tasks.has(user.username)) {
          this.tasks.get(user.username).cancel();
          this.tasks.delete(user.username);
      }
  },

  cancelAllTasks(user) {
      if (!this.tasks.size) return; // If no tasks, no need to proceed
      for (const [key, task] of this.tasks.entries()) {
          if (key === user.username) {
              task.cancel();
              this.tasks.delete(key);
          }
      }
  },

  cancelAllUsers() {
      this.tasks.forEach(task => task.cancel());
      this.tasks.clear();
  }
};

// Example usage:
const user1 = { username: "Alice" };
const user2 = { username: "Bob" };

const task1 = taskGroup.createTask(user1, new Promise(resolve => setTimeout(resolve, 1000)));
const task2 = taskGroup.createTask(user2, new Promise(resolve => setTimeout(resolve, 2000)));

setTimeout(() => {
  taskGroup.cancelTask(user1); // Cancels Alice's task
  console.log("Cancelled Alice's task");
}, 500);

setTimeout(() => {
  taskGroup.cancelAllUsers(); // Cancels all tasks
  console.log("Cancelled all tasks");
}, 1500);


const emoteList = [
  [0, 'jetpack', 'hcc-jetpack'],
  [1, 'fairyfloat', 'idle-floating'],
  [2, 'fairytwirl', 'emote-looping'],
  [3, 'smooch', 'emote-kissing-bound'],
  [4, 'launch', 'emote-launch'],
  [5, 'float', 'emote-float'],
  [6, 'lust', 'emote-lust'],
  [7, 'creepypuppet', 'dance-creepypuppet'],
  [8, 'repose', 'sit-relaxed'],
  [9, 'enthused', 'idle-enthusiastic'],
  [10, 'anime', 'dance-anime'],
  [11, 'gravity', 'emote-gravity'],
  [12, 'toilet', 'idle-toilet'],
  [13, 'astro', 'emote-astronaut'],
  [14, 'flex', 'emoji-flex'],
  [15, 'timejump', 'emote-timejump'],
  [16, 'penguin', 'dance-pinguin'],
  [17, 'kawaii', 'dance-kawai'],
  [18, 'jinglebell', 'dance-jinglebell'],
  [19, 'skating', 'emote-iceskating'],
  [20, 'teleporting', 'emote-teleporting'],
  [21, 'energyball', 'emote-energyball'],
  [22, 'pushit', 'dance-employee'],
  [23, 'boxer', 'emote-boxer'],
  [24, 'creepycute', 'emote-creepycute'],
  [25, 'headblow', 'emote-headblowup'],
  [26, 'wrong', 'dance-wrong'],
  [27, 'weirdd', 'dance-weird'],
  [28, 'uwu', 'idle-uwu'],
  [29, 'snake', 'emote-snake'],
  [30, 'singing', 'idle_singing'],
  [31, 'model', 'emote-model'],
  [32, 'maniac', 'emote-maniac'],
  [33, 'snow', 'emote-snowangel'],
  [34, 'ride', 'emote-sleigh'],
  [35, 'icecream', 'dance-icecream'],
  [36, 'surprise', 'emote-pose6'],
  [37, 'touch', 'dance-touch'],
  [38, 'swordfight', 'emote-swordfight'],
  [39, 'airguitar', 'idle-guitar'],
  [40, 'zombie', 'emote-zombierun'],
  [41, 'fashion', 'emote-fashionista'],
  [42, 'curtsy', 'emote-curtsy'],
  [43, 'cutee', 'emote-cute'],
  [44, 'telek', 'emote-telekinesis'],
  [45, 'russian', 'dance-russian'],
  [46, 'blackpink', 'dance-blackpink'],
  [47, 'shopping', 'dance-shoppingcart'],
  [48, 'tiktok6', 'dance-tiktok11'],
  [49, 'tiktok5', 'dance-tiktok9'],
  [50, 'tiktok4', 'dance-tiktok8'],
  [51, 'tiktok3', 'idle-dance-tiktok4'],
  [52, 'tiktok2', 'dance-tiktok2'],
  [53, 'tiktok1', 'dance-tiktok10'],
  [54, 'hott', 'emote-hot'],
  [55, 'charge', 'emote-charging'],
  [56, 'greedy', 'emote-greedy'],
  [57, 'confused', 'emote-confused'],
  [58, 'punkguitar', 'emote-punkguitar'],
  [59, 'shy', 'emote-shy2'],
  [60, 'wildd', 'idle-wild'],
  [61, 'nervous', 'idle-nervous'],
  [62, 'hyped', 'emote-hyped'],
  [63, 'fishing', 'fishing-idle'],
  [64, 'frog', 'emote-frog'],
  [65, 'siu', 'emote-celebrationstep'],
  [66, 'snowballfight', 'emote-snowball'],
  [67, 'bow', 'emote-bow'],
  [68, 'thewave', 'emote-wave'],
  [69, 'tiredd', 'emote-tired'],
  [70, 'pennywise', 'dance-pennywise'],
  [71, 'superpose', 'emote-superpose'],  
  [72, 'pose8', 'emote-pose8'],
  [73, 'laugh', 'emote-laughing'],
  [74, 'kiss', 'emote-kiss'],
  [75, 'hellos', 'emote-hello'],
  [76, 'gift', 'emote-gift'],
  [77, 'pose10', 'emote-pose10'],
  [78, 'thumbsup', 'emoji-thumbsup'],
  [79, 'cursing', 'emoji-cursing'],
  [80, 'celebrate', 'emoji-celebrate'],
  [81, 'macarena', 'dance-macarena'],
  [82, 'sitt', 'idle-loop-sitfloor'],
  [83, 'gag', 'emoji-gagging'],          
  [84, 'superpose', 'emote-superpose'],
  [85, 'pose7', 'emote-pose7'],
  [86, 'deny', 'emote-no'],
  [87, 'casual', 'idle-dance-casual'],   
  [88, 'pose1', 'emote-pose1'],
  [89, 'pose3', 'emote-pose3'],
  [90, 'pose5', 'emote-pose5'],
  [91, 'cutey', 'emote-cutey'],
  [92, 'thatsright', 'emote-yes'],
  [93, 'pose9', 'emote-pose9'],
  [94, 'angryy', 'emoji-angry'],   
  [95, 'miningmine', 'mining-mine'],
  [96, 'miningsuccess', 'mining-success'],
  [97, 'fishingpull', 'fishing-pull'],
  [98, 'fishingpullsmall', 'fishing-pull-small'],
  [99, 'fishingcast', 'fishing-cast'],
  [100, 'rest', 'sit-idle-cute'],
];

const emoteDurations = {
  'flex': 2.099351
};

// Load configuration from config.json
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error(chalk.red("[ERROR] Configuration file (config.json) not found!"));
  process.exit(1);
}

const config = require(configPath);
const welcomeMessages = config.welcome_message || [];
const byeMessages = config.bye_message || [];
const admins = new Set(config.admins || []);
// Validate configuration
if (!config.token || !config.room || !config.owner || !config.welcome_message || !config.bye_message || !config.admins) {
  console.error(chalk.red("[ERROR] Missing required fields in config.json: token, room, owner, welcome_message, or bye_message"));
  process.exit(1);
}

// Utility function for delaying execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms * 1000));
const bot = new Highrise({
    intents: [
      GatewayIntentBits.Ready,
      GatewayIntentBits.Messages,
      GatewayIntentBits.Joins,
      GatewayIntentBits.Leaves,
      GatewayIntentBits.Error,
      GatewayIntentBits.Reactions,
      GatewayIntentBits.Movements,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Tips
    ],
    cache: true,
    AutoFetchMessages: true
  }, settings.reconnect);
require("colors");
// Bot position storage
let botPosition = null;

// Save bot position to a JSON file
function saveBotPosition() {
  const locData = {
      bot_position: botPosition ? { x: botPosition.x, y: botPosition.y, z: botPosition.z, facing: botPosition.facing } : null,
      admins: [config.owner]
  };
  const filePath = path.join(__dirname, 'bot_pos.json');
  try {
      fs.writeFileSync(filePath, JSON.stringify(locData, null, 2), { encoding: 'UTF-8' });
      console.log("[INFO] Bot position saved successfully.");
  } catch (error) {
      console.error(`[ERROR] Failed to save bot position: ${error.message}`);
  }
}

// Load bot position from a JSON file
function loadBotPosition() {
  const filePath = path.join(__dirname, 'bot_pos.json');
  try {
      if (!fs.existsSync(filePath)) {
          console.log("[INFO] No saved bot position found. Starting at default position.");
          return false;
      }

      const locData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const pos = locData.bot_position;
      if (pos && pos.x !== undefined && pos.y !== undefined && pos.z !== undefined && pos.facing !== undefined) {
          botPosition = pos;
          console.log("[INFO] Bot position loaded successfully.");
          return true;
      }
  } catch (err) {
      console.error(`[ERROR] Failed to load bot position: ${err.message}`);
  }
  return false;
}

const positionsFolder = path.join(__dirname, 'Positions');
if (!fs.existsSync(positionsFolder)) {
    fs.mkdirSync(positionsFolder, { recursive: true });
}

// Save position function
function saveCreatedPosition(name, position, restricted = false) {
    const filePath = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    const data = { position, restricted };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Load position function
function loadCreatedPosition(name) {
    const filePath = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return [data.position, data.restricted];
    }
    return [null, false];
}

// Delete position function
function deleteCreatedPosition(name) {
    const filePath = path.join(positionsFolder, `${name.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

async function handleCommand(user, message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage === "stop" || lowerMessage === "توقف") {
      await stopEmote(user);
      return;
  }
  
  let emoteId = "";
  let emoteName = "";
  
  if (!isNaN(message)) {
      const emoteNumber = parseInt(message);
      for (const emote of emoteList) {
          if (emote[0] === emoteNumber) {
              emoteName = emote[1];
              emoteId = emote[2];
              break;
          }
      }
  } else {
      for (const emote of emoteList) {
          if (emote[1].toLowerCase() === message.toLowerCase()) {
              emoteName = emote[1];
              emoteId = emote[2];
              break;
          }
      }
  }
  
  if (emoteId !== "") {
      await startEmote(user, emoteId, emoteName);
  }
}

async function startEmote(user, emoteId, emoteName) {
  taskGroup.cancelAllTasks(user); // Stop any previous emote task

  const task = taskGroup.createTask(user, (async () => {
      await bot.whisper.send(user.id, `🎭 You are now performing [${emoteName}]! Type 'Stop' to stop.`);
      const sleepDuration = emoteDurations[emoteName.toLowerCase()] || 10;
      
      while (!task.cancelled) {
          await bot.player.emote(user.id, emoteId);
          await sleep(sleepDuration);
      }
  })());
}

async function stopEmote(user) {
  taskGroup.cancelAllTasks(user);
  await bot.whisper.send(user.id, "🛑 All emotes stopped.");
}

function loadDynamicPositions() {
  const positions = {};

  fs.readdirSync(positionsFolder).forEach(file => {
      const name = path.parse(file).name;
      const filePath = path.join(positionsFolder, `${name.toLowerCase()}.json`);
      if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          positions[name] = [data.position, data.restricted];
      }
  });

  return positions;
}


function loadConfig() {
    try {
        const configData = fs.readFileSync("config.json", "utf8");
        return JSON.parse(configData);
    } catch (error) {
        console.error("Error loading config.json:", error);
        return {};
    }
}

function startMessageLoop() {
  setInterval(async () => {
      await bot.message.send("Made By BeatlY\n join us at:\nwwww.beatly.click");
  }, 600000); // 10 minutes in milliseconds
}

// Listen for the ready event
bot.on('ready', async (session) => {
  botUserId = session.user_id; // Save bot's user ID
  startMessageLoop();
  // Teleport bot to saved position or default position
  const positionLoaded = loadBotPosition();
  if (positionLoaded) {
    await bot.player.teleport(session.user_id, botPosition.x, botPosition.y, botPosition.z, botPosition.facing);
    await bot.message.send("IMade By BeatlY\n join us at:\nwwww.beatly.click")
  } else {
    await bot.player.teleport(session.user_id, 0, 0, 0);
    await bot.message.send("Made By BeatlY\n join us at:\nwwww.beatly.click")
  }
  const outfit = [
        {
          type: 'clothing',
          amount: 1,
          id: 'body-flesh',
          account_bound: false,
          active_palette: 0
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'eye-n_basic2018zanyeyes',
          account_bound: false,
          active_palette: 7
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'eyebrow-n_21',
          account_bound: false,
          active_palette: 1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'nose-n_01',
          account_bound: false,
          active_palette: 0
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'pants-n_room12019rippedpantsblack',
          account_bound: false,
          active_palette: -1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'watch-n_room32019blackwatch',
          account_bound: false,
          active_palette: -1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'shirt-n_room12019buttondownblack',
          account_bound: false,
          active_palette: 0
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'shoes-n_room12019sneakersblack',
          account_bound: false,
          active_palette: -1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'hair_back-n_malenew04',
          account_bound: false,
          active_palette: 1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'hair_front-n_malenew04',
          account_bound: false,
          active_palette: 1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'mouth-basic2018lollipop',
          account_bound: false,
          active_palette: -1
        },
        {
          type: 'clothing',
          amount: 1,
          id: 'glasses-n_10',
          account_bound: false,
          active_palette: -1
        }
      ];
      //bot.outfit.change(outfit).catch(e => console.error(e));
  });

// Handle tip events
bot.on('tip', async (sender, receiver, tip) => {
  console.log(chalk.cyan(`[${new Date().toLocaleTimeString()}] ${sender.username} tipped ${receiver.username}: ${tip.amount}G`));
  await bot.message.send(`Thank you so much for the tip, ${sender.username}! 🥰`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red(`[ANTI-CRASH] Unhandled Rejection: ${reason}, promise: ${promise}`));
});

bot.on("playerJoin", async (user) => {

  if (welcomeMessages.length > 0) {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      await bot.message.send(`${randomMessage} ${user.username}`);
  }
});

bot.on("playerLeave", async (user) => {
  console.log(`Player left: ${user.username}`);

  if (byeMessages.length > 0) {
      const randomMessage = byeMessages[Math.floor(Math.random() * byeMessages.length)];
      await bot.message.send(`${randomMessage} ${user.username}`);
  }
});


// Handle chat messages
bot.on('chatCreate', async (user, message) => {
  const lowerMessage = message.toLowerCase();
  const parts = message.split(" ");
  await handleCommand(user, message);

  // Check if user is the owner or an admin
  if (user.username === config.owner || user.username === config.admins) {

    // /shutdown command
    if (message.startsWith("/shutdown")) {
        await bot.message.send("Initializing shut down.");
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        await bot.message.send("Shutting down.");
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        process.exit(0); // Exit the process
    }

    // /setpos command
    if (message.startsWith("/setpos")) {
        console.log(`[DEBUG] Attempting to retrieve position for user ID: ${user.id}`);
  
        try {
            // Retrieve all cached players
            const players = await bot.room.players.cache.get();
  
            // Find the correct player entry
            const playerEntry = players.find(p => p[0].id === user.id);
  
            // Check if player exists and has a valid position
            if (!playerEntry) {
                console.error(`[ERROR] Failed to retrieve position for user ID: ${user.id}`);
                await bot.message.send("Failed to retrieve your position. Please move around and try again.");
                return;
            }
  
            // Extract position from the second element in the array
            const position = playerEntry[1];
    
            // Save position
            botPosition = position;
            saveBotPosition();

            await bot.message.send("Bot position set! Refreshing...");

            // Wait for a moment before refreshing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Ensure botUserId is set before teleporting
            if (!botUserId) {
                console.error("[ERROR] Bot user ID is not set. Unable to teleport.");
                await bot.message.send("Error: Could not teleport bot. Please restart the bot and try again.");
                return;
            }

            // Refresh the bot by teleporting it to the new position
            await bot.player.teleport(botUserId, botPosition.x, botPosition.y, botPosition.z, botPosition.facing);

            await bot.message.send("Bot has been refreshed to the new position!");

        } catch (error) {
            console.error(`[ERROR] Error fetching player data: ${error.message}`);
            await bot.message.send("An error occurred while retrieving your position.");
        }
    }

    // /refresh command
    if (message.startsWith("/refresh")) {
        await bot.message.send("Refreshing the bot. Please wait...");
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
  
        try {
            // Reload bot position from saved data
            const positionLoaded = loadBotPosition();
  
            // Ensure botUserId is set before teleporting
            if (!botUserId) {
                console.error("[ERROR] Bot user ID is not set. Unable to teleport.");
                await bot.message.send("Error: Could not teleport bot. Please restart the bot and try again.");
                return;
            }
  
            if (positionLoaded) {
                await bot.player.teleport(botUserId, botPosition.x, botPosition.y, botPosition.z, botPosition.facing);
                await bot.message.send("Bot position refreshed successfully!");
            } else {
                await bot.message.send("No saved position found. The default position has been set to (0, 0, 0). Please stand in the desired location and use `/setpos` to save it.");
                await bot.player.teleport(botUserId, 0, 0, 0);
            }
  
            await bot.message.send("Bot has been refreshed and is ready to go!");
        } catch (error) {
            console.error(`[ERROR] Failed to refresh bot: ${error.message}`);
            await bot.message.send("An error occurred while refreshing the bot. Please check the logs.");
        }
    }

    if (message.toLowerCase().startsWith("/tele ")) {
      const args = message.split(" ").slice(1);
      
      const dynamicPositions = loadDynamicPositions();
      const positions = { ...dynamicPositions };

      if (args.length < 2) {
          await bot.whisper.send(user.id, "Usage: /tele <@username> <position>");
          return;
      }
      
      if (!args[0].startsWith("@")) {
          await bot.whisper.send(user.id, "Invalid user format. Please use '@username'.");
          return;
      }

      const username = args[0].substring(1).toLowerCase();
      const positionName = args.slice(1).join(" ").toLowerCase();

      const dest = positions[positionName];
      if (!dest) {
          await bot.whisper.send(user.id, "Unknown location");
          return;
      }

      const roomUsers = await bot.room.players.cache.get();
      const userId = roomUsers.find(([p]) => p.username.toLowerCase() === username)?.[0].id;
      
      if (!userId) {
          await bot.whisper.send(user.id, `${username} is not in the room.`);
          return;
      }

      if (dest[0].x !== undefined && dest[0].y !== undefined && dest[0].z !== undefined) {
          await bot.player.teleport(userId, dest[0].x, dest[0].y, dest[0].z);
          await bot.whisper.send(user.id, `Teleported ${args[0].substring(1)} to ${positionName})`);
      } else {
          await bot.whisper.send(user.id, "Invalid position coordinates. Please check the position file.");
      }
    }    
    if (message.startsWith("/here ")) {
      const parts = message.split(" ");
      if (parts.length < 2 || !parts[1].startsWith("@")) {
          await bot.whisper.send(user.id, "Usage: /here @username");
          return;
      }

      const targetUsername = parts[1].substring(1).toLowerCase();

      try {
          // Retrieve all cached players
          const players = await bot.room.players.cache.get();

          // Find the target player entry
          const targetEntry = players.find(p => p[0].username.toLowerCase() === targetUsername);

          if (!targetEntry) {
              await bot.whisper.send(user.id, `${targetUsername} is not in the room.`);
              return;
          }

          // Find the user entry to get the current user's position
          const userEntry = players.find(p => p[0].id === user.id);

          if (!userEntry) {
              await bot.whisper.send(user.id, "Unable to retrieve your position. Please move around and try again.");
              return;
          }

          // Extract current user's position
          const currentPosition = userEntry[1];

          // Teleport the target user to the current user's position
          await bot.player.teleport(targetEntry[0].id, currentPosition.x, currentPosition.y, currentPosition.z, currentPosition.facing);
          await bot.whisper.send(user.id, `Teleported ${targetUsername} to your position.`);

      } catch (error) {
          console.error(`[ERROR] Error fetching player data: ${error.message}`);
          await bot.whisper.send(user.id, "An error occurred while teleporting the user.");
      }
  }
    if (lowerMessage.startsWith("/create tele ")) {
      
      const positionName = parts[2];
      const restricted = parts.length > 3 && parts[3].toLowerCase() === "restricted";
      
      const roomUsers = await bot.room.players.cache.get();
      const playerEntry = roomUsers.find(p => p[0].id === user.id);

      if (playerEntry) {
          const currentPosition = playerEntry[1];
          saveCreatedPosition(positionName, currentPosition, restricted);
          await bot.message.send(`Position '${positionName}' saved for teleport (restricted=${restricted}).`);
      } else {
          await bot.message.send("Unable to save your current position.");
      }
    }

    else if (lowerMessage.startsWith("/remove tele ")) {
      
      const positionName = message.substring(13).trim();
      if (deleteCreatedPosition(positionName)) {
          await bot.message.send(`Position '${positionName}' removed.`);
      } else {
          await bot.message.send(`Position '${positionName}' not found.`);
      }
    }
  
    else if (fs.existsSync(path.join(positionsFolder, `${lowerMessage}.json`))) {
      const [savedPosition, restricted] = loadCreatedPosition(lowerMessage);
      
      if (restricted) {
          const privilegeResponse = await bot.room.players.fetch(user.id);
          if (!privilegeResponse.moderator && user.username.toLowerCase() !== config.owner) {
              await bot.message.send(`@${user.username}, you don't have permission to access this teleport.`);
              return;
          }
      }
      if (savedPosition) {
        await bot.player.teleport(user.id, savedPosition.x, savedPosition.y, savedPosition.z, savedPosition.facing);
    }
    }
  }
});


bot.on('error', (error) => {
    console.log(`Highrise API Request Error:`, error);
  });

// Login to the room
bot.login(config.token, config.room)
