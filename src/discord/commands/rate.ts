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
    name: "rate",
    description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: resolvePermissionString(PermissionFlagsBits.ManageGuild),
    options: [{
        type: ApplicationCommandOptionType.Integer,
        name: "value",
        description: `A new rate to buttify syllables! The lower this is, the more I'll buttify! The default is ${config.default.rate}.`,
        min_value: 1,
        max_value: config.limit.rate > 0 ? config.limit.rate : undefined
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const newValue = interaction.options.getInteger("value");
    if (newValue) {
        await updateGuild(interaction.guildId, { rate: newValue });
        await interaction.editReply(`Buttify rate changed to one in every \`${newValue}\` syllables per buttified message!`);
    }
    else {
        const guildModel = await getGuild(interaction.guildId);
        await interaction.editReply(`I buttify roughly one in every \`${guildModel?.rate ?? config.default.rate}\` syllables per buttified message!`);
    }
}
