// Log a message

function logMessage(message) {
    const source = [
        message.guildId,
        message.channelId,
        message.author.id
    ]
        .filter(item => item)
        .join("/");
    if (message.content) {
        console.log(`[discord] ${source}: ${message.content}`);
    }
    if (message.components.reduce((total, row) => total + row.components.length, 0)) {
        console.log(`[discord] ${source}: [MESSAGE COMPONENTS]`);
    }
    if (message.attachments.size) {
        console.log(`[discord] ${source}: [${message.attachments.size} ATTACHMENTS]`);
    }
    if (message.embeds.length) {
        console.log(`[discord] ${source}: [${message.embeds.length} EMBEDS]`);
    }
    return message;
};

module.exports = logMessage;
