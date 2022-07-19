const { PermissionFlagsBits } = require("discord.js");

function permissionText(permissions) {
    if (permissions & PermissionFlagsBits.ManageChannels) {
        return `\`Manage Channel\` permission`;
    }
    else if (permissions & PermissionFlagsBits.ManageGuild) {
        return `\`Manage Server\` permission`;
    }
}

module.exports = permissionText;
