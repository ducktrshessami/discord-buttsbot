const { Permissions } = require("discord.js");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: {
        name: "word",
        description: "Use this command to show or change what word I buttify messages with!",
        subtitle: `The default word is ${defaultButt.word}. Also you need the \`Manage Server\` permission!`,
        args: "[word]",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message, args, guildModel) {

    }
};
