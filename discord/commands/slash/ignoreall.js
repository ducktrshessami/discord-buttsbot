const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignoreall")
        .setDescription("I won't buttify in any channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD),
    callback: async function (interaction) {
        await interaction.deferReply();
        const guild = interaction.guild ?? await interaction.client.guilds.fetch(interaction.guildId);
        await guild.channels.fetchActiveThreads();
        await db.IgnoreChannel.bulkCreate(
            guild.channels.cache
                .filter(channel => channel.isText())
                .map(channel => ({
                    id: channel.id,
                    GuildId: interaction.guildId
                })),
            { ignoreDuplicates: true }
        );
        logMessage(await interaction.editReply("Okay."));
    }
};
