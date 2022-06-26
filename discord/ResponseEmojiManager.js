const { Permissions } = require("discord.js");

function checkPermissions(channel) {
    return channel.permissionsFor(channel.guild.me)
        .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);
}

module.exports = {
    smile: function (channel) {
        if (process.env.RES_SMILE && checkPermissions(channel)) {
            return process.env.RES_SMILE;
        }
        else {
            return ":D";
        }
    },
    frown: function (channel) {
        if (process.env.RES_FROWN && checkPermissions(channel)) {
            return process.env.RES_FROWN;
        }
        else {
            return ":(";
        }
    },
    wink: function (channel) {
        if (process.env.RES_WINK && checkPermissions(channel)) {
            return process.env.RES_WINK;
        }
        else {
            return ";)";
        }
    },
    weird: function (channel) {
        if (process.env.RES_WEIRD && checkPermissions(channel)) {
            return process.env.RES_WEIRD;
        }
        else {
            return "O_o";
        }
    }
};
