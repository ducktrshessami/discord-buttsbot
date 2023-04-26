import {
    Client,
    Events,
    GatewayIntentBits,
    GuildMember,
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
    DISCORD_RESPONSE_COOLDOWN,
    DISCORD_SWEEPER_INTERVAL,
    DISCORD_THREAD_LIFETIME,
    PRESENCE_INTERVAL
} from "../constants.js";
import { postServerCount } from "./topgg.js";
import {
    Guild,
    ResponseCooldown,
    sequelize
} from "../models/index.js";
import { Op } from "sequelize";
import commands from "./commands/index.js";
import { channelIgnored } from "./ignore.js";
import responses from "./responses/index.js";

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
            await pruneDb(client);
            await postServerCount(client);
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.GuildCreate, guild =>
        postServerCount(guild.client)
            .catch(console.error)
    )
    .on(Events.GuildDelete, guild =>
        postServerCount(guild.client)
            .catch(console.error)
    )
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
                        message.channel.viewable &&
                        message.channel
                            .permissionsFor(message.client.user.id)
                            ?.has(PermissionFlagsBits.SendMessages)
                    )
                ) &&
                !await channelIgnored(message.channel)
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
            }
        }
        catch (err) {
            console.error(err);
        }
    });

export async function login(): Promise<void> {
    await client.login();
}

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}

async function pruneDb(client: Client<true>): Promise<void> {
    await sequelize.transaction(async transaction => {
        const [guilds] = await Promise.all([
            Guild.findAll({ transaction }),
            ResponseCooldown.destroy({
                transaction,
                where: {
                    updatedAt: { [Op.lt]: Date.now() - (DISCORD_RESPONSE_COOLDOWN * 2) }
                }
            })
        ]);
        await Promise.all(
            guilds
                .filter(guild => !client.guilds.cache.has(guild.id))
                .map(guild => guild.destroy({ transaction }))
        );
    });
}
