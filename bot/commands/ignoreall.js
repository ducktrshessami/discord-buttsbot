const { Command, utils } = require("discord-bot");
const createIgnoreChannel = require("../utils/createIgnoreChannel");

module.exports = new Command("ignoreall", async function (message) {
    await message.guild.channels.fetchActiveThreads();
    await Promise.all(
        message.guild.channels.cache.filter(channel =>
            channel.type === "GUILD_TEXT" ||
            channel.type === "GUILD_NEWS" ||
            channel.type === "GUILD_PUBLIC_THREAD" ||
            channel.type === "GUILD_PRIVATE_THREAD" ||
            channel.type === "GUILD_NEWS_THREAD"
        )
            .map(channel => createIgnoreChannel(channel.guild.id, channel.id))
    );
    await utils.replyVerbose(message, "Okay.");
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot ignoreall",
    description: "I won't buttify in any channel.",
    subtitle: "I only do this for admins."
});
