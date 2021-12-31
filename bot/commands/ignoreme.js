const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("ignoreme", function (message) {
    db.IgnoreUser.findOrCreate({
        where: { id: message.author.id }
    })
        .then(([model, created]) => utils.replyVerbose(message, created ? `Okay ${this.client.config.responseEmojis.frown}` : "I'm already ignoring you."))
        .catch(console.error);
}, {
    usage: "@buttsbot ignoreme",
    description: "I will never buttify anything you say."
});
