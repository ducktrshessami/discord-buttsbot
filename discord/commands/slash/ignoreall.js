const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignoreall")
        .setDescription("I won't buttify in any channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD),
    callback: function (interaction) {

    }
};
