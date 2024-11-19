import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    channelMention
} from "discord.js";
import { smile } from "../emoji.js";
import { IgnorableChannelTypes, unignoreChannel } from "../ignore.js";
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "unignorechannel",
    description: "Undo ignorechannel!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageChannels),
    options: [{
        type: ApplicationCommandOptionType.Channel,
        name: "channel",
        description: "The channel for me to stop ignoring! Defaults to the channel you use this in.",
        channel_types: IgnorableChannelTypes
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const unignored = await unignoreChannel(channelId);
    await interaction.editReply(unignored ? `Okay ${smile(interaction)}` : `I'm not ignoring ${channelId === interaction.channelId ? "this channel" : channelMention(channelId)}!`);
}
