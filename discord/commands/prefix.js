const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("prefix", async function (message, args) {
    let reply;
    let guild = await db.Guild.findByPk(message.guild.id);
    if (args.length > 1 && message.member.permissions.has("ADMINISTRATOR")) {
        await guild.update({ prefix: args[1] });
        reply = `Custom prefix set to \`${args[1]}\``;
    }
    else {
        if (guild.prefix) {
            reply = `Current custom prefix: \`${guild.prefix}\``;
        }
        else {
            reply = "Custom prefix not set";
        }
    }
    return utils.replyVerbose(message, reply);
}, {
    requireGuild: true,
    usage: "@buttsbot prefix [prefix]",
    description: "View or change the command prefix!",
    subtitle: "Only admins can change it."
});
