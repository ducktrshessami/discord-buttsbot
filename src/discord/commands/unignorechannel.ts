import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, unignoreChannel } from "../ignore.js";
import { smile } from "../emoji.js";

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

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const unignored = await unignoreChannel(channelId);
    await interaction.editReply(unignored ? `Okay ${smile(interaction)}` : `I'm not ignoring ${channelId === interaction.channelId ? "this channel" : channelMention(channelId)}!`);
}
