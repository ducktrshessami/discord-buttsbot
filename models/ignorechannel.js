"use strict";
const { Model, DataTypes } = require("nessie");
module.exports = (nessie) => {
    class IgnoreChannel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.IgnoreChannel.belongsTo(models.Guild);
        }
    };
    IgnoreChannel.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        }
    }, { nessie });
    return IgnoreChannel;
};
