import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import config from "../../config.js";
import { smile } from "../emoji.js";
import { getIgnoredWords, unignoreWord } from "../ignore.js";
import { parseQuery, resolvePermissionString } from "../util.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "unignoreword",
    description: "Undo ignoreword!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.String,
        name: "word",
        description: "The word for me to stop ignoring!",
        required: true,
        autocomplete: true,
        max_length: config.limit.wordLength > 0 ? config.limit.wordLength : undefined
    }]
};

export async function autocomplete(interaction: AutocompleteInteraction<"cached">): Promise<void> {
    const query = interaction.options.getFocused();
    const words = await getIgnoredWords(interaction.guildId);
    const choices = parseQuery(query.value, words, word => ({
        name: word,
        value: word
    }));
    await interaction.respond(choices);
}

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const word = interaction.options
        .getString("word", true)
        .toLowerCase();
    const unignored = await unignoreWord(word, interaction.guildId);
    await interaction.editReply(unignored ? `Okay ${smile(interaction)}` : "I'm not ignoring that word.");
}
