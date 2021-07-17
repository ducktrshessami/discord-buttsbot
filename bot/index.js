const DiscordBot = require("discord-bot");
const db = require("../models");
const buttify = require("./buttify");
const botConfig = require("../config/bot.json");
const presenceConfig = require("../config/presence.json");
const { default: defaultButt } = require("../config/butt.json");

const smile = process.env.RES_SMILE || ":D";
const frown = process.env.RES_FROWN || ":(";
const wink = process.env.RES_WINK || ";)";
const weird = process.env.RES_WEIRD || "O_o";

const commands = [
    new DiscordBot.Command("prefix", prefix, {
        usage: "@buttsbot prefix [prefix]",
        description: "View or change the command prefix!",
        subtitle: "Only admins can change it."
    }),
    new DiscordBot.Command("word", changeWord, {
        requirePerms: "ADMINISTRATOR",
        usage: "@buttsbot word [word]",
        description: "Use this command to show or change what word I buttify messages with!",
        subtitle: "I guess that only makes sense if the word is butt. Also I only do this for admins."
    }),
    new DiscordBot.Command("frequency", changeFreq, {
        requirePerms: "ADMINISTRATOR",
        usage: "@buttsbot frequency [number]",
        description: "Use this command to show or change how often I buttify messages!",
        subtitle: `The default frequency is ${defaultButt.frequency}. Also I only do this for admins.`
    }),
    new DiscordBot.Command("rate", changeRate, {
        requirePerms: "ADMINISTRATOR",
        usage: "@buttsbot rate [number]",
        description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
        subtitle: `The default rate is ${defaultButt.rate}. Also I only do this for admins.`
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
        requirePerms: "MANAGE_CHANNELS",
        usage: "@buttsbot ignorechannel",
        description: "I won't buttify in this channel.",
        subtitle: "I only do this for people who manage this channel."
    }),
    new DiscordBot.Command("unignorechannel", unignorechannel, {
        requirePerms: "MANAGE_CHANNELS",
        usage: "@buttsbot unignorechannel",
        description: "Undo ignorechannel!",
        subtitle: "I only do this for people who manage this channel."
    }),
    new DiscordBot.Command("ignoreall", ignoreall, {
        requirePerms: "ADMINISTRATOR",
        usage: "@buttsbot ignoreall",
        description: "I won't buttify in any channel.",
        subtitle: "I only do this for admins."
    }),
    new DiscordBot.Command("unignoreall", unignoreall, {
        requirePerms: "ADMINISTRATOR",
        usage: "@buttsbot unignoreall",
        description: "I'll buttify in every channel!",
        subtitle: "I only do this for admins."
    }),
    new DiscordBot.Command("invite", inviteLink, {
        usage: "@buttsbot invite",
        description: "I'll send a link so you can invite me somewhere else!"
    })
];
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
    botmins: process.env.BOT_ADMINS ? JSON.parse(process.env.BOT_ADMINS) : botConfig.botmins
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
}

// Commands, responses, and helpers
function prefix(message, args) {
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (args.length > 1 && message.member.hasPermission("ADMINISTRATOR")) {
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
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay ${frown}`));
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
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay ${smile}`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring you!`);
            }
        })
        .catch(console.error);
}

function createIgnoreChannel(guildID, channelID) {
    return db.IgnoreChannel.findByPk(channelID)
        .then(ignoredChannel => {
            if (!ignoredChannel) {
                return db.IgnoreChannel.create({
                    id: channelID,
                    GuildId: guildID
                })
                    .then(() => true);
            }
            else {
                return false;
            }
        });
}

function ignorechannel(message) {
    DiscordBot.utils.logMessage(message);
    createIgnoreChannel(message.guild.id, message.channel.id)
        .then(res => {
            if (res) {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay.`);
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
                    .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay ${smile}`));
            }
            else {
                return DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
            }
        })
        .catch(console.error);
}

function ignoreall(message) {
    Promise.all(
        message.guild.channels.cache.filter(channel => channel.type === "text")
            .map(channel => createIgnoreChannel(channel.guild.id, channel.id))
    )
        .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay.`))
        .catch(console.error);
}

function unignoreall(message) {
    db.IgnoreChannel.destroy({
        where: { GuildId: message.guild.id }
    })
        .then(() => DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay ${smile}`))
        .catch(console.error);
}

function inviteLink(message) {
    DiscordBot.utils.sendVerbose(message.channel, `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=265216&scope=bot`)
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
