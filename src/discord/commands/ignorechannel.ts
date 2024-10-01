import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, ignoreChannel } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignorechannel")
    .setDescription("I won't buttify in this channel.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel for me to ignore. Defaults to the channel you use this in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const ignored = await ignoreChannel(interaction.guildId, channelId);
    await interaction.editReply(ignored ? "Okay." : `I'm already ignoring ${channelId === interaction.channelId ? "this channel" : channelMention(channelId)}.`);
}
