const db = require("../../models");

function initGuild(guild) {
    return db.Guild.findByPk(guild.id)
        .then(model => {
            if (model) {
                return model.update({ name: guild.name });
            }
            else {
                return db.Guild.create({
                    id: guild.id,
                    name: guild.name
                });
            }
        });
}

module.exports = initGuild;
