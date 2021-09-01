const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("prefix", function (message, args) {
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (args.length > 1 && message.member.permissions.has("ADMINISTRATOR")) {
                return guild.update({ prefix: args[1] })
                    .then(() => utils.replyVerbose(message, `Custom prefix set to \`${args[1]}\``));
            }
            else {
                if (guild.prefix) {
                    return utils.replyVerbose(message, `Current custom prefix: \`${guild.prefix}\``);
                }
                else {
                    return utils.replyVerbose(message, "Custom prefix not set");
                }
            }
        })
        .catch(console.error);
}, {
    usage: "@buttsbot prefix [prefix]",
    description: "View or change the command prefix!",
    subtitle: "Only admins can change it."
});
