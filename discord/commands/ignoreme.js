const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("ignoreme", async function (message) {
    let [model, created] = await db.IgnoreUser.findOrCreate({
        where: { id: message.author.id }
    });
    return utils.replyVerbose(message, created ? `Okay ${this.client.config.responseEmojis.frown}` : "I'm already ignoring you.");
}, {
    usage: "@buttsbot ignoreme",
    description: "I will never buttify anything you say."
});
