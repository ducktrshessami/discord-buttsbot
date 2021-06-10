const fs = require("fs").promises;
const readline = require("readline");
const DiscordBot = require("discord-bot");
const buttify = require("./buttify");
var config = require("../cfg/config.json");

const ios = new readline.Interface({
    input: process.stdin,
    output: process.stdout
});

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
        subtitle: `The default frequency is ${config.default.freq}. Also I only do this for the server owner.`
    }),
    new DiscordBot.Command("rate", changeRate, {
        owner: true,
        usage: "@buttsbot rate [number]",
        description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
        subtitle: `The default rate is ${config.default.rate}. Also I only do this for the server owner.`
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
    new DiscordBot.Response(["buttsbot", "yes"], ":)"),
    new DiscordBot.Response(["buttsbot", "no"], ":("),
    new DiscordBot.Response(["buttsbot", "please"], ";)"),
    new DiscordBot.Response("", "", checkButt, sendButt)
];
let client = new DiscordBot(config, commands, responses);

// Client event handling
client.on("ready", () => {
    console.info(`Logged in as ${client.user.username}#${client.user.discriminator}`);
    if (config.presence.presences.length) {
        client.loopPresences(config.presence.presences, config.presence.minutes);
    }
});
client.on("configUpdate", updateConfig);
client.on("error", console.error);
client.on("shardDisconnect", disconnect);

// ios event handling
ios.on("line", (line) => {
    if (line.toLowerCase().trim() == "exit") {
        disconnect();
    }
});

// Bot utils
function updateConfig(cfg) {
    config = cfg;
    return fs.writeFile(`${__dirname}/../cfg/config.json`, JSON.stringify(config, null, 4) + "\n").catch(console.error);
}

function logMessage(message) {
    console.log(`[${message.channel.guild.id}] ${message.author.username}#${message.author.discriminator}: ${message.cleanContent}`);
}

function sendMessage(channel, ...content) {
    return channel.send(...content).then(logMessage).catch(console.error);
}

function disconnect() {
    ios.close();
    client.destroy();
    throw "Logging off";
}

// Commands, responses, and helpers
function restart(message) {
    sendMessage(message.channel, "Be right back!").then(() => {
        client.destroy();
    });
}

function changeWord(message, args) {
    logMessage(message);
    if (args.length > 1) {
        config.servers[message.guild.id].word = args[1].toLowerCase();
        updateConfig(config);
        sendMessage(message.channel, `Buttification word changed to \`${config.servers[message.guild.id].word}\`!`);
    }
    else {
        sendMessage(message.channel, `I buttify messages with the word \`${config.servers[message.guild.id].word}\`!`);
    }
}

function changeFreq(message, args) {
    let n = parseInt(args[1]);
    logMessage(message);
    if (n && n > 0) {
        config.servers[message.guild.id].freq = n;
        updateConfig(config);
        sendMessage(message.channel, `Buttify frequency changed to one in every \`${config.servers[message.guild.id].freq}\` messages!`);
    }
    else {
        sendMessage(message.channel, `I buttify roughly one in every \`${config.servers[message.guild.id].freq}\` messages!\nTo change the frequency, use \`${this.usage}\`.\nDefault: \`${config.default.freq}\``);
    }
}

function changeRate(message, args) {
    let n = parseInt(args[1]);
    logMessage(message);
    if (n && n > 0) {
        config.servers[message.guild.id].rate = n;
        updateConfig(config);
        sendMessage(message.channel, `Buttify rate changed to one in every \`${config.servers[message.guild.id].rate}\` syllables per buttified message!`);
    }
    else {
        sendMessage(message.channel, `I buttify roughly one in every \`${config.servers[message.guild.id].rate}\` syllables per buttified message!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${config.default.rate}\``);
    }
}

function ignoreme(message) {
    logMessage(message);
    if (!config.ignoreList.includes(message.author.id)) {
        config.ignoreList.push(message.author.id);
        updateConfig(config);
        sendMessage(message.channel, `<@${message.author.id}> Okay :(`);
    }
    else {
        sendMessage(message.channel, `<@${message.author.id}> I'm already ignoring you.`);
    }
}

function unignoreme(message) {
    let i = config.ignoreList.indexOf(message.author.id);
    logMessage(message);
    if (i !== -1) {
        config.ignoreList.splice(i, 1);
        updateConfig(config);
        sendMessage(message.channel, `<@${message.author.id}> Okay :)`);
    }
    else {
        sendMessage(message.channel, `<@${message.author.id}> I'm not ignoring you!`);
    }
}

function ignorechannel(message) {
    logMessage(message);
    if (!config.servers[message.guild.id].ignoreList.includes(message.channel.id)) {
        config.servers[message.guild.id].ignoreList.push(message.channel.id);
        updateConfig(config);
        sendMessage(message.channel, `<@${message.author.id}> Okay.`);
    }
    else {
        sendMessage(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
    }
}

function unignorechannel(message) {
    let i = config.servers[message.guild.id].ignoreList.indexOf(message.channel.id);
    logMessage(message);
    if (i !== -1) {
        config.servers[message.guild.id].ignoreList.splice(i, 1);
        updateConfig(config);
        sendMessage(message.channel, `<@${message.author.id}> Okay :)`);
    }
    else {
        sendMessage(message.channel, `<@${message.author.id}> I'm not ignoring this channel!`);
    }
}

function checkButt(message) {
    let change = false;
    if (!config.servers[message.guild.id].word) {
        change = true;
        config.servers[message.guild.id].word = config.default.word;
    }
    if (!config.servers[message.guild.id].freq) {
        change = true;
        config.servers[message.guild.id].freq = config.default.freq;
    }
    if (!config.servers[message.guild.id].rate) {
        change = true;
        config.servers[message.guild.id].rate = config.default.rate;
    }
    if (!config.servers[message.guild.id].ignoreList) {
        change = true;
        config.servers[message.guild.id].ignoreList = [];
    }
    if (change) {
        updateConfig(config);
    }
    return (
        !message.author.bot &&
        message.guild &&
        message.cleanContent &&
        !config.servers[message.guild.id].ignoreList.includes(message.channel.id) &&
        !config.ignoreList.includes(message.author.id) &&
        (Math.random() < (1 / config.servers[message.guild.id].freq))
    );
}

function sendButt(message) {
    let buttified = buttify(message.cleanContent, config.servers[message.guild.id].word, config.servers[message.guild.id].rate);
    if (verifyButt(message.cleanContent, buttified, config.servers[message.guild.id].word)) {
        logMessage(message);
        sendMessage(message.channel, buttified);
    }
}

function verifyButt(original, buttified, word) {
    original = (original.match(/[a-z]+/gi) || []).join("").toLowerCase();
    buttified = (buttified.match(/[a-z]+/gi) || []).join("").toLowerCase();
    return original != buttified && buttified != word && buttified != `${word}s`;
}
