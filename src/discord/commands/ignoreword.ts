import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import { ignoreWord } from "../ignore.js";
import { resolvePermissionString, WhitespacePattern } from "../util.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignoreword",
    description: "I will never buttify this word.",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.String,
        name: "word",
        description: "The word for me to ignore.",
        required: true
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const word = interaction.options
        .getString("word", true)
        .toLowerCase();
    if (WhitespacePattern.test(word)) {
        await interaction.editReply("No spaces, please!");
    }
    else {
        const ignored = await ignoreWord(word, interaction.guildId);
        await interaction.editReply(ignored ? "Okay." : "I'm already ignoring that word.");
    }
}
