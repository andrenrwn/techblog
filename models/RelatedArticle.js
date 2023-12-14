const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Article = require('./Article');

class RelatedArticle extends Model { }

RelatedArticle.init(
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
    related_article: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Article,
        key: 'id',
        unique: false,
      },
    },
    relation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'relatedarticle',
  }
);

module.exports = RelatedArticle;
