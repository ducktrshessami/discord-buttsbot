import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import config from "../../config.js";

export const data = new SlashCommandBuilder()
    .setName("word")
    .setDescription("Use this command to show or change what word I buttify messages with!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => {
        if (config.limit.wordLength > 0) {
            option.setMaxLength(config.limit.wordLength);
        }
        return option
            .setName("value")
            .setDescription(`A new word to buttify with! No spaces, please! The default is ${config.default.word}!`);
    });
