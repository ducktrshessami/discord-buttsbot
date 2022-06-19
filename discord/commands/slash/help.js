const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show a command list or more info about a specific command.")
        .addStringOption(option =>
            option
                .setName("command")
                .setDescription("A specific command to show info for.")
        ),
    callback: async function (interaction) {

    }
};
