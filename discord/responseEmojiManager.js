const { Permissions } = require("discord.js");

function checkPermissions(channel, interaction = false) {
    return !channel.guildId ||
        channel.permissionsFor(interaction ? channel.guild.roles.everyone : channel.guild.me)
            .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);
}

function responseFactory(envEmote, defaultEmote) {
    return function (repliable) {
        if (process.env[envEmote] && checkPermissions(repliable)) {
            return process.env[envEmote];
        }
        else {
            return defaultEmote;
        }
    };
}

module.exports = {
    smile: responseFactory("RES_SMILE", ":D"),
    frown: responseFactory("RES_FROWN", ":("),
    wink: responseFactory("RES_WINK", ";)"),
    weird: responseFactory("RES_WEIRD", "O_o")
};
