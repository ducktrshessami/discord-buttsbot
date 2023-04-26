import {
    Client,
    Events,
    GatewayIntentBits,
    GuildMember,
    Options,
    Partials,
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
            if (activities.length) {
                setInterval(() => client.user.setPresence(getPresence()!), PRESENCE_INTERVAL);
            }
        }
        catch (err) {
            console.error(err);
        }
    });

export async function login(): Promise<void> {
    await client.login();
}

function getPresence(): PresenceData | undefined {
    if (activities.length) {
        return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
    }
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}
