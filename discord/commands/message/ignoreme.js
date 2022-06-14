const db = require("../../../models");
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
        logMessage(await message.reply(created ? `Okay ${message.client.responseEmojis.frown}` : "I'm already ignoring you."));
    }
};
