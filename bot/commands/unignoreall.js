const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignoreall", function (message) {
    db.IgnoreChannel.destroy({
        where: { GuildId: message.guild.id }
    })
        .then(() => utils.replyVerbose(message, `Okay ${this.client.config.responseEmojis.smile}`))
        .catch(console.error);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot unignoreall",
    description: "I'll buttify in every channel!",
    subtitle: "I only do this for admins."
});
