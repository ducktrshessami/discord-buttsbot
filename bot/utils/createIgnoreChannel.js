const db = require("../../models");

async function createIgnoreChannel(guildID, channelID) {
    let [model, created] = await db.IgnoreChannel.findOrCreate({
        where: { id: channelID },
        defaults: { GuildId: guildID }
    });
    return created;
}

module.exports = createIgnoreChannel;
