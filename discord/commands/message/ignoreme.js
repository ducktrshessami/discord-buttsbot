const db = require("../../../models");
const logMessage = require("../../utils/logMessage");

module.exports = {
    name: "ignoreme",
    callback: async function (message) {
        let [_, created] = await db.IgnoreUser.findOrCreate({
            where: { id: message.author.id }
        });
        logMessage(await message.reply(created ? `Okay ${message.client.responseEmojis.frown}` : "I'm already ignoring you."));
    }
};
