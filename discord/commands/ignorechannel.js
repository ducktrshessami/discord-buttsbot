const {
    PermissionFlagsBits,
    SlashCommandBuilder,
    ChannelType
} = require("discord.js");
const db = require("../../models");
const logMessage = require("../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignorechannel")
        .setDescription("I won't buttify in this channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel for me to ignore. Defaults to the channel you use this in.")
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement,
                    ChannelType.AnnouncementThread,
                    ChannelType.PublicThread,
                    ChannelType.PrivateThread,
                    ChannelType.GuildVoice,
                    ChannelType.GuildCategory,
                    ChannelType.GuildForum
                )
        ),
    callback: async function (interaction) {
        await interaction.deferReply();
        const targetChannel = interaction.options.getChannel("channel") ?? interaction.channel;
        const [_, created] = await db.IgnoreChannel.findOrCreate({
            where: { id: targetChannel.id },
            defaults: { GuildId: interaction.guildId }
        });
        logMessage(await interaction.editReply(created ? "Okay." : `I'm already ignoring ${targetChannel.id === interaction.channelId ? "this channel" : targetChannel.toString()}.`));
    }
};
