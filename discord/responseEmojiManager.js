const { Permissions } = require("discord.js");

function checkPermissions(channel, interaction = false) {
    return channel.permissionsFor(interaction ? channel.guild.roles.everyone : channel.guild.me)
        .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);
}

module.exports = {
    smile: function (channel, interaction = false) {
        if (process.env.RES_SMILE && checkPermissions(channel, interaction)) {
            return process.env.RES_SMILE;
        }
        else {
            return ":D";
        }
    },
    frown: function (channel, interaction = false) {
        if (process.env.RES_FROWN && checkPermissions(channel, interaction)) {
            return process.env.RES_FROWN;
        }
        else {
            return ":(";
        }
    },
    wink: function (channel, interaction = false) {
        if (process.env.RES_WINK && checkPermissions(channel, interaction)) {
            return process.env.RES_WINK;
        }
        else {
            return ";)";
        }
    },
    weird: function (channel, interaction = false) {
        if (process.env.RES_WEIRD && checkPermissions(channel, interaction)) {
            return process.env.RES_WEIRD;
        }
        else {
            return "O_o";
        }
    }
};
