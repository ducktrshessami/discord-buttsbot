const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../../models");
const logMessage = require("../utils/logMessage");
const defaultButt = require("../../config/default.json");
const { wordLength } = require("../../config/max.json");

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
                .setMaxLength(wordLength)
        ),
    callback: async function (interaction) {
        let reply;
        const newValue = interaction.options
            .getString("value")
            ?.toLowerCase();
        await interaction.deferReply();
        if (newValue) {
            if (/\s/g.test(newValue)) {
                reply = "No spaces, please!";
            }
            else {
                await db.Guild.update({ word: newValue }, {
                    where: { id: interaction.guildId }
                });
                reply = `Buttification word changed to \`${newValue}\`!`;
            }
        }
        else {
            const { word } = await db.Guild.findByPk(interaction.guildId);
            reply = `I buttify messages with the word \`${word}\`!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};
