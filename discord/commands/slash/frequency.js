const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("frequency")
        .setDescription("Use this command to show or change how often I buttify messages!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD)
        .addIntegerOption(option =>
            option
                .setName("value")
                .setDescription("A new frequency to buttify messages!")
                .setMinValue(1)
        ),
    callback: async function (interaction) {

    }
};
