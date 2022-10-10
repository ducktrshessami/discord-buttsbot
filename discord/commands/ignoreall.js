const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require("discord.js");
const db = require("../../models");
const logMessage = require("../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignoreall")
        .setDescription("I won't buttify in any channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    callback: async function (interaction) {
        await interaction.deferReply();
        const guild = interaction.guild ?? await interaction.client.guilds.fetch(interaction.guildId);
        await guild.channels.fetchActiveThreads();
        await db.IgnoreChannel.bulkCreate(
            guild.channels.cache
                .filter(channel => channel.isTextBased() || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum)
                .map(channel => ({
                    id: channel.id,
                    GuildId: interaction.guildId
                })),
            { ignoreDuplicates: true }
        );
        logMessage(await interaction.editReply("Okay."));
    }
};
