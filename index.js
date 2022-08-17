try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const db = require("./models");
const { responseCooldown } = require("./config/bot.json");

db.sequelize.sync({ force: process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false" })
    .then(() => {
        console.log("[db] Pruning old cooldown data");
        return db.ResponseCooldown.destroy({
            where: {
                updatedAt: {
                    [db.Sequelize.Op.lt]: Date.now() - (responseCooldown * 2)
                }
            }
        });
    })
    .then(() => require("./discord"))
    .catch(err => {
        console.error(err);
        process.exit();
    });
