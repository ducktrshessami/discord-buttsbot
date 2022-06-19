const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "unignorechannel",
        description: "Undo ignorechannel!",
        requirePermissions: Permissions.FLAGS.MANAGE_CHANNELS
    },
    callback: async function (message) {

    }
};
