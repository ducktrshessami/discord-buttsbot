import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import { getIgnoredWords } from "../ignore.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignorewordlist",
    description: "I'll list all the words I'm ignoring.",
    contexts: [
        InteractionContextType.Guild
    ]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const ignored = await getIgnoredWords(interaction.guildId);
    const reply = ignored && ignored.length > 0
        ? `Here are the words I'm ignoring:\n${ignored.sort((a, b) => a.localeCompare(b)).join(", ")}`
        : "I'm not ignoring any words.";
    await interaction.editReply(reply);
}
