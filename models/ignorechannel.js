"use strict";
const { Model, DataTypes, OnDeleteBehavior } = require("nessie");
module.exports = (nessie, env) => {
    class IgnoreChannel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.IgnoreChannel.belongsTo(models.Guild, { onDelete: OnDeleteBehavior.CASCADE });
        }
    };
    IgnoreChannel.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        }
    }, {
        nessie,
        tableName: env === "production" ? "ButtsbotIgnoreChannels" : "DEV_ButtsbotIgnoreChannels"
    });
    return IgnoreChannel;
};
