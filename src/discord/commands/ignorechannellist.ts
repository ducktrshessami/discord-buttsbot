import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    RESTPostAPIApplicationCommandsJSONBody,
    channelMention
} from "discord.js";
import { getIgnoredChannelIds } from "../ignore.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignorechannellist",
    description: "I'll list all the channels I'm ignoring.",
    contexts: [
        InteractionContextType.Guild
    ]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const ignored = await getIgnoredChannelIds(interaction.guildId);
    const reply = ignored && ignored.length > 0
        ? `Here are the channels I'm ignoring:\n${ignored.map(channelMention).join(", ")}`
        : "I'm not ignoring any channels.";
    await interaction.editReply(reply);
}
