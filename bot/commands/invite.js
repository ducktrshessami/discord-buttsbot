const { Command, utils } = require("discord-bot");
const { MessageActionRow, MessageButton } = require("discord.js");
const { permissionValue } = require("../../config/bot.json");

module.exports = new Command("invite", function (message) {
    utils.replyVerbose(message, {
        content: `Invite me to another server!`,
        components: [new MessageActionRow({
            components: [new MessageButton({
                style: "LINK",
                label: "Invite",
                url: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${permissionValue}&scope=bot`
            })]
        })]
    })
        .catch(console.error);
}, {
    usage: "@buttsbot invite",
    description: "I'll send a link so you can invite me somewhere else!"
});
