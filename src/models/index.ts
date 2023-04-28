import { Sequelize } from "sequelize";
import config from "../config.js";
import { DB_FORCE, NODE_ENV } from "../constants.js";
import Guild from "./Guild.js";
import IgnoreUser from "./IgnoreUser.js";
import IgnoreChannel from "./IgnoreChannel.js";
import ResponseCooldown from "./ResponseCooldown.js";

const dbConfig = config.db[NODE_ENV];

export let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

Guild.initialize(sequelize);
IgnoreUser.initialize(sequelize);
IgnoreChannel.initialize(sequelize);
ResponseCooldown.initialize(sequelize);

Guild.hasMany(IgnoreChannel, { onDelete: "CASCADE" });
IgnoreChannel.belongsTo(Guild);

export {
    Guild,
    IgnoreUser,
    IgnoreChannel,
    ResponseCooldown
};

export async function sync(): Promise<void> {
    await sequelize.sync({ force: DB_FORCE });
}
