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
import { resolvePermissionString } from "../util.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    type: ApplicationCommandType.ChatInput,
    name: "frequency",
    description: "Use this command to show or change how often I buttify messages!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.Integer,
        name: "value",
        description: `A new frequency to buttify messages! The lower this is, the more I'll buttify! The default is ${config.default.frequency}.`,
        min_value: 1,
        max_value: config.limit.frequency > 0 ? config.limit.frequency : undefined
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const newValue = interaction.options.getInteger("value");
    if (newValue) {
        await updateGuild(interaction.guildId, { frequency: newValue });
        await interaction.editReply(`Buttify frequency changed to one in every \`${newValue}\` messages!`);
    }
    else {
        const guildModel = await getGuild(interaction.guildId);
        await interaction.editReply(`I buttify roughly one in every \`${guildModel?.frequency ?? config.default.frequency}\` messages!`);
    }
}
