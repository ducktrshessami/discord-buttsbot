const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignorechannel")
        .setDescription("I won't buttify in this channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    callback: async function (interaction) {
        await interaction.deferReply();
        const [_, created] = await db.IgnoreChannel.findOrCreate({
            where: { id: interaction.channelId },
            defaults: { GuildId: interaction.guildId }
        });
        logMessage(await interaction.editReply(created ? "Okay." : "I'm already ignoring this channel."));
    }
};
