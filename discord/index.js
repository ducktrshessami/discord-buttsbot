const { Client, Intents } = require("discord.js");
const db = require("../models");
const slashCommands = require("./commands/slash");
const postServerCount = require("./utils/postServerCount");
const presenceConfig = require("../config/presence.json");

const client = new Client({
    intents: Intents.FLAGS.GUILDS |
        Intents.FLAGS.GUILD_MESSAGES |
        Intents.FLAGS.DIRECT_MESSAGES,
    partials: ["CHANNEL"],
    presence: getPresence()
});

client.responseEmojis = {
    smile: process.env.RES_SMILE || ":D",
    frown: process.env.RES_FROWN || ":(",
    wink: process.env.RES_WINK || ";)",
    weird: process.env.RES_WEIRD || "O_o"
};

client
    .once("ready", () => {
        console.log(`[discord] Logged in as ${client.user.tag}`);
        setInterval(() => client.user.setPresence(getPresence()), presenceConfig.minutes * 60000);
        postServerCount(client);
        Promise.all(client.guilds.cache.map(guild => db.Guild.findOrCreate({
            where: { id: guild.id }
        })))
            .catch(console.error);
    })
    .on("error", console.error)
    .on("guildCreate", guild => {
        postServerCount(client);
        db.Guild.findOrCreate({
            where: { id: guild.id }
        })
            .catch(console.error);
    })
    .on("guildDelete", () => postServerCount(client))
    .on("interactionCreate", async interaction => {
        try {
            if (interaction.isCommand()) {
                const command = slashCommands.get(interaction.commandName);
                if (command) {
                    console.log(`[discord] ${interaction.user.id} used /${interaction.commandName}`);
                    await command.callback(interaction);
                }
            }
            else if (interaction.isButton()) {
                // help pagination button
            }
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("message", async message => {
        try {
            let usedCommand = false;
            let usedResponse = false;
            const guildModel = await db.Guild.findByPk(message.guildId);
            const usedPrefix = getUsedPrefix(message, guildModel);
            if (usedPrefix) {

            }
        }
        catch (error) {
            console.error(error);
        }
    })
    .login()
    .catch(console.error);

function getPresence() {
    return presenceConfig.presences[Math.floor(Math.random() * presenceConfig.presences.length)];
}

function getUsedPrefix(message, guildModel) {
    if (guildModel.prefix && message.content.startsWith(guildModel.prefix)) {
        return guildModel.prefix;
    }
    else {
        const selector = new RegExp(`^<@!?${message.client.user.id}>\\s+`);
        return message.content.match(selector)
            ?.at(0) || null;
    }
}

module.exports = client;
