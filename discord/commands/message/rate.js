const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "rate",
        description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
        args: "[number]",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message, args, guildModel) {

    }
};
