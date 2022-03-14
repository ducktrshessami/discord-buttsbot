const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("unignoreme", function (interaction) {
    let reply;
    await interaction.deferReply();
    let ignoredUser = await db.IgnoreUser.findByPk(interaction.user.id);
    if (ignoredUser) {
        await ignoredUser.destroy();
        reply = await interaction.editReply(`Okay ${process.bot.config.responseEmojis.smile}`);
    }
    else {
        reply = await interaction.editReply("I'm not ignoring you!");
    }
    utils.logMessage(reply);
}, { description: "Undo ignoreme!" });
