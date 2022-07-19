const { BaseInteraction, PermissionFlagsBits } = require("discord.js");

function checkPermissions(repliable) {
    return !repliable.guildId || (
        repliable instanceof BaseInteraction ?
            repliable.appPermissions.has(PermissionFlagsBits.UseExternalEmojis) :
            repliable.channel.permissionsFor(repliable.guild.members.me)
                .has(PermissionFlagsBits.UseExternalEmojis)
    )
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
