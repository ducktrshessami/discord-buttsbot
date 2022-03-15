const { Command, utils } = require("discord-bot");
const db = require("../../models");
const defaultButt = require("../../config/default.json");

module.exports = new Command("frequency", async function (message, args) {
    let reply;
    let n = parseInt(args[1]);
    let guild = await db.Guild.findByPk(message.guild.id);
    if (n && n > 0) {
        let updated = await guild.update({ frequency: n });
        reply = `Buttify frequency changed to one in every \`${updated.frequency}\` messages!`;
    }
    else {
        reply = `I buttify roughly one in every \`${guild.frequency}\` messages!\nTo change the frequency, use \`${this.usage}\`.\nDefault: \`${defaultButt.frequency}\``;
    }
    return utils.replyVerbose(message, reply);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot frequency [number]",
    description: "Use this command to show or change how often I buttify messages!",
    subtitle: `The default frequency is ${defaultButt.frequency}. Also I only do this for admins.`
});
