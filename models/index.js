const User = require('./User');
const Article = require('./Article');
const Comment = require('./Comment');
const Keyword = require('./Keyword');
const ArticleKeyword = require('./ArticleKeyword');
const RelatedArticle = require('./RelatedArticle');

// An article can be related many other articles.
// Example: An article can be a three-part series, a follow-up, or update to someone else's article
Article.belongsToMany(Article, {
  as: 'article1',
  foreignKey: 'user_id',
  through: { model: RelatedArticle }
});

Article.belongsToMany(Article, {
  as: 'article2',
  foreignKey: 'user_id',
  through: { model: RelatedArticle }
});

// An article can be tagged with many keywords, keywords can tag many articles
Article.belongsToMany(Keyword, {
  through: { model: ArticleKeyword }
});

Keyword.belongsToMany(Article, {
  through: { model: ArticleKeyword }
});

// A User can write many articles
User.hasMany(Article, {
  foreignKey: 'user_id',
  // onDelete: 'CASCADE', // we don't want to delete the article if a user is deleted
});

Article.belongsTo(User, {
  foreignKey: 'user_id',
});

// A User can write many comments
User.hasMany(Comment, {
  foreignKey: 'user_id',
  // onDelete: 'CASCADE', // we don't want to delete the comment if a user is deleted
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

module.exports = { User, Article, Comment, Keyword, ArticleKeyword, RelatedArticle };
