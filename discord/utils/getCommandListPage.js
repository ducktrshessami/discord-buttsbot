const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { embedColor } = require("../../config/bot.json");

let general;
let management;

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
    if (!general || !management) {
        await buildLines();
    }
    const embed = new EmbedBuilder()
        .setTitle(elevated ? "Management" : "General")
        .setColor(embedColor)
        .setDescription(elevated ? management : general);
    const prev = new ButtonBuilder()
        .setCustomId(elevated ? "helpPrevElevated" : "helpPrevGeneral")
        .setLabel("Prev")
        .setStyle(ButtonStyle.Secondary);
    const next = new ButtonBuilder()
        .setCustomId(elevated ? "helpNextElevated" : "helpNextGeneral")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder()
        .setComponents(prev, next);
    return {
        fetchReply: true,
        embeds: [embed],
        components: [row]
    };
}

module.exports = getCommandListPage;
