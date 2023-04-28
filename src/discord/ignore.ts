import {
    CategoryChannel,
    Channel,
    ChannelType,
    ForumChannel,
    GuildTextBasedChannel
} from "discord.js";
import {
    IgnoreChannel,
    IgnoreUser,
    sequelize
} from "../models/index.js";
import { initializeGuild } from "./guild.js";

export const IgnorableChannelTypes: Array<IgnorableChannelType> = [
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildAnnouncement,
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildStageVoice,
    ChannelType.GuildForum
];

export function isIgnorable(channel: Channel): channel is IgnorableChannel {
    return !channel.isDMBased() && (
        channel.isTextBased() ||
        channel.type === ChannelType.GuildCategory ||
        channel.type === ChannelType.GuildForum
    );
}

export async function ignoreChannel(guildId: string, channelId: string): Promise<boolean> {
    return await sequelize.transaction(async transaction => {
        await initializeGuild(guildId, transaction);
        const [_, created] = await IgnoreChannel.findOrCreate({
            transaction,
            where: { id: channelId },
            defaults: {
                id: channelId,
                GuildId: guildId
            }
        });
        return created;
    });
}

export async function ignoreChannels(guildId: string, channelIds: Array<string>): Promise<void> {
    await sequelize.transaction(async transaction => {
        await initializeGuild(guildId, transaction);
        await IgnoreChannel.bulkCreate(channelIds.map(channelId => ({
            id: channelId,
            GuildId: guildId
        })), {
            transaction,
            ignoreDuplicates: true
        });
    });
}

export async function unignoreChannel(channelId: string): Promise<boolean> {
    return !!await IgnoreChannel.destroy({
        where: { id: channelId }
    });
}

export async function unignoreAllChannels(guildId: string): Promise<void> {
    await IgnoreChannel.destroy({
        where: { GuildId: guildId }
    });
}

export async function channelIgnored(channel: Channel): Promise<boolean> {
    if (!isIgnorable(channel)) {
        return false;
    }
    let ignored = !!await IgnoreChannel.findByPk(channel.id);
    if (channel.parent) {
        ignored ||= await channelIgnored(channel.parent);
    }
    return ignored;
}

export async function ignoreUser(userId: string): Promise<boolean> {
    const [_, created] = await IgnoreUser.findOrCreate({
        where: { id: userId }
    });
    return created;
}

export async function unignoreUser(userId: string): Promise<boolean> {
    return !!await IgnoreUser.destroy({
        where: { id: userId }
    });
}

export type IgnorableChannel = GuildTextBasedChannel | CategoryChannel | ForumChannel;
export type IgnorableChannelType = IgnorableChannel["type"];
