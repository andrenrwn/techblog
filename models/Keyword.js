const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Keyword extends Model { }

Keyword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'keyword',
  }
);

module.exports = Keyword;
