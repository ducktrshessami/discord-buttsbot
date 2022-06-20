const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const messageCommands = require("../commands/message");
const { embedColor } = require("../../config/bot.json");

const generalLines = [];
const managementLines = [];

messageCommands.forEach(command => {
    const line = `**${command.data.name}:** ${command.data.description}`;
    if (command.data.requirePermissions) {
        managementLines.push(line);
    }
    else {
        generalLines.push(line);
    }
});

const general = generalLines.join("\n");
const management = managementLines.join("\n");

function getCommandListPage(elevated) {
    const embed = new MessageEmbed({
        title: elevated ? "Management" : "General",
        color: embedColor,
        description: elevated ? general : management
    });
    const prev = new MessageButton({
        customId: elevated ? "helpPrevElevated" : "helpPrevGeneral",
        label: "Prev",
        style: "SECONDARY"
    });
    const next = new MessageButton({
        customId: elevated ? "helpPrevElevated" : "helpPrevGeneral",
        label: "Next",
        style: "PRIMARY"
    });
    return {
        embeds: [embed],
        components: [new MessageActionRow({
            components: [prev, next]
        })]
    };
}

module.exports = getCommandListPage;
