import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import config from "../../config.js";

export const data = new SlashCommandBuilder()
    .setName("rate")
    .setDescription("Use this command to show or change the amount of syllables buttified when I buttify a message!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption(option => {
        if (config.limit.rate > 0) {
            option.setMaxValue(config.limit.rate);
        }
        return option
            .setName("value")
            .setDescription(`A new rate to buttify syllables! The lower this is, the more I'll buttify! The default is ${config.default.rate}.`)
            .setMinValue(1);
    });
