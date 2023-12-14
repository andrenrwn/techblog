const sequelize = require('../config/connection');

// Import sequelize models
const {
  Article,
  ArticleKeyword,
  Comment,
  Keyword,
  RelatedArticle,
  User,
} = require('../models');

// Seed data
const userData = require('./userData.json');
const articleData = require('./articleData.json');
const articleKeywordData = require('./articleKeywordData.json');
const commentData = require('./commentData.json');
const keywordData = require('./keywordData.json');
const relatedArticleData = require('./relatedArticleData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // const users = await User.bulkCreate(userData, {
  //   individualHooks: true,
  //   returning: true,
  // });
  for (const user of userData) {
    await User.create({
      ...user,
    });
  };

  for (const article of articleData) {
    await Article.create({
      ...article,
    });
  };

  for (const relation of relatedArticleData) {
    await RelatedArticle.create({
      ...relation,
    });
  };

  for (const keyword of keywordData) {
    await Keyword.create({
      ...keyword,
    });
  };

  for (const akdata of articleKeywordData) {
    await ArticleKeyword.create({
      ...akdata,
    });
  };

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
    });
  };

  // add seed data for the relationship between boards and users, not using parameterized queries (may be subject to SQL injection attacks)
  // const { QueryTypes } = require('sequelize');

  // for (let i of users_boardsData) {
  //   console.log(i.user_id, '\n', i.board_board_id);
  //   await sequelize.query(
  //     'INSERT INTO `userstoboards` (`user_id`,`board_board_id`) VALUES (?,?)',
  //     {
  //       replacements: [i.user_id, i.board_board_id],
  //       type: QueryTypes.INSERT,
  //     }
  //   );
  // }

  console.log;

  process.exit(0);
};

seedDatabase();
