const { Command, utils } = require("discord-bot");
const db = require("../../models");
const defaultButt = require("../../config/default.json");

module.exports = new Command("rate", async function (message, args) {
    let reply;
    let n = parseInt(args[1]);
    let guild = await db.Guild.findByPk(message.guild.id);
    if (n && n > 0) {
        reply = `Buttify rate changed to one in every \`${(await guild.update({ rate: n })).rate}\` syllables per buttified message!`;
    }
    else {
        reply = `I buttify roughly one in every \`${guild.rate}\` syllables per buttified message!\nTo change this rate, use \`${this.usage}\`.\nDefault: \`${defaultButt.rate}\``;
    }
    return utils.replyVerbose(message, reply);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot rate [number]",
    description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
    subtitle: `The default rate is ${defaultButt.rate}. Also I only do this for admins.`
});
