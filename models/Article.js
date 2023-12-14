const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./User');

class Article extends Model { }

Article.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Article,
        key: 'id',
        unique: false,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
        unique: false,
      },
    },
    version: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'article',
  }
);

module.exports = Article;
