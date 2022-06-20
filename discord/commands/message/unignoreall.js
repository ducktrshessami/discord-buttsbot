const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "unignoreall",
        description: "I'll buttify in every channel!",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message) {
        await db.IgnoreChannel.destroy({
            where: { GuildId: message.guildId }
        });
        logMessage(await message.reply(`Okay ${message.client.responseEmojis.smile}`));
    }
};