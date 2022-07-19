const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../../../models");
const { smile } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignoreall")
        .setDescription("I'll buttify in every channel!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    callback: async function (interaction) {
        await interaction.deferReply();
        await db.IgnoreChannel.destroy({
            where: { GuildId: interaction.guildId }
        });
        logMessage(await interaction.editReply(`Okay ${smile(interaction)}`));
    }
};
