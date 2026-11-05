import {
    ApplicationCommandType,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    InteractionContextType,
    OAuth2Scopes,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "invite",
    description: "I'll send a link so you can invite me somewhere else!",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
        components: [{
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: "Invite",
                url: interaction.client.generateInvite({
                    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
                    permissions: PermissionFlagsBits.ViewChannel |
                        PermissionFlagsBits.SendMessages |
                        PermissionFlagsBits.UseExternalEmojis
                })
            }]
        }]
    });
}
