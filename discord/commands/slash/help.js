const { SlashCommandBuilder } = require("@discordjs/builders");
const messageCommands = require("../message");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show a command list or more info about a specific command.")
        .addStringOption(option =>
            option
                .setName("command")
                .setDescription("A specific command to show info for.")
                .setChoices(...messageCommands.map(command => ({
                    name: command.data.name,
                    value: command.data.name
                })))
        ),
    callback: async function (interaction) {

    }
};
