const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("ignoreme", async function (interaction) {
    await interaction.deferReply();
    let [model, created] = await db.IgnoreUser.findOrCreate({
        where: { id: interaction.user.id }
    });
    utils.logMessage(await interaction.editReply(created ? `Okay ${interaction.client.config.responseEmojis.frown}` : "I'm already ignoring you."));
}, { description: "I will never buttify anything you say." });
