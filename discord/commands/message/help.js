const getCommandListPage = require("../../utils/getCommandListPage");
const logMessage = require("../../utils/logMessage");
const permissionText = require("../../utils/permissionText");
const messageCommands = require("./index");

module.exports = {
    data: {
        name: "help",
        description: "Show a command list or more info about a specific command.",
        args: "[command name]"
    },
    callback: async function (message, args) {
        let reply;
        const commandName = args[1]?.toLowerCase();
        if (commandName) {
            const command = messageCommands.get(commandName);
            reply = `\`@${message.client.user.username} ${command.data.name} ${command.data.args || ""}`.trim() +
                `\`\n**${command.data.name}:** ${command.data.description}\n${command.data.subtitle || ""}`.trim() +
                (command.data.requireGuild || command.data.requirePermissions ? "\nYou can only use this command in a server." : "") +
                (command.data.requirePermissions ? ` Also you need the ${permissionText(command.data.requirePermissions)}!` : "")
        }
        else {
            reply = await getCommandListPage(false);
        }
        logMessage(await message.reply(reply));
    }
};
