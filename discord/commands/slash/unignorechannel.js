const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const db = require("../../../models");
const { smile } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignorechannel")
        .setDescription("Undo ignorechannel!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_CHANNELS),
    callback: async function (interaction) {
        let reply;
        await interaction.deferReply();
        const ignoreModel = await db.IgnoreChannel.findByPk(interaction.channelId);
        if (ignoreModel) {
            await ignoreModel.destroy();
            reply = `Okay ${smile(interaction.channel, true)}`;
        }
        else {
            reply = "I'm not ignoring this channel!";
        }
        logMessage(await interaction.editReply(reply));
    }
};
