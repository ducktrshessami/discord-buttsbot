const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require("discord.js");
const db = require("../../models");
const { smile } = require("../responseEmojiManager");
const logMessage = require("../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignorechannel")
        .setDescription("Undo ignorechannel!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel for me to stop ignoring! Defaults to the channel you use this in.")
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
        let reply;
        await interaction.deferReply();
        const targetChannel = interaction.options.getChannel("channel") ?? interaction.channel;
        const ignoreModel = await db.IgnoreChannel.findByPk(targetChannel.id);
        if (ignoreModel) {
            await ignoreModel.destroy();
            reply = `Okay ${smile(interaction)}`;
        }
        else {
            reply = `I'm not ignoring ${targetChannel.id === interaction.channelId ? "this channel" : targetChannel.toString()}!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};
