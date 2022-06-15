const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "ignoreall",
        description: "I won't buttify in any channel.",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message) {

    }
};
