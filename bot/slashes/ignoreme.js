const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("ignoreme", function (interaction) {
    interaction.deferReply()
        .then(() => db.IgnoreUser.findByPk(interaction.user.id))
        .then(ignoredUser => {
            if (!ignoredUser) {
                return db.IgnoreUser.create({ id: interaction.user.id })
                    .then(() => interaction.editReply(`Okay ${process.bot.config.responseEmojis.frown}`));
            }
            else {
                return interaction.editReply("I'm already ignoring you.");
            }
        })
        .then(utils.logMessage)
        .catch(console.error);
}, { description: "I will never buttify anything you say." });
