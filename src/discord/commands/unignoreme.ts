import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { smile } from "../emoji.js";
import { unignoreUser } from "../ignore.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "unignoreme",
    description: "Undo ignoreme!",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const unignored = await unignoreUser(interaction.user.id);
    await interaction.editReply(unignored ? `Okay ${smile(interaction)}` : "I'm not ignoring you!");
}
