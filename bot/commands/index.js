const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const commands = fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
    })
    .map(file => require(path.join(__dirname, file)));

module.exports = commands;
