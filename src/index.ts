import { DB_FORCE } from "./constants.js";
import { login } from "./discord/index.js";
import { sequelize } from "./models/index.js";

try {
    await sequelize.sync({ force: DB_FORCE });
    await login();
}
catch (err) {
    console.error(err);
}
