import { ApplicationCommandOptionType, ApplicationCommandType, InteractionContextType, PermissionFlagsBits, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignoreword",
    description: "I will never buttify these words.",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: PermissionFlagsBits.ManageGuild.toString(),
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "add",
            description: "I will never buttify this word.",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "word",
                description: "The word for me to ignore.",
                required: true
            }]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "remove",
            description: "Undo ignoreword add!",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "word",
                description: "The word to remove from the list.",
                required: true,
                autocomplete: true
            }]
        }
    ]
};
