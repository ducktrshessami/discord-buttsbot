"use strict";
const { Model } = require("sequelize");
const defaultConfig = require("../config/default.json");
const { wordMaxLength } = require("../config/discord.json");
module.exports = (sequelize, DataTypes) => {
    class Guild extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of nessie lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Guild.hasMany(models.IgnoreChannel, { onDelete: "cascade" });
        }
    };
    Guild.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        word: {
            type: DataTypes.STRING(wordMaxLength),
            defaultValue: defaultConfig.word
        },
        frequency: {
            type: DataTypes.INTEGER,
            defaultValue: defaultConfig.frequency
        },
        rate: {
            type: DataTypes.INTEGER,
            defaultValue: defaultConfig.rate
        }
    }, {
        sequelize,
        modelName: "Guild",
    });
    return Guild;
};
