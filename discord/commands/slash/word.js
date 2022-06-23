const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("word")
        .setDescription("Use this command to show or change what word I buttify messages with!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_GUILD)
        .addStringOption(option =>
            option
                .setName("value")
                .setDescription(`A new word to buttify with! No spaces, please! The default is ${defaultButt.word}!`)
        ),
    callback: async function (interaction) {
        let reply;
        const newValue = interaction.options
            .getString("value")
            ?.toLowerCase();
        await interaction.deferReply();
        const guildModel = await db.Guild.findByPk(interaction.guildId);
        if (newValue) {
            if (/\s/g.test(newValue)) {
                reply = "No spaces, please!";
            }
            else {
                const { word } = await guildModel.update({ word: newValue });
                reply = `Buttification word changed to \`${word}\`!`;
            }
        }
        else {
            reply = `I buttify messages with the word \`${guildModel.word}\`!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};
