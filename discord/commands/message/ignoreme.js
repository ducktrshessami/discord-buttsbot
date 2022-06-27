const db = require("../../../models");
const { frown } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "ignoreme",
        description: "I will never buttify anything you say."
    },
    callback: async function (message) {
        let [_, created] = await db.IgnoreUser.findOrCreate({
            where: { id: message.author.id }
        });
        logMessage(await message.reply(created ? `Okay ${frown(message.channel)}` : "I'm already ignoring you."));
    }
};
