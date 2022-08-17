const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const logMessage = require("../../utils/logMessage");
const { permissionValue } = require("../../../config/discord.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("I'll send a link so you can invite me somewhere else!"),
    callback: async function (interaction) {
        logMessage(await interaction.reply({
            fetchReply: true,
            content: "Invite me to another server!",
            components: [
                new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("Invite")
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=${permissionValue}&scope=bot%20applications.commands`)
                    )
            ]
        }));
    }
};
