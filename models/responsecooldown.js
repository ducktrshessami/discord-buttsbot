'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
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
    id: DataTypes.STRING,
    smile: DataTypes.DATE,
    frown: DataTypes.DATE,
    wink: DataTypes.DATE,
    weird: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ResponseCooldown',
  });
  return ResponseCooldown;
};
