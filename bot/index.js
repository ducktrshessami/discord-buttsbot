const DiscordBot = require("discord-bot");
const buttify = require("./buttify");
const db = require("../models");
const botConfig = require("../config/bot.json");
const presenceConfig = require("../config/presence.json");
const defaultButt = require("../config/butt.json").default;

let commands = [
    new DiscordBot.Command("prefix", prefix, {
        usage: "@buttsbot prefix [prefix]",
        description: "View or change the command prefix",
        subtitle: "Only the server owner can change the prefix"
    }),
    new DiscordBot.Command("word", changeWord, {
        owner: true,
        usage: "@buttsbot word [word]",
        description: "Use this command to show or change what word I buttify messages with!",
        subtitle: "I guess that only makes sense if the word is butt. Also I only do this for the server owner."
    }),
    new DiscordBot.Command("frequency", changeFreq, {
        owner: true,
        usage: "@buttsbot frequency [number]",
        description: "Use this command to show or change how often I buttify messages!",
        subtitle: `The default frequency is ${defaultButt.frequency}. Also I only do this for the server owner.`
    }),
    new DiscordBot.Command("rate", changeRate, {
        owner: true,
        usage: "@buttsbot rate [number]",
        description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
        subtitle: `The default rate is ${defaultButt.rate}. Also I only do this for the server owner.`
    }),
    new DiscordBot.Command("ignoreme", ignoreme, {
        usage: "@buttsbot ignoreme",
        description: "I will never buttify anything you say."
    }),
    new DiscordBot.Command("unignoreme", unignoreme, {
        usage: "@buttsbot unignoreme",
        description: "Undo ignoreme!"
    }),
    new DiscordBot.Command("ignorechannel", ignorechannel, {
        owner: true,
        usage: "@buttsbot ignorechannel",
        description: "I won't buttify in this channel.",
    }),
    new DiscordBot.Command("unignorechannel", unignorechannel, {
        owner: true,
        usage: "@buttsbot unignorechannel",
        description: "Undo ignorechannel!"
    })
];
let responses = [
    new DiscordBot.Response(["buttsbot", "yes"], process.env.SMILE || ":D", responseCheck),
    new DiscordBot.Response(["buttsbot", "no"], process.env.FROWN || ":(", responseCheck),
    new DiscordBot.Response(["buttsbot", "please"], process.env.WINK || ";)", responseCheck),
    new DiscordBot.Response("", "", checkButt, sendButt)
];
let client = new DiscordBot({
    ...botConfig,
    token: process.env.BOT_TOKEN || botConfig.token,
    admin: process.env.BOT_ADMINS ? JSON.parse(process.env.BOT_ADMINS) : botConfig.admin
}, commands, responses);

// Client event handling
client.on("ready", () => {
    console.info(`Logged in as ${client.user.username}#${client.user.discriminator}`);
    client.loopPresences(presenceConfig.activities, presenceConfig.minutes);
});
client.on("configUpdate", updateConfig);
client.on("error", console.error);
client.on("shardDisconnect", disconnect);

// Bot utils
function updateConfig(config) {
    for (let id in config.servers) {
        db.Guild.findByPk(id)
            .then(guild => {
                if (guild) {
                    client.config.servers[id].prefix = guild.prefix;
                    return guild.update({ name: config.servers[id].name });
                }
                else {
                    return db.Guild.create({
                        ...config.servers[id],
                        id
                    });
                }
            })
            .catch(console.error);
    }
}

function disconnect() {
    client.destroy();
    console.log("Logging off");
    process.exit();
}

// Commands, responses, and helpers
function prefix(message, args) {
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (args.length > 1 && message.author.id === message.guild.ownerID) {
                this.client.config.servers[message.guild.id].prefix = args[1];
                return guild.update({ prefix: args[1] })
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `Custom prefix set to \`${args[1]}\``));
            }
            else {
                if (guild.prefix) {
                    return DiscordBot.utils.sendVerbose(message.channel, `Current custom prefix: \`${guild.prefix}\``);
                }
                else {
                    return DiscordBot.utils.sendVerbose(message.channel, "Custom prefix not set");
                }
            }
        })
        .catch(console.error);
}

function changeWord(message, args) {
    DiscordBot.utils.logMessage(message);
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (args.length > 1) {
                return guild.update({ word: args[1].toLowerCase() })
                    .then(updated => DiscordBot.utils.sendVerbose(message.channel, `Buttification word changed to \`${updated.word}\`!`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `I buttify messages with the word \`${guild.word}\`!`);
            }
        })
        .catch(console.error);
}

function changeFreq(message, args) {
    let n = parseInt(args[1]);
    DiscordBot.utils.logMessage(message);
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (n && n > 0) {
                return guild.update({ frequency: n })
                    .then(updated => DiscordBot.utils.sendVerbose(message.channel, `Buttify frequency changed to one in every \`${updated.frequency}\` messages!`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `I buttify roughly one in every \`${guild.frequency}\` messages!\nTo change the frequency, use \`${this.usage}\`.\nDefault: \`${defaultButt.frequency}\``);
            }
        })
        .catch(console.error);
}

function changeRate(message, args) {
    let n = parseInt(args[1]);
    DiscordBot.utils.logMessage(message);
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (n && n > 0) {
                return guild.update({ rate: n })
                    .then(updated => DiscordBot.utils.sendVerbose(message.channel, `Buttify rate changed to one in every \`${updated.rate}\` syllables per buttified message!`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `I buttify roughly one in every \`${guild.rate}\` syllables per buttified message!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${defaultButt.rate}\``);
            }
        })
        .catch(console.error);
}

function ignoreme(message) {
    DiscordBot.utils.logMessage(message);
    db.IgnoreUser.findByPk(message.author.id)
        .then(ignoredUser => {
            if (!ignoredUser) {
                return db.IgnoreUser.create({ id: message.author.id })
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :(`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm already ignoring you.`);
            }
        })
        .catch(console.error);
}

function unignoreme(message) {
    DiscordBot.utils.logMessage(message);
    db.IgnoreUser.findByPk(message.author.id)
        .then(ignoredUser => {
            if (ignoredUser) {
                return ignoredUser.destroy()
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :)`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring you!`);
            }
        })
        .catch(console.error);
}

function ignorechannel(message) {
    DiscordBot.utils.logMessage(message);
    db.IgnoreChannel.findByPk(message.channel.id)
        .then(ignoredChannel => {
            if (!ignoredChannel) {
                return db.IgnoreChannel.create({
                    id: message.channel.id,
                    GuildId: message.guild.id
                })
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay.`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
            }
        })
        .catch(console.error);
}

function unignorechannel(message) {
    DiscordBot.utils.logMessage(message);
    db.IgnoreChannel.findByPk(message.channel.id)
        .then(ignoredChannel => {
            if (ignoredChannel) {
                return ignoredChannel.destroy()
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :)`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
            }
        })
        .catch(console.error);
}

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

module.exports = client;
