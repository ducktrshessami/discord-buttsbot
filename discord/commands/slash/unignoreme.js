const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignoreme")
        .setDescription("Undo ignoreme!"),
    callback: async function (interaction) {
        let reply;
        await interaction.deferReply();
        let ignoredUser = await db.IgnoreUser.findByPk(interaction.user.id);
        if (ignoredUser) {
            await ignoredUser.destroy();
            reply = `Okay ${process.bot.config.responseEmojis.smile}`;
        }
        else {
            reply = "I'm not ignoring you!";
        }
        logMessage(await interaction.editReply(reply));
    }
};
