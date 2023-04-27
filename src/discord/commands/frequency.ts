import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import config from "../../config.js";

export const data = new SlashCommandBuilder()
    .setName("frequency")
    .setDescription("Use this command to show or change how often I buttify messages!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption(option => {
        if (config.limit.frequency > 0) {
            option.setMaxValue(config.limit.frequency);
        }
        return option
            .setName("value")
            .setDescription(`A new frequency to buttify messages! The lower this is, the more I'll buttify! The default is ${config.default.frequency}.`)
            .setMinValue(1);
    });
