import { Sequelize } from "sequelize";
import config from "../config.js";
import { DB_FORCE, NODE_ENV } from "../constants.js";
import Guild from "./Guild.js";
import IgnoreChannel from "./IgnoreChannel.js";
import IgnoreUser from "./IgnoreUser.js";
import IgnoreWord from "./IgnoreWord.js";
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
IgnoreWord.initialize(sequelize);
ResponseCooldown.initialize(sequelize);

Guild.hasMany(IgnoreChannel, { onDelete: "CASCADE" });
Guild.hasMany(IgnoreWord, { onDelete: "CASCADE" });
IgnoreChannel.belongsTo(Guild);
IgnoreWord.belongsTo(Guild);

export { Guild, IgnoreChannel, IgnoreUser, IgnoreWord, ResponseCooldown };

export async function sync(): Promise<void> {
    console.log("[db] Syncing models");
    await sequelize.sync({ force: DB_FORCE });
}
