const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "ignorechannel",
        description: "I won't buttify in this channel.",
        requirePermissions: Permissions.FLAGS.MANAGE_CHANNELS
    },
    callback: async function (message) {

    }
};
