import {
    CategoryChannel,
    Channel,
    ChannelType,
    ForumChannel,
    GuildBasedChannel,
    GuildTextBasedChannel,
    MediaChannel,
    Message
} from "discord.js";
import { Op } from "sequelize";
import {
    IgnoreChannel,
    IgnoreUser,
    IgnoreWord,
    sequelize
} from "../models/index.js";
import { initializeGuild } from "./guild.js";

export const IgnorableChannelTypes: Array<IgnorableChannel["type"]> = [
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildAnnouncement,
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildStageVoice,
    ChannelType.GuildForum,
    ChannelType.GuildMedia
];

export function isIgnorable(channel: Channel): channel is IgnorableChannel {
    return (<Array<ChannelType>>IgnorableChannelTypes).includes(channel.type);
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

export async function getIgnoredChannelIds(guildId: string): Promise<Array<string>> {
    const ignores = await IgnoreChannel.findAll({
        where: { GuildId: guildId }
    });
    return ignores.map(ignore => ignore.id);
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

function resolveChannelIds(channel: GuildBasedChannel, ids: Array<string> = [channel.id]): Array<string> {
    if (channel.parentId) {
        ids.push(channel.parentId);
    }
    return channel.parent ? resolveChannelIds(channel.parent, ids) : ids;
}

async function channelIgnored(channel: Channel): Promise<boolean> {
    if (!isIgnorable(channel)) {
        return false;
    }
    return !!await IgnoreChannel.findOne({
        where: {
            id: { [Op.or]: resolveChannelIds(channel) }
        }
    });
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

export async function ignoreMessage(message: Message): Promise<boolean> {
    const [channel, user] = await Promise.all([
        channelIgnored(message.channel),
        IgnoreUser.findByPk(message.author.id)
    ]);
    return channel || !!user;
}

export async function ignoreWord(word: string, guildId: string): Promise<boolean> {
    const [_, created] = await IgnoreWord.findOrCreate({
        where: {
            word,
            GuildId: guildId
        }
    });
    return created
}

export async function getIgnoredWords(guildId: string): Promise<Array<string>> {
    const ignores = await IgnoreWord.findAll({
        where: { GuildId: guildId }
    });
    return ignores.map(ignore => ignore.word);
}

export async function unignoreWord(word: string, guildId: string): Promise<boolean> {
    return !!await IgnoreWord.destroy({
        where: {
            word,
            GuildId: guildId
        }
    });
}

export async function unignoreAllWords(guildId: string): Promise<void> {
    await IgnoreWord.destroy({
        where: { GuildId: guildId }
    });
}

export type IgnorableChannel = GuildTextBasedChannel | CategoryChannel | ForumChannel | MediaChannel;
