const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignoreall", async function (message) {
    await db.IgnoreChannel.destroy({
        where: { GuildId: message.guild.id }
    });
    return utils.replyVerbose(message, `Okay ${this.client.config.responseEmojis.smile}`);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot unignoreall",
    description: "I'll buttify in every channel!",
    subtitle: "I only do this for admins."
});
