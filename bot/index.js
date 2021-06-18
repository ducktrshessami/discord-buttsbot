const DiscordBot = require("discord-bot");
const buttify = require("./buttify");
const db = require("../models");
const botConfig = require("../config/bot.json");
const presenceConfig = require("../config/presence.json");
const defaultButt = require("../config/butt.json").default;

let commands = [
    new DiscordBot.Command("restart", restart, {
        admin: true,
        usage: "@buttsbot restart",
        description: "I go to sleep, and then (hopefully 😟) get right back up!",
        subtitle: "I only do this for my botmin though."
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
    token: process.env.BOT_TOKEN || botConfig.token
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
        console.log(id);
    }
}

function disconnect() {
    client.destroy();
    console.log("Logging off");
    process.exit();
}

// Commands, responses, and helpers
function restart(message) {
    DiscordBot.utils.sendVerbose(message.channel, "Be right back!").then(() => {
        client.destroy();
    });
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
    if (n && n > 0) {
        botConfig.servers[message.guild.id].freq = n;
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `Buttify frequency changed to one in every \`${botConfig.servers[message.guild.id].freq}\` messages!`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `I buttify roughly one in every \`${botConfig.servers[message.guild.id].freq}\` messages!\nTo change the frequency, use \`${this.usage}\`.\nDefault: \`${defaultButt.frequency}\``);
    }
}

function changeRate(message, args) {
    let n = parseInt(args[1]);
    DiscordBot.utils.logMessage(message);
    if (n && n > 0) {
        botConfig.servers[message.guild.id].rate = n;
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `Buttify rate changed to one in every \`${botConfig.servers[message.guild.id].rate}\` syllables per buttified message!`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `I buttify roughly one in every \`${botConfig.servers[message.guild.id].rate}\` syllables per buttified message!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${defaultButt.rate}\``);
    }
}

function ignoreme(message) {
    DiscordBot.utils.logMessage(message);
    if (!botConfig.ignoreList.includes(message.author.id)) {
        botConfig.ignoreList.push(message.author.id);
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :(`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm already ignoring you.`);
    }
}

function unignoreme(message) {
    let i = botConfig.ignoreList.indexOf(message.author.id);
    DiscordBot.utils.logMessage(message);
    if (i !== -1) {
        botConfig.ignoreList.splice(i, 1);
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :)`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring you!`);
    }
}

function ignorechannel(message) {
    DiscordBot.utils.logMessage(message);
    if (!botConfig.servers[message.guild.id].ignoreList.includes(message.channel.id)) {
        botConfig.servers[message.guild.id].ignoreList.push(message.channel.id);
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay.`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
    }
}

function unignorechannel(message) {
    let i = botConfig.servers[message.guild.id].ignoreList.indexOf(message.channel.id);
    DiscordBot.utils.logMessage(message);
    if (i !== -1) {
        botConfig.servers[message.guild.id].ignoreList.splice(i, 1);
        updateConfig(botConfig);
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> Okay :)`);
    }
    else {
        DiscordBot.utils.sendVerbose(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
    }
}

function checkButt(message) {
    let change = false;
    if (!botConfig.servers[message.guild.id].word) {
        change = true;
        botConfig.servers[message.guild.id].word = defaultButt.word;
    }
    if (!botConfig.servers[message.guild.id].freq) {
        change = true;
        botConfig.servers[message.guild.id].freq = defaultButt.frequency;
    }
    if (!botConfig.servers[message.guild.id].rate) {
        change = true;
        botConfig.servers[message.guild.id].rate = defaultButt.rate;
    }
    if (!botConfig.servers[message.guild.id].ignoreList) {
        change = true;
        botConfig.servers[message.guild.id].ignoreList = [];
    }
    if (change) {
        updateConfig(botConfig);
    }
    return (
        !message.author.bot &&
        message.guild &&
        message.cleanContent &&
        !botConfig.servers[message.guild.id].ignoreList.includes(message.channel.id) &&
        !botConfig.ignoreList.includes(message.author.id) &&
        (Math.random() < (1 / botConfig.servers[message.guild.id].freq))
    );
}

function sendButt(message) {
    let buttified = buttify(message.cleanContent, botConfig.servers[message.guild.id].word, botConfig.servers[message.guild.id].rate);
    if (verifyButt(message.cleanContent, buttified, botConfig.servers[message.guild.id].word)) {
        DiscordBot.utils.logMessage(message);
        DiscordBot.utils.sendVerbose(message.channel, buttified);
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
