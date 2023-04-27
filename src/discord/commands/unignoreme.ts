import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { unignoreUser } from "../ignore.js";
import { smile } from "../emoji.js";

export const data = new SlashCommandBuilder()
    .setName("unignoreme")
    .setDescription("Undo ignoreme!");

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const unignored = await unignoreUser(interaction.user.id);
    await interaction.editReply(unignored ? `Okay ${smile(interaction)}` : "I'm not ignoring you!");
}
