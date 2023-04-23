import { Sequelize } from "sequelize";
import config from "../config.js";
import { NODE_ENV } from "../constants.js";

const dbConfig = config.db[NODE_ENV];

export let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}
