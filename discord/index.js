const { Client, Intents } = require("discord.js");

const client = new Client({
    intents: Intents.FLAGS.GUILDS |
        Intents.FLAGS.GUILD_MESSAGES |
        Intents.FLAGS.DIRECT_MESSAGES,
    partials: ["CHANNEL"],
    presence: getPresence()
})

client
    .on("ready", () => {
        console.log(`[discord] Logged in as ${client.user.tag}`);
    })
    .login()
    .catch(console.error);

function getPresence() {

}

module.exports = client;
