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
        app.listen(PORT, function () {
            console.log(`Listening on PORT ${PORT}`);
            cycler.startLoop();
            process.bot = require("./bot");
        });
    })
    .catch(err => {
        console.error(err);
        process.exit();
    });
