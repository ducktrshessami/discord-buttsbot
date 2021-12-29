const db = require("../../models");

async function initGuild(guild) {
    return (await db.Guild.findOrCreate({
        where: { id: guild.id }
    }))[0];
}

module.exports = initGuild;
