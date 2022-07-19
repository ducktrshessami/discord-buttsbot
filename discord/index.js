const { Client, GatewayIntentBits, Partials, PermissionFlagsBits } = require("discord.js");
const db = require("../models");
const slashCommands = require("./commands/slash");
const messageCommands = require("./commands/message");
const responses = require("./responses");
const responseEmojiManager = require("./responseEmojiManager");
const postServerCount = require("./utils/postServerCount");
const logMessage = require("./utils/logMessage");
const getCommandListPage = require("./utils/getCommandListPage");
const buttify = require("./utils/buttify");
const presenceConfig = require("../config/presence.json");
const { responseCooldown } = require("../config/bot.json");

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
    .once("ready", () => {
        console.log(`[discord] Logged in as ${client.user.tag}`);
        client.off("debug", console.debug);
        setInterval(() => client.user.setPresence(getPresence()), presenceConfig.minutes * 60000);
        postServerCount(client);
        Promise.all(client.guilds.cache.map(guild => db.Guild.findOrCreate({
            where: { id: guild.id }
        })))
            .catch(console.error);
    })
    .on("guildCreate", guild => {
        postServerCount(client);
        db.Guild.findOrCreate({
            where: { id: guild.id }
        })
            .catch(console.error);
    })
    .on("guildDelete", () => postServerCount(client))
    .on("threadCreate", async (thread, newlyCreated) => {
        try {
            if (newlyCreated) {
                const parentIgnore = await db.IgnoreChannel.findByPk(thread.parentId);
                if (parentIgnore) {
                    await db.IgnoreChannel.create({
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
                const command = slashCommands.get(interaction.commandName);
                if (command) {
                    console.log(`[discord] ${interaction.user.id} used ${interaction}`);
                    await command.callback(interaction);
                }
            }
            else if (interaction.isButton()) {
                await interaction.deferUpdate();
                await interaction.editReply(await getCommandListPage(!interaction.customId.match(/elevated/ig)));
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
                        .has(PermissionFlagsBits.SendMessages)
                )
            ) {
                let usedCommand = false;
                const guildModel = await db.Guild.findByPk(message.guildId);
                const usedPrefix = getUsedPrefix(message, guildModel);
                if (usedPrefix) {
                    const args = message.content
                        .slice(usedPrefix.length)
                        .split(/\s/g);
                    const command = messageCommands.get(args[0]);
                    if (command) {
                        usedCommand = true;
                        logMessage(message);
                        if ((command.data.requireGuild || command.data.requirePermissions) && !message.inGuild()) {
                            logMessage(await message.reply("This command only works in servers!"));
                        }
                        else if (
                            command.data.requirePermissions &&
                            message.inGuild() &&
                            !message.channel.permissionsFor(message.member)
                                .has(command.data.requirePermissions)
                        ) {
                            const missing = message.channel.permissionsFor(message.member)
                                .missing(command.data.requirePermissions)
                                .map(permission => `\`${permission}\``)
                                .join(", ");
                            logMessage(await message.reply(`You are missing the following permissions:\n${missing}`));
                        }
                        else {
                            await command.callback(message, args, guildModel);
                        }
                    }
                }
                if (!usedCommand) {
                    let usedResponse = false;
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
                            usedResponse = true;
                            await sendResponse(message, response);
                        }
                    }
                    if (!usedResponse && await checkButtify(message, guildModel)) {
                        const buttified = buttify(message.cleanContent, guildModel.word, guildModel.rate);
                        if (verifyButtify(message.cleanContent, buttified, guildModel.word)) {
                            logMessage(await message.channel.send(buttified));
                        }
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

function getUsedPrefix(message, guildModel) {
    if (guildModel?.prefix && message.content.startsWith(guildModel.prefix)) {
        return guildModel.prefix;
    }
    else {
        const selector = new RegExp(`^<@!?${message.client.user.id}>\\s*`);
        return message.content.match(selector)
            ?.at(0) || null;
    }
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
    return originalFormatted !== buttifiedFormatted &&
        !(new RegExp(`^${word}s?$`, "i")
            .test(buttifiedFormatted));
}

module.exports = client;
