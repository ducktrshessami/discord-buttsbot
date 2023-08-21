import {
    ChannelType,
    Client,
    Events,
    GatewayIntentBits,
    GuildMember,
    GuildTextBasedChannel,
    Options,
    Partials,
    PermissionFlagsBits,
    PresenceData,
    User
} from "discord.js";
import activities from "./activities.js";
import {
    DISCORD_LIMITED_CACHE_MAX,
    DISCORD_MESSAGE_LIFETIME,
    DISCORD_SWEEPER_INTERVAL,
    DISCORD_THREAD_LIFETIME,
    PRESENCE_INTERVAL
} from "../constants.js";
import { postServerCount } from "./topgg.js";
import commands from "./commands/index.js";
import { ignoreMessage } from "./ignore.js";
import responses from "./responses/index.js";
import { buttifiable, buttify } from "./buttify.js";
import { deleteGuild, getGuild } from "./guild.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.DirectMessages |
        GatewayIntentBits.MessageContent,
    partials: [Partials.Channel],
    presence: getPresence(),
    allowedMentions: { parse: [] },
    sweepers: {
        threads: {
            interval: DISCORD_SWEEPER_INTERVAL,
            lifetime: DISCORD_THREAD_LIFETIME
        },
        messages: {
            interval: DISCORD_SWEEPER_INTERVAL,
            lifetime: DISCORD_MESSAGE_LIFETIME
        }
    },
    makeCache: Options.cacheWithLimits({
        MessageManager: DISCORD_LIMITED_CACHE_MAX,
        UserManager: {
            maxSize: DISCORD_LIMITED_CACHE_MAX,
            keepOverLimit: keepClientUser
        },
        GuildMemberManager: {
            maxSize: DISCORD_LIMITED_CACHE_MAX,
            keepOverLimit: keepClientUser
        }
    })
})
    .on(Events.Debug, console.debug)
    .on(Events.Warn, console.warn)
    .on(Events.Error, console.error)
    .once(Events.ClientReady, async client => {
        try {
            client.off(Events.Debug, console.debug);
            console.log(`[discord] Logged in as ${client.user.tag}`);
            setInterval(() => client.user.setPresence(getPresence()), PRESENCE_INTERVAL);
            await postServerCount(client);
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.GuildCreate, async guild => {
        try {
            if (guild.client.isReady()) {
                await postServerCount(guild.client);
            }
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.GuildDelete, async guild => {
        try {
            if (guild.client.isReady()) {
                await deleteGuild(guild.id);
                await postServerCount(guild.client);
            }
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.InteractionCreate, async interaction => {
        try {
            if (interaction.isChatInputCommand()) {
                const command = commands.get(interaction.commandName);
                if (
                    command && (
                        command.data.dm_permission !== false ||
                        interaction.inCachedGuild()
                    )
                ) {
                    console.log(`[discord] ${interaction.user.id} used ${interaction}`);
                    await command.callback(interaction);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.MessageCreate, async message => {
        try {
            if (
                message.author.id !== message.client.user.id && (
                    !message.inGuild() || (
                        !message.guild.members.me?.isCommunicationDisabled() &&
                        isSendable(message.channel)
                    )
                ) &&
                !await ignoreMessage(message)
            ) {
                if (
                    message.mentions.users.has(message.client.user.id) ||
                    message.content
                        .toLowerCase()
                        .includes(message.client.user.username.toLowerCase())
                ) {
                    const response = responses.find(r => r.pattern.test(message.content));
                    if (response) {
                        await response.send(message);
                        return;
                    }
                }
                if (!message.inGuild()) {
                    return;
                }
                const guildModel = await getGuild(message.guildId);
                if (buttifiable(message, guildModel?.frequency)) {
                    const buttified = buttify(
                        message.content,
                        guildModel?.word,
                        guildModel?.rate
                    );
                    if (buttified) {
                        await message.channel.send(buttified);
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    });

export async function login(): Promise<void> {
    console.log("[discord] Connecting to Discord");
    await client.login();
}

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}

function isSendable(channel: GuildTextBasedChannel): boolean {
    const permissions = channel.permissionsFor(channel.client.user);
    return !!permissions?.has(PermissionFlagsBits.ViewChannel) && (
        channel.isThread() ? (
            !(channel.archived && channel.locked && !channel.manageable) &&
            (channel.type !== ChannelType.PrivateThread || channel.joined || channel.manageable) &&
            permissions.has(PermissionFlagsBits.SendMessagesInThreads)
        ) :
            permissions.has(PermissionFlagsBits.SendMessages)
    );
}
