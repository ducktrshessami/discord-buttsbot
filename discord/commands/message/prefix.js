const { Permissions } = require("discord.js");

module.exports = {
    data: {
        name: "prefix",
        description: "View or change the command prefix!",
        args: "[prefix]",
        requireGuild: true
    },
    callback: async function (message, args, guildModel) {
        let reply;
        const newValue = args[1];
        if (newValue) {
            if (message.channel.permissionsFor(message.member).has(Permissions.FLAGS.MANAGE_GUILD)) {
                const { prefix } = await guildModel.update({ prefix: newValue });
                reply = `Custom prefix changed to \`${prefix}\`!`;
            }
            else {
                reply = `You are missing the following permissions:\n\`Manage Server\``;
            }
        }
        else {
            if (guildModel.prefix) {
                reply = `The custom prefix is currently \`${guildModel.prefix}\`!`;
            }
            else {
                reply = "Custom prefix not set.";
            }
        }
        logMessage(await message.reply(reply));
    }
};
