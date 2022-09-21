const { Client, GatewayIntentBits, Partials, PermissionFlagsBits, MessageFlags } = require("discord.js");
const db = require("../models");
const commands = require("./commands");
const responses = require("./responses");
const responseEmojiManager = require("./responseEmojiManager");
const postServerCount = require("./utils/postServerCount");
const logMessage = require("./utils/logMessage");
const buttify = require("./utils/buttify");
const presenceConfig = require("../config/presence.json");
const { responseCooldown } = require("../config/discord.json");

const client = new Client({
    intents: GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.DirectMessages |
        GatewayIntentBits.MessageContent,
    partials: [Partials.Channel],
    presence: getPresence()
});

client
    .on("debug", console.debug)
    .on("warn", console.warn)
    .on("error", console.error)
    .once("ready", async () => {
        try {
            console.log(`[discord] Logged in as ${client.user.tag}`);
            client.off("debug", console.debug);
            setInterval(() => client.user.setPresence(getPresence()), presenceConfig.minutes * 60000);
            await db.Guild.bulkCreate(client.guilds.cache.map(guild => ({ id: guild.id })), { ignoreDuplicates: true });
            await postServerCount(client);
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("guildCreate", async guild => {
        try {
            await db.Guild.findOrCreate({
                where: { id: guild.id }
            });
            await postServerCount(client);
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("guildDelete", () => postServerCount(client).catch(console.error))
    .on("interactionCreate", async interaction => {
        try {
            if (interaction.isChatInputCommand()) {
                const command = commands.get(interaction.commandName);
                if (command) {
                    console.log(`[discord] ${interaction.user.id} used ${interaction}`);
                    await command.callback(interaction);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("messageCreate", async message => {
        try {
            if (
                message.author.id !== client.user.id &&
                (
                    !message.inGuild() ||
                    message.channel.permissionsFor(message.guild.members.me)
                        ?.has(PermissionFlagsBits.SendMessages)
                )
            ) {
                if (
                    message.mentions.users.has(client.user.id) ||
                    message.content
                        .toLowerCase()
                        .includes(client.user.username.toLowerCase())
                ) {
                    const words = message.content
                        .toLowerCase()
                        .split(/\s/g);
                    const response = responses.find(r => r.keywords.some(keyword => words.includes(keyword)));
                    if (response) {
                        await sendResponse(message, response);
                        return;
                    }
                }
                const guildModel = await db.Guild.findByPk(message.guildId);
                if (await checkButtify(message, guildModel)) {
                    const buttified = buttify(message.cleanContent, guildModel.word, guildModel.rate);
                    if (verifyButtify(message.cleanContent, buttified, guildModel.word)) {
                        logMessage(await message.channel.send(buttified));
                    }
                }
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

async function sendResponse(message, response) {
    const [cooldownModel] = await db.ResponseCooldown.findOrCreate({
        where: { channelId: message.channelId }
    });
    if (!cooldownModel[response.emoji] || (message.createdTimestamp - cooldownModel[response.emoji] > responseCooldown)) {
        const newCooldown = {};
        newCooldown[response.emoji] = message.createdAt;
        logMessage(await message.channel.send(responseEmojiManager[response.emoji](message)));
        await cooldownModel.update(newCooldown);
    }
}

async function checkButtify(message, guildModel) {
    const [channelModel, userModel] = await Promise.all([
        db.IgnoreChannel.findByPk(message.channelId),
        db.IgnoreUser.findByPk(message.author.id)
    ]);
    return !message.author.bot &&
        message.inGuild() &&
        message.cleanContent &&
        !channelModel &&
        !userModel &&
        (Math.random() < (1 / guildModel.frequency));
}

function verifyButtify(original, buttified, word) {
    const originalFormatted = original
        .replaceAll(/[^A-Z]+/gi, "")
        .toLowerCase();
    const buttifiedFormatted = buttified
        .replaceAll(/[^A-Z]+/gi, "")
        .toLowerCase();
    return buttified.length < 2000 &&
        originalFormatted !== buttifiedFormatted &&
        !(new RegExp(`^${word}s?$`, "i")
            .test(buttifiedFormatted));
}

module.exports = client;
