import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "ignoreword",
    description: "I will never buttify this word.",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.String,
        name: "word",
        description: "The word for me to ignore.",
        required: true
    }]
};
