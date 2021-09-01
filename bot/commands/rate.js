const { Command, utils } = require("discord-bot");
const db = require("../../models");
const defaultButt = require("../../config/default.json");

module.exports = new Command("rate", function (message, args) {
    let n = parseInt(args[1]);
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (n && n > 0) {
                return guild.update({ rate: n })
                    .then(updated => utils.replyVerbose(message, `Buttify rate changed to one in every \`${updated.rate}\` syllables per buttified message!`));
            }
            else {
                return utils.replyVerbose(message, `I buttify roughly one in every \`${guild.rate}\` syllables per buttified message!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${defaultButt.rate}\``);
            }
        })
        .catch(console.error);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot rate [number]",
    description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
    subtitle: `The default rate is ${defaultButt.rate}. Also I only do this for admins.`
});
