const db = require("../../../models");
const { smile } = require("../../responseEmojiManager");
const logMessage = require("../../utils/logMessage");

module.exports = {
    data: {
        name: "unignoreme",
        description: "Undo ignoreme!"
    },
    callback: async function (message) {
        let reply;
        const ignoredUser = await db.IgnoreUser.findByPk(message.author.id);
        if (ignoredUser) {
            await ignoredUser.destroy();
            reply = `Okay ${smile(message)}`;
        }
        else {
            reply = "I'm not ignoring you!";
        }
        logMessage(await message.reply(reply));
    }
};
