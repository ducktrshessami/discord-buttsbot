const { utils, SlashCommand } = require("discord-bot");
const db = require("../../models");

module.exports = new SlashCommand("unignoreme", async function (interaction) {
    let reply;
    await interaction.deferReply();
    let ignoredUser = await db.IgnoreUser.findByPk(interaction.user.id);
    if (ignoredUser) {
        await ignoredUser.destroy();
        reply = `Okay ${interaction.client.config.responseEmojis.smile}`;
    }
    else {
        reply = "I'm not ignoring you!";
    }
    utils.logMessage(await interaction.editReply(reply));
}, { description: "Undo ignoreme!" });
