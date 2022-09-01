"use strict";
const { Model, DataTypes } = require("nessie");
module.exports = (nessie) => {
    class ResponseCooldown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    ResponseCooldown.init({
        channelId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        smile: DataTypes.NUMBER,
        frown: DataTypes.NUMBER,
        wink: DataTypes.NUMBER,
        weird: DataTypes.NUMBER,
        updatedAt: DataTypes.NUMBER
    }, { nessie });
    return ResponseCooldown;
};
