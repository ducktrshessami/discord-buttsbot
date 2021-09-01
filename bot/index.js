const DiscordBot = require("discord-bot");
const db = require("../models");
const commands = require("./commands");
const buttify = require("./utils/buttify");
const postServerCount = require("./utils/postServerCount");
const initGuild = require("./utils/initGuild");
const botConfig = require("../config/bot.json");
const presenceConfig = require("../config/presence.json");

const smile = process.env.RES_SMILE || ":D";
const frown = process.env.RES_FROWN || ":(";
const wink = process.env.RES_WINK || ";)";
const weird = process.env.RES_WEIRD || "O_o";

const responses = [
    new DiscordBot.Response(["buttsbot", "yes"], smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "yeah"], smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "yea"], smile, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "no"], frown, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "please"], wink, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "pls"], wink, responseCheck, responseSender()),
    new DiscordBot.Response(["buttsbot", "why"], weird, responseCheck, responseSender()),
    new DiscordBot.Response("", "", checkButt, sendButt)
];
const client = new DiscordBot({
    ...botConfig,
    token: process.env.BOT_TOKEN || botConfig.token,
    botmins: process.env.BOT_ADMINS ? JSON.parse(process.env.BOT_ADMINS) : botConfig.botmins,
    getPrefix
}, commands, undefined, responses);

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

function getPrefix(message) {
    return db.Guild.findByPk(message.guildId)
        .then(guild => {
            if (guild && guild.prefix && message.content.toLowerCase().startsWith(guild.prefix.toLowerCase())) {
                return guild.prefix;
            }
            else {
                return (message.content.match(new RegExp(`^(<@!${this.user.id}>\\s|<@${this.user.id}>\\s)`, "i")) || [])[0];
            }
        });
}

function disconnect() {
    console.log("Logging off");
    client.destroy();
}

// Resposnes and helpers
function checkButt(message) {
    return Promise.all([
        db.IgnoreChannel.findByPk(message.channel.id),
        db.IgnoreUser.findByPk(message.author.id),
        db.Guild.findByPk(message.guild.id)
    ])
        .then(([ignoredChannel, ignoredUser, guild]) =>
            !message.author.bot &&
            message.guild &&
            message.cleanContent &&
            !ignoredChannel &&
            !ignoredUser &&
            (Math.random() < (1 / guild.frequency))
        )
        .catch(console.error);
}

function sendButt(message) {
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            let buttified = buttify(message.cleanContent, guild.word, guild.rate);
            if (verifyButt(message.cleanContent, buttified, guild.word)) {
                DiscordBot.utils.logMessage(message);
                return DiscordBot.utils.sendVerbose(message.channel, buttified);
            }
        })
        .catch(console.error);
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
    return (message, response) => {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, botConfig.responseCooldown);
            return DiscordBot.utils.sendVerbose(message.channel, response)
                .catch(console.error);
        }
    };
}

module.exports = client;
