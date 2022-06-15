const { Permissions } = require("discord.js");
const db = require("../../../models");

module.exports = {
    data: {
        name: "ignoreall",
        description: "I won't buttify in any channel.",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message) {
        await message.guild.channels.fetchActiveThreads();
        await db.IgnoreChannel.bulkCreate(
            message.guild.channels.cache
                .filter(channel => channel.isText())
                .map(channel => ({
                    id: channel.id,
                    GuildId: message.guildId
                })),
            { ignoreDuplicates: true }
        );
        logMessage(await message.reply("Okay."));
    }
};
