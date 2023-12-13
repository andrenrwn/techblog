const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Article = require('./Article');

class Comment extends Model { }

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
        unique: false,
      },
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Article,
        key: 'id',
        unique: false,
      },
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Comment,
        key: 'id',
        unique: false,
      },
    },
    content: {
      type: DataTypes.STRING(16384),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
