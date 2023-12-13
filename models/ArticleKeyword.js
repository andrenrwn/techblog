const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Article = require('./Article');
const Keyword = require('./Keyword');

class ArticleKeyword extends Model { }

ArticleKeyword.init(
  {
    article_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Article,
        key: 'id',
        unique: false,
      },
    },
    keyword_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Keyword,
        key: 'id',
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'articlekeyword',
  }
);

module.exports = ArticleKeyword;
