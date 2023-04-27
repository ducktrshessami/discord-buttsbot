import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { IgnorableChannelTypes } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignorechannel")
    .setDescription("I won't buttify in this channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel for me to ignore. Defaults to the channel you use this in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );
