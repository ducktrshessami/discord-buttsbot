const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignorechannel")
        .setDescription("I won't buttify in this channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_CHANNELS),
};
