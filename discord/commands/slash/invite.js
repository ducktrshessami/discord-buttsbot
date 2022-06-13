const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const logMessage = require("../../utils/logMessage");
const { permissionValue } = require("../../../config/bot.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("I'll send a link so you can invite me somewhere else!"),
    callback: async function (interaction) {
        logMessage(await interaction.reply({
            fetchReply: true,
            content: `Invite me to another server!`,
            components: [new MessageActionRow({
                components: [new MessageButton({
                    style: "LINK",
                    label: "Invite",
                    url: `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=${permissionValue}&scope=bot%20applications.commands`
                })]
            })]
        }));
    }
};
