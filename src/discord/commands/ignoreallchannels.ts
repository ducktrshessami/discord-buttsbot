import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { ignoreChannels, isIgnorable } from "../ignore.js";
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignoreallchannels",
    description: "I won't buttify in any channel.",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild)
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await interaction.guild.channels.fetchActiveThreads();
    await ignoreChannels(interaction.guildId, interaction.guild.channels.cache.reduce((channelIds, channel) => {
        if (isIgnorable(channel)) {
            channelIds.push(channel.id);
        }
        return channelIds;
    }, new Array<string>()));
    await interaction.editReply("Okay.");
}
