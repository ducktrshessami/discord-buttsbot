import {
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { smile } from "../emoji.js";
import { unignoreAllWords } from "../ignore.js";
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "unignoreallwords",
    description: "I'll buttify any word!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild)
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await unignoreAllWords(interaction.guildId);
    await interaction.editReply(`Okay ${smile(interaction)}`);
}
