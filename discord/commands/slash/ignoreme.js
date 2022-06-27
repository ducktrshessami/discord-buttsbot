const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../../models");
const { frown } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ignoreme")
        .setDescription("I will never buttify anything you say."),
    callback: async function (interaction) {
        await interaction.deferReply();
        const [_, created] = await db.IgnoreUser.findOrCreate({
            where: { id: interaction.user.id }
        });
        logMessage(await interaction.editReply(created ? `Okay ${frown(interaction.channel, true)}` : "I'm already ignoring you."));
    }
};
