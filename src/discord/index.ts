import {
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    PresenceData
} from "discord.js";
import activities from "./activities.js";
import { PRESENCE_INTERVAL } from "../constants.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.DirectMessages |
        GatewayIntentBits.MessageContent,
    partials: [Partials.Channel],
    presence: getPresence()
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
