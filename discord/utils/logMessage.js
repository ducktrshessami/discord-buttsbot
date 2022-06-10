// Log a message

function logMessage(message) {
    let source = message.guild ? `${message.guild.id}/${message.channelId}` : message.channelId;
    if (message.content) {
        console.log(`[${source}] ${message.author.tag}: ${message.content}`);
    }
    if (message.components.length) {
        console.log(`[${source}] ${message.author.tag}: [MESSAGE COMPONENTS]`);
    }
    if (message.attachments.size) {
        console.log(`[${source}] ${message.author.tag}: [${message.attachments.size} ATTACHMENTS]`);
    }
    if (message.embeds.length) {
        console.log(`[${source}] ${message.author.tag}: [${message.embeds.length} EMBEDS]`);
    }
    return message;
};

module.exports = logMessage;
