const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignorechannel", function (message) {
    db.IgnoreChannel.findByPk(message.channel.id)
        .then(ignoredChannel => {
            if (ignoredChannel) {
                return ignoredChannel.destroy()
                    .then(() => utils.replyVerbose(message, `Okay ${this.client.config.responseEmojis.smile}`));
            }
            else {
                return utils.replyVerbose(message, "I'm not ignoring this channel!");
            }
        })
        .catch(console.error);
}, {
    requirePerms: "MANAGE_CHANNELS",
    usage: "@buttsbot unignorechannel",
    description: "Undo ignorechannel!",
    subtitle: "I only do this for people who manage this channel."
});
