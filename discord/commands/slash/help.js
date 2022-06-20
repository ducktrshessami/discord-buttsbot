const { SlashCommandBuilder } = require("@discordjs/builders");
const getCommandListPage = require("../../utils/getCommandListPage");
const logMessage = require("../../utils/logMessage");
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
        let reply;
        await interaction.deferReply();
        const commandName = interaction.options.getString("command");
        if (commandName) {
            const command = messageCommands.get(commandName);
            // individual command info
        }
        else {
            reply = getCommandListPage(false);
        }
        logMessage(await interaction.editReply(reply));
    }
};
