'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IgnoreUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  IgnoreUser.init({
    id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'IgnoreUser',
  });
  return IgnoreUser;
};
