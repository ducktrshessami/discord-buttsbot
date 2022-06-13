const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Use this command to show or change the amount of syllables buttified when I buttify a message!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD)
        .addIntegerOption(option =>
            option
                .setName("value")
                .setDescription(`A new rate to buttify syllables! The lower this is, the more I'll buttify! The default is ${defaultButt.rate}.`)
                .setMinValue(1)
        ),
    callback: async function (interaction) {

    }
};
