import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { ignoreChannels, isIgnorable } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignoreall")
    .setDescription("I won't buttify in any channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await interaction.guild.channels.fetchActiveThreads();
    await ignoreChannels(interaction.guildId, interaction.guild.channels.cache.reduce((channelIds, channel) => {
        if (isIgnorable(channel)) {
            channelIds.push(channel.id);
        }
        return channelIds;
    }, new Array<string>()));
    await interaction.editReply("Okay.");
}
