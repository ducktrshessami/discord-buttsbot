const { utils, Command } = require("discord-bot");
const { MessageEmbed } = require("discord.js");
const config = require("../../config/bot.json");

const pages = {
    "General": [
        "invite",
        "help",
        "ignoreme",
        "prefix",
        "unignoreme"
    ],
    "Admin": [
        "frequency",
        "ignoreall",
        "ignorechannel",
        "rate",
        "unignoreall",
        "unignorechannel",
        "unignoreme",
        "word"
    ]
};

function helpCommand(commands) {
    var embed;
    commands.push(new Command("help", function (message, args) {
        let cmd;
        if (args.length > 1) {
            cmd = commands.find(command => command.name.toLowerCase() === args[1].toLowerCase());
        }
        if (cmd) {
            utils.replyVerbose(message, [
                `\`${target.usage}\``,
                target.description,
                target.subtitle
            ]
                .filter(line => line)
                .join("\n"))
                .catch(console.error);
        }
        else {
            utils.replyVerbose(message, embed)
                .catch(console.error);
        }
    }, {
        usage: "@buttsbot help [cmd]",
        description: "Display a command list or help text for a specific command.",
        subtitle: "<> denotes a required parameter, while [] denotes an optional one"
    }));
    embed = {
        embeds: [new MessageEmbed({
            color: config.embedColor,
            title: "Commands:",
            fields: Object.keys(pages)
                .map(field => ({
                    name: field,
                    value: pages[field].map(cmdName => `**${cmdName}:** ${commands.find(command => command.name === cmdName).description}`)
                }))
        })]
    };
}

module.exports = helpCommand;
