const { Client, Intents } = require("discord.js");
const presenceConfig = require("../config/presence.json");

const client = new Client({
    intents: Intents.FLAGS.GUILDS |
        Intents.FLAGS.GUILD_MESSAGES |
        Intents.FLAGS.DIRECT_MESSAGES,
    partials: ["CHANNEL"],
    presence: getPresence()
})

client
    .once("ready", () => {
        console.log(`[discord] Logged in as ${client.user.tag}`);
        setInterval(() => client.user.setPresence(getPresence()), presenceConfig.minutes * 60000);
    })
    .on("error", console.error)
    .login()
    .catch(console.error);

function getPresence() {
    return presenceConfig.presences[Math.floor(Math.random() * presenceConfig.presences.length)];
}

module.exports = client;
