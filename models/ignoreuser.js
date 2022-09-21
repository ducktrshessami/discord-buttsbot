"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
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
        sequelize,
        modelName: "IgnoreUser",
    });
    return IgnoreUser;
};
