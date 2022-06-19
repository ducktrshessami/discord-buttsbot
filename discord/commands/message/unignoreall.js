const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "unignoreall",
        description: "I'll buttify in every channel!",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message) {

    }
};
