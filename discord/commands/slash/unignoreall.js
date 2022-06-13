const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignoreall")
        .setDescription("I'll buttify in every channel!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD),
    callback: async function (interaction) {
        await interaction.deferReply();
        await db.IgnoreChannel.destroy({
            where: { GuildId: interaction.guildId }
        });
        logMessage(await interaction.editReply(`Okay ${interaction.client.responseEmojis.smile}`));
    }
};
