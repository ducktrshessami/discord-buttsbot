const DiscordBot = require("discord-bot");
const db = require("../models");
const commands = require("./commands");
const slashes = require("./slashes");
const buttify = require("./utils/buttify");
const postServerCount = require("./utils/postServerCount");
const initGuild = require("./utils/initGuild");
const botConfig = require("../config/bot.json");
const presenceConfig = require("../config/presence.json");

const emojis = {
    smile: process.env.RES_SMILE || ":D",
    frown: process.env.RES_FROWN || ":(",
    wink: process.env.RES_WINK || ";)",
    weird: process.env.RES_WEIRD || "O_o"
};
const responses = [
    new DiscordBot.Response(["buttsbot", "yes"], emojis.smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "yeah"], emojis.smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "yea"], emojis.smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "no"], emojis.frown, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "please"], emojis.wink, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "pls"], emojis.wink, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "plz"], emojis.wink, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "why"], emojis.weird, responseCheck, responseSender()),
    new DiscordBot.Response("", "", checkButt, sendButt, { requireGuild: true })
];
const client = new DiscordBot({
    ...botConfig,
    token: process.env.BOT_TOKEN || botConfig.token,
    botmins: [],
    getPrefix,
    slashForce: process.env.BOT_SLASHFORCE && process.env.BOT_SLASHFORCE.trim().toLowerCase() !== "false",
    responseEmojis: emojis
}, commands, slashes, responses);

// Client event handling
client.on("ready", () => {
    console.info(`Logged in as ${client.user.tag}`);
    client.loopPresences(presenceConfig.presences, presenceConfig.minutes);
    initAll();
    postServerCount(client);
})
    .on("guildCreate", guild => {
        postServerCount(client);
        initGuild(guild);
    })
    .on("guildDelete", () => postServerCount(client))
    .on("error", console.error)
    .on("shardDisconnect", disconnect);

// Minor bot utils
function initAll() {
    Promise.all(client.guilds.cache.map(initGuild))
        .catch(console.error);
}

async function getPrefix(message) {
    let guild = await db.Guild.findByPk(message.guildId);
    if (guild && guild.prefix && message.content.toLowerCase().startsWith(guild.prefix.toLowerCase())) {
        return guild.prefix;
    }
    else {
        return (message.content.match(new RegExp(`^(<@!${this.user.id}>\\s|<@${this.user.id}>\\s)`, "i")) || [])[0];
    }
}

function disconnect() {
    console.log("Logging off");
    client.destroy();
}

// Resposnes and helpers
async function checkButt(message) {
    if (message.author.id !== message.client.user.id) {
        let [ignoredChannel, ignoredUser, guild] = await Promise.all([
            db.IgnoreChannel.findByPk(message.channelId),
            db.IgnoreUser.findByPk(message.author.id),
            db.Guild.findByPk(message.guildId)
        ]);
        return !message.author.bot &&
            message.guild &&
            message.cleanContent &&
            !ignoredChannel &&
            !ignoredUser &&
            (Math.random() < (1 / guild.frequency));
    }
}

async function sendButt(message) {
    let guild = await db.Guild.findByPk(message.guildId);
    let buttified = buttify(message.cleanContent, guild.word, guild.rate);
    if (verifyButt(message.cleanContent, buttified, guild.word)) {
        DiscordBot.utils.logMessage(message);
        return DiscordBot.utils.sendVerbose(message.channel, buttified);
    }
}

function verifyButt(original, buttified, word) {
    original = (original.match(/[a-z]+/gi) || []).join("").toLowerCase();
    buttified = (buttified.match(/[a-z]+/gi) || []).join("").toLowerCase();
    return original != buttified && buttified != word && buttified != `${word}s`;
}

function responseCheck(message, trigger) {
    let splitContent = message.content.toLowerCase().trim().split(/\s/g);
    return trigger.every(tr => splitContent.includes(tr));
}

function responseSender() {
    let ready = true;
    return async (message, response) => {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, botConfig.responseCooldown);
            return DiscordBot.utils.sendVerbose(message.channel, response);
        }
    };
}

module.exports = client;
