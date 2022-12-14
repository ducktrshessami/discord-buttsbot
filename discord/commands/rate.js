const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const db = require("../../models");
const logMessage = require("../utils/logMessage");
const defaultButt = require("../../config/default.json");
const { rate: maxRate } = require("../../config/max.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rate")
        .setDescription("Use this command to show or change the amount of syllables buttified when I buttify a message!")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addIntegerOption(option => {
            if (maxRate > 0) {
                option.setMaxValue(maxRate);
            }
            return option
                .setName("value")
                .setDescription(`A new rate to buttify syllables! The lower this is, the more I'll buttify! The default is ${defaultButt.rate}.`)
                .setMinValue(1);
        }),
    callback: async function (interaction) {
        let reply;
        const newValue = interaction.options.getInteger("value");
        await interaction.deferReply();
        if (newValue) {
            await db.Guild.update({ rate: newValue }, {
                where: { id: interaction.guildId }
            });
            reply = `Buttify rate changed to one in every \`${newValue}\` syllables per buttified message!`;
        }
        else {
            const { rate } = await db.Guild.findByPk(interaction.guildId);
            reply = `I buttify roughly one in every \`${rate}\` syllables per buttified message!`;
        }
        logMessage(await interaction.editReply(reply));
    }
};
