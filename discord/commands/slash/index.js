const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);

const commands = new Collection(
    fs
        .readdirSync(__dirname)
        .filter(file =>
            (file.indexOf(".") !== 0) &&
            (file !== basename) &&
            (file.slice(-3) === ".js")
        )
        .map(file => {
            const cmd = require(path.join(__dirname, file));
            return [cmd.data.name, cmd];
        })
);

module.exports = commands;
