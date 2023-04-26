import {
    CategoryChannel,
    Channel,
    ChannelType,
    ForumChannel,
    GuildTextBasedChannel
} from "discord.js";
import {
    Guild,
    IgnoreChannel,
    sequelize
} from "../models/index.js";
import { Transaction } from "sequelize";

export const IgnorableChannelTypes: Array<IgnorableChannel["type"]> = [
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

async function initializeGuild(guildId: string, transaction: Transaction): Promise<void> {
    await Guild.findOrCreate({
        transaction,
        where: { id: guildId }
    });
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

export async function unignoreChannel(guildId: string, channelId: string): Promise<boolean> {
    return await sequelize.transaction(async transaction => {
        const unignored = !!await IgnoreChannel.destroy({
            transaction,
            where: { id: channelId }
        });
        const noIgnores = !await IgnoreChannel.count({
            transaction,
            where: { GuildId: guildId }
        });
        if (noIgnores) {
            await Guild.destroy({
                transaction,
                where: { id: guildId }
            });
        }
        return unignored;
    });
}

export async function unignoreAllChannels(guildId: string): Promise<void> {
    await Guild.destroy({
        where: { id: guildId }
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

export type IgnorableChannel = GuildTextBasedChannel | CategoryChannel | ForumChannel;
