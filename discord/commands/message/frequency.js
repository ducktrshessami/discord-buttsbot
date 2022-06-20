const { Permissions } = require("discord.js");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: {
        name: "frequency",
        description: "Use this command to show or change how often I buttify messages!",
        subtitle: `The default frequency is ${defaultButt.frequency}.`,
        args: "[number]",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message, args, guildModel) {
        let reply;
        const newValue = parseInt(args[1]);
        if (!isNaN(newValue)) {
            if (newValue > 0) {
                const { frequency } = await guildModel.update({ frequency: newValue });
                reply = `Buttify frequency changed to one in every \`${frequency}\` messages!`;
            }
            else {
                reply = "Positive whole numbers only please!";
            }
        }
        else {
            reply = `I buttify roughly one in every \`${guildModel.frequency}\` messages!`;
        }
        logMessage(await message.reply(reply));
    }
};
