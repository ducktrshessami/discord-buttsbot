import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    OAuth2Scopes,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("invite")
    .setDescription("I'll send a link so you can invite me somewhere else!");

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL(interaction.client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: PermissionFlagsBits.ViewChannel |
                PermissionFlagsBits.SendMessages |
                PermissionFlagsBits.UseExternalEmojis
        }));
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button);
    await interaction.reply({ components: [row] });
}
