import { ApplicationCommandOptionType, ApplicationCommandType, InteractionContextType, PermissionFlagsBits, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { resolvePermissionString } from "../util.js";

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
        autocomplete: true
    }]
};
