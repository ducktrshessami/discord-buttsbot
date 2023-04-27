import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { IgnorableChannelTypes } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("unignorechannel")
    .setDescription("Undo ignorechannel!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel for me to stop ignoring! Defaults to the channel you use this in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );
