import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { unignoreAllChannels } from "../ignore.js";
import { smile } from "../emoji.js";

export const data = new SlashCommandBuilder()
    .setName("unignoreall")
    .setDescription("I'll buttify in every channel!")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await unignoreAllChannels(interaction.guildId);
    await interaction.editReply(`Okay ${smile(interaction)}`);
}
