import { DB_FORCE } from "./constants.js";
import { sequelize } from "./models/index.js";

try {
    await sequelize.sync({ force: DB_FORCE });
}
catch (err) {
    console.error(err);
}
