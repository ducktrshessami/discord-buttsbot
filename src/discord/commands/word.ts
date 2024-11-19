import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import config from "../../config.js";
import { getGuild, updateGuild } from "../guild.js";
import { resolvePermissionString, WhitespacePattern } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "word",
    description: "Use this command to show or change what word I buttify messages with!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.String,
        name: "value",
        description: `A new word to buttify with! No spaces, please! The default is ${config.default.word}!`,
        max_length: config.limit.wordLength > 0 ? config.limit.wordLength : undefined
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const newValue = interaction.options
        .getString("value")
        ?.toLowerCase();
    if (newValue) {
        if (WhitespacePattern.test(newValue)) {
            await interaction.editReply("No spaces, please!");
        }
        else {
            await updateGuild(interaction.guildId, { word: newValue });
            await interaction.editReply(`Buttification word changed to \`${newValue}\`!`);
        }
    }
    else {
        const guildModel = await getGuild(interaction.guildId);
        await interaction.editReply(`I buttify messages with the word \`${guildModel?.word ?? config.default.word}\`!`);
    }
}
