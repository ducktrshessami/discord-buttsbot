import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ignoreUser } from "../ignore.js";
import { frown } from "../emoji.js";

export const data = new SlashCommandBuilder()
    .setName("ignoreme")
    .setDescription("I will never buttify anything you say.");

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const ignored = await ignoreUser(interaction.user.id);
    await interaction.editReply(ignored ? `Okay ${frown(interaction)}` : "I'm already ignoring you.");
}
