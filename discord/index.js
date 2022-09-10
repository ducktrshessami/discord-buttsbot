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
const permissionsForDebugutil = require("./utils/permissionsForDebugUtil");

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
            await db.models.Guild.bulkCreate(client.guilds.cache.map(guild => ({ id: guild.id })), { ignoreDuplicates: true });
            await postServerCount(client);
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("guildCreate", async guild => {
        try {
            await db.models.Guild.findOrCreate({
                where: { id: guild.id }
            });
            await postServerCount(client);
        }
        catch (error) {
            console.error(error);
        }
    })
    .on("guildDelete", () => postServerCount(client).catch(console.error))
    .on("threadCreate", async (thread, newlyCreated) => {
        try {
            if (newlyCreated) {
                const parentIgnore = await db.models.IgnoreChannel.findOne({
                    where: { id: thread.parentId }
                });
                if (parentIgnore) {
                    await db.models.IgnoreChannel.create({
                        id: thread.id,
                        GuildId: thread.guildId
                    });
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    })
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
                    permissionsForDebugutil(message.channel)
                        .has(PermissionFlagsBits.SendMessages)
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
                const guildModel = await db.models.Guild.findOne({
                    where: { id: message.guildId }
                });
                if (await checkButtify(message, guildModel)) {
                    const buttified = buttify(message.cleanContent, guildModel.dataValues.word, guildModel.dataValues.rate);
                    if (verifyButtify(message.cleanContent, buttified, guildModel.dataValues.word)) {
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
    const [cooldownModel] = await db.models.ResponseCooldown.findOrCreate({
        where: { channelId: message.channelId }
    });
    if (!cooldownModel.dataValues[response.emoji] || (message.createdTimestamp - cooldownModel.dataValues[response.emoji] > responseCooldown)) {
        const newCooldown = { updatedAt: Date.now() };
        newCooldown[response.emoji] = message.createdTimestamp;
        logMessage(await message.channel.send(responseEmojiManager[response.emoji](message)));
        await cooldownModel.update(newCooldown);
    }
}

async function checkButtify(message, guildModel) {
    const [channelModel, userModel] = await Promise.all([
        db.models.IgnoreChannel.findOne({
            where: { id: message.channelId }
        }),
        db.models.IgnoreUser.findOne({
            where: { id: message.author.id }
        })
    ]);
    return !message.author.bot &&
        message.inGuild() &&
        message.cleanContent &&
        !channelModel &&
        !userModel &&
        (Math.random() < (1 / guildModel.dataValues.frequency));
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
