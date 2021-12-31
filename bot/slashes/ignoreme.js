const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("ignoreme", function (interaction) {
    interaction.deferReply()
        .then(() => db.IgnoreUser.findOrCreate({
            where: { id: interaction.user.id }
        }))
        .then(([model, created]) => interaction.editReply(created ? `Okay ${process.bot.config.responseEmojis.frown}` : "I'm already ignoring you."))
        .then(utils.logMessage)
        .catch(console.error);
}, { description: "I will never buttify anything you say." });
