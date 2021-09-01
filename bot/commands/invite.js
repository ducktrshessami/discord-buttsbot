const { Command, utils } = require("discord-bot");
const { permissionValue } = require("../../config/bot.json");

module.exports = new Command("invite", function (message) {
    utils.replyVerbose(message, `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${permissionValue}&scope=bot`)
        .catch(console.error);
}, {
    usage: "@buttsbot invite",
    description: "I'll send a link so you can invite me somewhere else!"
});
