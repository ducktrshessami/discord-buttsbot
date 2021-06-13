'use strict';
const {
  Model
} = require('sequelize');
const defaultConfig = require("../config/butt.json").default;
module.exports = (sequelize, DataTypes) => {
  class Guild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Guild.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    word: {
      type: DataTypes.STRING,
      defaultValue: defaultConfig.word
    },
    frequency: {
      type: DataTypes.INTEGER,
      defaultValue: defaultConfig.freqency
    },
    rate: {
      type: DataTypes.INTEGER,
      defaultValue: defaultConfig.rate
    }
  }, {
    sequelize,
    modelName: 'Guild',
  });
  return Guild;
};
