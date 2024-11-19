import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, ignoreChannel } from "../ignore.js";
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignorechannel",
    description: "I won't buttify in this channel.",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageChannels),
    options: [{
        type: ApplicationCommandOptionType.Channel,
        name: "channel",
        description: "The channel for me to ignore. Defaults to the channel you use this in.",
        channel_types: IgnorableChannelTypes,
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const ignored = await ignoreChannel(interaction.guildId, channelId);
    await interaction.editReply(ignored ? "Okay." : `I'm already ignoring ${channelId === interaction.channelId ? "this channel" : channelMention(channelId)}.`);
}
