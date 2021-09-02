const { Command, utils } = require("discord-bot");
const createIgnoreChannel = require("../utils/createIgnoreChannel");

module.exports = new Command("ignorechannel", function (message) {
    createIgnoreChannel(message.guild.id, message.channel.id)
        .then(res => {
            if (res) {
                return utils.replyVerbose(message, "Okay.");
            }
            else {
                return utils.replyVerbose(message, "I'm not ignoring this channel!");
            }
        })
        .catch(console.error);
}, {
    requirePerms: "MANAGE_CHANNELS",
    usage: "@buttsbot ignorechannel",
    description: "I won't buttify in this channel.",
    subtitle: "I only do this for people who manage this channel."
});
