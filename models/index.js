"use strict";

const fs = require("fs");
const path = require("path");
const { Nessie } = require("nessie");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const db = new Nessie({
    verbose: true,
    libDir: process.env.DB_LIBDIR,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionString: process.env.DB_CONNECTSTRING
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => require(path.join(__dirname, file))(db, env));

Object.keys(db.models).forEach(modelName => {
    if (db.models[modelName].associate) {
        db.models[modelName].associate(db.models);
    }
});

module.exports = db;
