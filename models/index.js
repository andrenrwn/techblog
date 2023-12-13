const User = require('./User');
const Article = require('./Article');
const Comment = require('./Comment');
const Keyword = require('./Keyword');
const ArticleKeyword = require('./ArticleKeyword');
const RelatedArticle = require('./RelatedArticle');

// An article can be related many other articles.
// Example: An article can be a three-part series, a follow-up, or update to someone else's article
Article.belongsToMany(Article, {
  through: { model: RelatedArticle }
});

// An article can be tagged with many keywords, keywords can tag many articles
Article.belongsToMany(Keyword, {
  through: { model: ArticleKeyword }
});

Keyword.belongsToMany(Article, {
  through: { model: ArticleKeyword }
});

// An article can have many comments
Article.hasMany(Comment, {
  foreignKey: 'id',
  onDelete: 'CASCADE', // If an article is deleted, all its comments are as well
});

// A User can write many articles
User.hasMany(Article, {
  foreignKey: 'id',
  // onDelete: 'CASCADE', // we don't want to delete the article if a user is deleted
});

// A User can write many comments
User.hasMany(Comment, {
  foreignKey: 'id',
  // onDelete: 'CASCADE', // we don't want to delete the comment if a user is deleted
});

module.exports = { User, Article, Comment, Keyword, ArticleKeyword, RelatedArticle };
