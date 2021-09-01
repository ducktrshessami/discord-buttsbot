const { Command, utils } = require("discord-bot");
const db = require("../../models");
const defaultButt = require("../../config/default.json");

module.exports = new Command("frequency", function (message, args) {
    let n = parseInt(args[1]);
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (n && n > 0) {
                return guild.update({ frequency: n })
                    .then(updated => utils.replyVerbose(message, `Buttify frequency changed to one in every \`${updated.frequency}\` messages!`));
            }
            else {
                return utils.replyVerbose(message, `I buttify roughly one in every \`${guild.frequency}\` messages!\nTo change the frequency, use \`${this.usage}\`.\nDefault: \`${defaultButt.frequency}\``);
            }
        })
        .catch(console.error);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot frequency [number]",
    description: "Use this command to show or change how often I buttify messages!",
    subtitle: `The default frequency is ${defaultButt.frequency}. Also I only do this for admins.`
});
