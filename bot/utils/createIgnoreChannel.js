const db = require("../../models");

function createIgnoreChannel(guildID, channelID) {
    return db.IgnoreChannel.findByPk(channelID)
        .then(ignoredChannel => {
            if (!ignoredChannel) {
                return db.IgnoreChannel.create({
                    id: channelID,
                    GuildId: guildID
                })
                    .then(() => true);
            }
            else {
                return false;
            }
        });
}

module.exports = createIgnoreChannel;
