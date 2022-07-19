const { PermissionFlagsBits } = require("discord.js");
const logMessage = require("../../utils/logMessage");
const defaultButt = require("../../../config/default.json");

module.exports = {
    data: {
        name: "word",
        description: "Use this command to show or change what word I buttify messages with!",
        subtitle: `The default word is ${defaultButt.word}.`,
        args: "[word]",
        requirePermissions: PermissionFlagsBits.ManageGuild
    },
    callback: async function (message, args, guildModel) {
        let reply;
        const newValue = args[1]?.toLowerCase();
        if (newValue) {
            if (/\s/g.test(newValue)) {
                reply = "No spaces, please!";
            }
            else {
                const { word } = await guildModel.update({ word: newValue });
                reply = `Buttification word changed to \`${word}\`!`;
            }
        }
        else {
            reply = `I buttify messages with the word \`${guildModel.word}\`!`;
        }
        logMessage(await message.reply(reply));
    }
};
