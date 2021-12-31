const { Command, utils } = require("discord-bot");
const createIgnoreChannel = require("../utils/createIgnoreChannel");

module.exports = new Command("ignorechannel", function (message) {
    createIgnoreChannel(message.guild.id, message.channel.id)
        .then(res => utils.replyVerbose(message, res ? "Okay." : "I'm already ignoring this channel."))
        .catch(console.error);
}, {
    requirePerms: "MANAGE_CHANNELS",
    usage: "@buttsbot ignorechannel",
    description: "I won't buttify in this channel.",
    subtitle: "I only do this for people who manage this channel."
});
