const { Permissions } = require("discord.js");
const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "unignorechannel",
        description: "Undo ignorechannel!",
        requirePermissions: Permissions.FLAGS.MANAGE_CHANNELS
    },
    callback: async function (message) {
        let reply;
        const ignoreModel = await db.IgnoreChannel.findByPk(message.channelId);
        if (ignoreModel) {
            await ignoreModel.destroy();
            reply = `Okay ${message.client.responseEmojis.smile}`;
        }
        else {
            reply = "I'm not ignoring this channel!";
        }
        logMessage(await message.reply(reply));
    }
};