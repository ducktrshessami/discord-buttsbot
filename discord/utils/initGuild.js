const db = require("../../models");

async function initGuild(guild) {
    let [model] = await db.Guild.findOrCreate({
        where: { id: guild.id }
    });
    return model;
}

module.exports = initGuild;
