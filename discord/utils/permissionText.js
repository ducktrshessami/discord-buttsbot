const { Permissions } = require("discord.js");

function permissionText(permissions) {
    if (permissions & Permissions.FLAGS.MANAGE_CHANNELS) {
        return `\`Manage Channel\` permission`;
    }
    else if (permissions & Permissions.FLAGS.MANAGE_GUILD) {
        return `\`Manage Server\` permission`;
    }
}

module.exports = permissionText;
