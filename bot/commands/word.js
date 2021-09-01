const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("word", function (message, args) {
    db.Guild.findByPk(message.guild.id)
        .then(guild => {
            if (args.length > 1) {
                return guild.update({ word: args[1].toLowerCase() })
                    .then(updated => utils.replyVerbose(message, `Buttification word changed to \`${updated.word}\`!`));
            }
            else {
                return utils.replyVerbose(message, `I buttify messages with the word \`${guild.word}\`!`);
            }
        })
        .catch(console.error);
}, {
    requirePerms: "ADMINISTRATOR",
    usage: "@buttsbot word [word]",
    description: "Use this command to show or change what word I buttify messages with!",
    subtitle: "I guess that only makes sense if the word is butt. Also I only do this for admins."
});
