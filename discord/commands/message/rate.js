const { Permissions } = require("discord.js");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: {
        name: "rate",
        description: "Use this command to show or change the amount of syllables buttified when I buttify a message!",
        subtitle: `The default rate is ${defaultButt.rate}.`,
        args: "[number]",
        requirePermissions: Permissions.FLAGS.MANAGE_GUILD
    },
    callback: async function (message, args, guildModel) {
        let reply;
        const newValue = parseInt(args[1]);
        if (!isNaN(newValue)) {
            if (newValue > 0) {
                const { rate } = await guildModel.update({ rate: newValue });
                reply = `Buttify rate changed to one in every \`${rate}\` syllables per buttified message!`;
            }
            else {
                reply = "Positive whole numbers only please!";
            }
        }
        else {
            reply = `I buttify roughly one in every \`${guildModel.rate}\` syllables per buttified message!`;
        }
        logMessage(await message.reply(reply));
    }
};
