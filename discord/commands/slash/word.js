const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("word")
        .setDescription("Use this command to show or change what word I buttify messages with!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD)
        .addStringOption(option =>
            option
                .setName("value")
                .setDescription(`A new word to buttify with! The default is ${defaultButt.word}!`)
        ),
    callback: async function (interaction) {

    }
};
