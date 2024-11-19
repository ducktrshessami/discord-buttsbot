import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { frown } from "../emoji.js";
import { ignoreUser } from "../ignore.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignoreme",
    description: "I will never buttify anything you say.",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const ignored = await ignoreUser(interaction.user.id);
    await interaction.editReply(ignored ? `Okay ${frown(interaction)}` : "I'm already ignoring you.");
}
