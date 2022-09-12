"use strict";
const { Model, DataTypes } = require("nessie");
module.exports = (nessie, env) => {
    class IgnoreUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of nessie lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    IgnoreUser.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        }
    }, {
        nessie,
        tableName: env === "production" ? "ButtsbotIgnoreUsers" : "DEV_ButtsbotIgnoreUsers"
    });
    return IgnoreUser;
};
