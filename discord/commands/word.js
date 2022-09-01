const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../../models");
const logMessage = require("../utils/logMessage");
const defaultButt = require("../../config/default.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("word")
        .setDescription("Use this command to show or change what word I buttify messages with!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
        const guildModel = await db.models.Guild.findOne({
            where: { id: interaction.guildId }
        });
        if (newValue) {
            if (/\s/g.test(newValue)) {
                reply = "No spaces, please!";
            }
            else {
                const { dataValues } = await guildModel.update({ word: newValue });
                reply = `Buttification word changed to \`${dataValues.word}\`!`;
            }
        }
        else {
            reply = `I buttify messages with the word \`${guildModel.dataValues.word}\`!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};
