const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("unignoreme", function (interaction) {
    interaction.deferReply()
        .then(() => db.IgnoreUser.findByPk(interaction.user.id))
        .then(ignoredUser => {
            if (ignoredUser) {
                return ignoredUser.destroy()
                    .then(() => interaction.editReply(`Okay ${process.bot.config.responseEmojis.smile}`));
            }
            else {
                return interaction.editReply("I'm not ignoring you!");
            }
        })
        .then(utils.logMessage)
        .catch(console.error);
}, { description: "Undo ignoreme!" });
