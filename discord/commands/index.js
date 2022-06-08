const fs = require("fs");
const path = require("path");
const help = require("./help");

const basename = path.basename(__filename);

const commands = fs
    .readdirSync(__dirname)
    .filter(file =>
        (file.indexOf(".") !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === ".js") &&
        (file.slice(0, -3) !== "help")
    )
    .map(file => require(path.join(__dirname, file)));

help(commands);

module.exports = commands;
