const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignorechannel", async function (message) {
    let reply;
    let ignoredChannel = await db.IgnoreChannel.findByPk(message.channel.id);
    if (ignoredChannel) {
        await ignoredChannel.destroy();
        reply = `Okay ${this.client.config.responseEmojis.smile}`;
    }
    else {
        reply = "I'm not ignoring this channel!";
    }
    return utils.replyVerbose(message, reply);
}, {
    requirePerms: "MANAGE_CHANNELS",
    usage: "@buttsbot unignorechannel",
    description: "Undo ignorechannel!",
    subtitle: "I only do this for people who manage this channel."
});
