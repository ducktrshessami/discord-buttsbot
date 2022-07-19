const { PermissionFlagsBits } = require("discord.js");
const db = require("../../../models");
const { smile } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "unignoreall",
        description: "I'll buttify in every channel!",
        requirePermissions: PermissionFlagsBits.ManageGuild
    },
    callback: async function (message) {
        await db.IgnoreChannel.destroy({
            where: { GuildId: message.guildId }
        });
        logMessage(await message.reply(`Okay ${smile(message.channel)}`));
    }
};
