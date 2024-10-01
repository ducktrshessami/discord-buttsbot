import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { smile } from "../emoji.js";
import { unignoreAllChannels } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("unignoreall")
    .setDescription("I'll buttify in every channel!")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await unignoreAllChannels(interaction.guildId);
    await interaction.editReply(`Okay ${smile(interaction)}`);
}
