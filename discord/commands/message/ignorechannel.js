const { PermissionFlagsBits } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "ignorechannel",
        description: "I won't buttify in this channel.",
        requirePermissions: PermissionFlagsBits.ManageChannels
    },
    callback: async function (message) {
        const [_, created] = await db.IgnoreChannel.findOrCreate({
            where: { id: message.channelId },
            defaults: { GuildId: message.guildId }
        });
        logMessage(await message.reply(created ? "Okay." : "I'm already ignoring this channel."));
    }
};
