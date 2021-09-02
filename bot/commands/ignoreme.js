const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("ignoreme", function (message) {
    db.IgnoreUser.findByPk(message.author.id)
        .then(ignoredUser => {
            if (!ignoredUser) {
                return db.IgnoreUser.create({ id: message.author.id })
                    .then(() => utils.replyVerbose(message, `Okay ${this.client.config.responseEmojis.frown}`));
            }
            else {
                return utils.replyVerbose(message, "I'm already ignoring you.");
            }
        })
        .catch(console.error);
}, {
    usage: "@buttsbot ignoreme",
    description: "I will never buttify anything you say."
});
