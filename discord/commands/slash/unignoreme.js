const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../models");
const { smile } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unignoreme")
        .setDescription("Undo ignoreme!"),
    callback: async function (interaction) {
        let reply;
        await interaction.deferReply();
        const ignoredUser = await db.IgnoreUser.findByPk(interaction.user.id);
        if (ignoredUser) {
            await ignoredUser.destroy();
            reply = `Okay ${smile(interaction.channel, true)}`;
        }
        else {
            reply = "I'm not ignoring you!";
        }
        logMessage(await interaction.editReply(reply));
    }
};
