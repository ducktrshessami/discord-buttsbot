const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignoreme", async function (message) {
    let reply;
    let ignoredUser = await db.IgnoreUser.findByPk(message.author.id);
    if (ignoredUser) {
        await ignoredUser.destroy();
        reply = `Okay ${this.client.config.responseEmojis.smile}`;
    }
    else {
        reply = "I'm not ignoring you!";
    }
    return utils.replyVerbose(message, reply);
}, {
    usage: "@buttsbot unignoreme",
    description: "Undo ignoreme!"
});
