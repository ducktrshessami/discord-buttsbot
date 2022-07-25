try {
    require("dotenv").config();
}
catch {
    console.warn("Not using dotenv. Make sure environment variables are set");
}

const express = require("express");
const cycle = require("express-cycle");
const { resolve } = require("path");
const db = require("./models");
const { responseCooldown } = require("./config/bot.json");

const app = express();
const PORT = process.env.PORT || 8080;
const cycler = cycle({
    origin: process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`,
    verbose: true
});

app.use(cycler);
app.use(express.static(resolve(__dirname, "public")));

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
    .then(() => app.listen(PORT, function () {
        console.log(`[express] Listening on PORT ${PORT}`);
        cycler.startLoop();
        require("./discord");
    }))
    .catch(err => {
        console.error(err);
        process.exit();
    });
