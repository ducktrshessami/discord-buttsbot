const { utils, Command } = require("discord-bot");
const { MessageEmbed } = require("discord.js");
const config = require("../../config/bot.json");

const pages = {
    "General": [
        "help",
        "ignoreme",
        "invite",
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
        "word"
    ]
};

function helpCommand(commands) {
    let embedPages;
    commands.push(new Command("help", function (message, args) {
        let cmd;
        if (args.length > 1) {
            cmd = commands.find(command => command.name.toLowerCase() === args[1].toLowerCase());
        }
        if (cmd) {
            let reply = [
                `\`${cmd.usage}\``,
                cmd.description,
                cmd.subtitle
            ]
                .filter(line => line)
                .join("\n");
            return utils.replyVerbose(message, reply);
        }
        else {
            return utils.sendPages(message.channel, embedPages, config.helpDuration)
        }
    }, {
        usage: "@buttsbot help [cmd]",
        description: "Display a command list or help text for a specific command.",
        subtitle: "<> denotes a required parameter, while [] denotes an optional one"
    }));
    embedPages = Object.keys(pages)
        .map(page => ({
            embeds: [new MessageEmbed({
                color: config.embedColor,
                title: `${page} Commands`,
                description: pages[page].sort()
                    .map(cmdName => `**${cmdName}:** ${commands.find(command => command.name === cmdName).description}`)
                    .join("\n")
            })]
        }));
}

module.exports = helpCommand;
