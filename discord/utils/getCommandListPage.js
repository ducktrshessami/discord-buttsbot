const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { embedColor } = require("../../config/bot.json");

let general;
let management;
let built = false;

async function buildLines() {
    const generalLines = [];
    const managementLines = [];
    const { default: messageCommands } = await import("../commands/message/index.js");

    messageCommands.forEach(command => {
        const line = `**${command.data.name}:** ${command.data.description}`;
        if (command.data.requirePermissions) {
            managementLines.push(line);
        }
        else {
            generalLines.push(line);
        }
    });

    general = generalLines.join("\n");
    management = managementLines.join("\n");
}

async function getCommandListPage(elevated) {
    if (!built) {
        await buildLines();
    }
    const embed = new MessageEmbed({
        title: elevated ? "Management" : "General",
        color: embedColor,
        description: elevated ? management : general
    });
    const prev = new MessageButton({
        customId: elevated ? "helpPrevElevated" : "helpPrevGeneral",
        label: "Prev",
        style: "SECONDARY"
    });
    const next = new MessageButton({
        customId: elevated ? "helpNextElevated" : "helpNextGeneral",
        label: "Next",
        style: "PRIMARY"
    });
    return {
        fetchReply: true,
        embeds: [embed],
        components: [new MessageActionRow({
            components: [prev, next]
        })]
    };
}

module.exports = getCommandListPage;
