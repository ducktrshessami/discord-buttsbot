const fs = require("fs").promises;
const readline = require("readline");
const DiscordBot = require("discord-bot");
const syllablize = require("syllablize");
var config = require("../cfg/config.json");

const ios = new readline.Interface({
    input: process.stdin,
    output: process.stdout
});

let commands = [
    new DiscordBot.Command("restart", restart, { admin: true }),
    new DiscordBot.Command("rate", changeRate, { usage: "@buttsbot rate [number]" })
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

function changeRate(message, args) {
    let n = parseInt(args[1]);
    logMessage(message);
    if (n && n > 0) {
        config.servers[message.guild.id].rate = n;
        updateConfig(config);
        sendMessage(message.channel, `Buttify rate changed to one in every \`${config.servers[message.guild.id].rate}\` messages!`);
    }
    else {
        sendMessage(message.channel, `I buttify roughly one in every \`${config.servers[message.guild.id].rate}\` messages!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${config.default.rate}\``);
    }
}

function checkButt(message) {
    let change = false;
    if (!config.servers[message.guild.id].rate) {
        change = true;
        config.servers[message.guild.id].rate = config.default.rate;
    }
    if (!config.servers[message.guild.id].max) {
        change = true;
        config.servers[message.guild.id].max = config.default.max;
    }
    if (change) {
        updateConfig(config);
    }
    return !message.author.bot && message.guild && message.cleanContent && (Math.random() < (1 / config.servers[message.guild.id].rate));
}

function sendButt(message) {
    const original = message.cleanContent.split(' ');
    let butts = Math.ceil(Math.random() * config.servers[message.guild.id].max);
    let syllables = original.map(syllablize);
    let buttified;
    for (let i = 0; i < butts; i++) {
        let x, y, check;
        do {
            check = syllables.every(word => word.every(syl => syl.includes("butt")));
            x = Math.floor(Math.random() * syllables.length);
            y = Math.floor(Math.random() * syllables[x].length);
        } while (!check && syllables[x][y].includes("butt"));
        if (!check) {
            syllables[x][y] = syllables[x][y][syllables[x][y].length - 1] == "s" ? "butts" : "butt";
        }
    }
    buttified = syllables.map(word => word.join("").split(""));
    for (let i = 0; i < original.length && i < buttified.length; i++) {
        for (let j = 0; j < original[i].length && j < buttified[i].length; j++) {
            if (original[i].charCodeAt(j) >= 65 && original[i].charCodeAt(j) <= 90) {
                buttified[i][j] = buttified[i][j].toUpperCase();
            }
        }
    }
    if (buttified != message.cleanContent) {
        logMessage(message);
        sendMessage(message.channel, buttified.map(butt => butt.join("")).join(' '));
    }
}
