const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: {
        name: "frequency",
        description: "Use this command to show or change how often I buttify messages!",
        subtitle: `The default frequency is ${defaultButt.frequency}. Also you need the \`Manage Server\` permission!`,
        args: "[number]",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message, args, guildModel) {

    }
};
