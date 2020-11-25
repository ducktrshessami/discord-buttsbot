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
    new DiscordBot.Command("frequency", changeFreq, {
        usage: "@buttsbot frequency [number]",
        description: `Use this command to show or change how often I buttify messages!`,
        subtitle: `The default frequency is ${config.default.freq}.`
    }),
    new DiscordBot.Command("rate", changeRate, {
        usage: "@buttsbot rate [number]",
        description: `Use this command to show or change the amount of syllables buttified when I buttify a message!`,
        subtitle: `The default rate is ${config.default.rate}.`
    })
];
let responses = [
    new DiscordBot.Response(["buttsbot", "yes"], ":)"),
    new DiscordBot.Response(["buttsbot", "no"], ":("),
    new DiscordBot.Response("", "", checkButt, sendButt)
];
let client = new DiscordBot(config, commands, responses);

// Client event handling
client.on("ready", () => {
    console.info(`Logged in as ${client.user.username}#${client.user.discriminator}`);
});
client.on("configUpdate", updateConfig);
client.on("error", console.error);
client.on("shardDisconnect", restart);

// ios event handling
ios.on("line", (line) => {
    if (line.toLowerCase().trim() == "exit") {
        restart();
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

// Commands, responses, and helpers
function restart() {
    ios.close();
    client.destroy();
    throw "Logging off";
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

function checkButt(message) {
    let change = false;
    if (!config.servers[message.guild.id].freq) {
        change = true;
        config.servers[message.guild.id].freq = config.default.freq;
    }
    if (!config.servers[message.guild.id].rate) {
        change = true;
        config.servers[message.guild.id].rate = config.default.rate;
    }
    if (change) {
        updateConfig(config);
    }
    return !message.author.bot && message.guild && message.cleanContent && (Math.random() < (1 / config.servers[message.guild.id].freq));
}

function sendButt(message) {
    let buttified = buttify(message.cleanContent, config.servers[message.guild.id].rate);
    if (verifyButt(message.cleanContent, buttified)) {
        logMessage(message);
        sendMessage(message.channel, buttified);
    }
}

function verifyButt(original, buttified) {
    original = original.toLowerCase();
    buttified = buttified.toLowerCase();
    return original != buttified && buttified != "butt" && buttified != "butts";
}
