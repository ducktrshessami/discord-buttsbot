const { Command, utils } = require("discord-bot");
const db = require("../../models");

module.exports = new Command("unignoreme", function (message) {
    db.IgnoreUser.findByPk(message.author.id)
        .then(ignoredUser => {
            if (ignoredUser) {
                return ignoredUser.destroy()
                    .then(() => utils.replyVerbose(message, `Okay ${smile}`));
            }
            else {
                return utils.replyVerbose(message, "I'm not ignoring you!");
            }
        })
        .catch(console.error);
}, {
    usage: "@buttsbot unignoreme",
    description: "Undo ignoreme!"
});
