/**
 * Welcome to highrise.bot
 * 
 * This file is your bot's brain.
 * Everything your bot does starts here.
 *
 * Before you start:
 *   1. Open your .env file
 *   2. Add your BOT_TOKEN and ROOM_ID
 *   3. Run: npm start
 *
 * Need help? → discord @oqs0_
 * or visit the Book → https://wk91p.github.io/highrise.bot/
 */

const { Highrise, Logger } = require('highrise.bot');
require('dotenv').config();

// Setup
// Your bot and logger live here.
// Change "MyBot" to whatever you want your bot to be
// called in the console.
const log = new Logger("MyBot");
const bot = new Highrise();

// Ready Event
// Fires ONCE when your bot connects.
// Great place for: greetings, setup, checks.
bot.once('Ready', async (metadata) => {
    log.info(`Bot`, `Online in ${metadata.room.roomName}`);
    log.info(`Bot`, `Running as ${metadata.botId}`);

    // Want to send a message when the bot connects?
    await bot.message.send("Hello everyone!");
});


// Chat Event
// Fires every time someone sends a message.
// user    → who sent it (user.id, user.username)
// message → what they sent (message.content)
//
// message.command() → the first word (!ping)
// message.args()    → everything after  (["hello", "world"])
bot.on('Chat', async (user, message) => {

    // Ignore messages from the bot itself
    // (this is handled automatically, but good to know)

    // ── Example Command ──────────────────
    // Type !ping in chat → bot replies Pong!
    if (message.command() === '!ping') {
        await bot.message.send(`Pong! 🏓`);
        return;
    }

    // ── Another Example ──────────────────
    // Type !hi → bot greets you by name
    if (message.command() === '!hi') {
        await bot.message.send(`Hey ${user.username}!`);
        return; // return indicate the if statement ends here
                // and will never contiune further
    }

    // Add your own commands below

});

// User Joined Event
// Fires every time someone enters the room.
// Great place for: welcome messages, greetings.
bot.on('UserJoined', async (user, position) => {
    // Welcome new users
    await bot.message.send(`Welcome, ${user.username}!`);
});


// Tip Event
// Fires when someone tips in the room.
// sender   → who tipped
// receiver → who received it
// currency → how much (currency.amount)
bot.on('Tip', async (sender, receiver, currency) => {
    // Thank tippers
    await bot.message.send(`Thanks for the ${currency.amount} gold, ${sender.username}!`);
});

// Connect
// This is the last line, it starts everything.
// Don't move it above the events or they won't work.
bot.login(process.env.BOT_TOKEN, process.env.ROOM_ID);