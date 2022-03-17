const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("word", async function (message, args) {
    let reply;
    let guild = await db.Guild.findByPk(message.guild.id);
    if (args.length > 1) {
        reply = `Buttification word changed to \`${(await guild.update({ word: args[1].toLowerCase() })).word}\`!`;
    }
    else {
        reply = `I buttify messages with the word \`${guild.word}\`!`;
    }
    return utils.replyVerbose(message, reply);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot word [word]",
    description: "Use this command to show or change what word I buttify messages with!",
    subtitle: "I guess that only makes sense if the word is butt. Also I only do this for admins."
});
