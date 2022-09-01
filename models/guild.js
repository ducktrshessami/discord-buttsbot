"use strict";
const { Model, DataTypes } = require("nessie");
const defaultConfig = require("../config/default.json");
module.exports = (nessie) => {
    class Guild extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Guild.hasMany(models.IgnoreChannel);
        }
    };
    Guild.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        word: {
            type: DataTypes.STRING,
            defaultValue: defaultConfig.word
        },
        frequency: {
            type: DataTypes.NUMBER,
            defaultValue: defaultConfig.frequency
        },
        rate: {
            type: DataTypes.NUMBER,
            defaultValue: defaultConfig.rate
        }
    }, { nessie });
    return Guild;
};
