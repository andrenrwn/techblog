const blogConfig = require('../config/config');
const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Article, ArticleKeyword, Comment, Keyword, RelatedArticle } = require('../models');
const { withAuth } = require('../utils/auth');
//const withBoard = require('../utils/withboard');

// Main page: all articles are displayed
// -------------------------------------------------
router.get('/', withAuth, async (req, res) => {
  try {
    // const userData = await User.findAll({
    //   attributes: { exclude: ['password'] },
    //   order: [['name', 'ASC']],
    // });

    const articleData = await Article.findAll({
      order: [['created_at', 'DESC']],
      include: [{
        model: Keyword,
        through: {
          attributes: []
        },
        // required: true
      },
      {
        model: User,
        attributes: { exclude: ['password'] }
      }]
    });

    // convert data from sequelize instance to plain javascript object
    const articleDataFormatted = articleData.map((elem) => {
      let plainelem = elem.get();
      plainelem.keywords = elem.keywords.map((keywordelem) => {
        return keywordelem.get();
      });
      plainelem.user = elem.user.get();
      //console.log(elem.get());
      //console.log(JSON.stringify(elem, null, 4), "------\n");
      return plainelem;
    });

    // let articleDataFormatted = await articleData.get();
    // console.log(articleDataFormatted);  // debug logs
    // console.log(Object.keys(Article.getAttributes())); // debug logs - get all keys

    res.render('article', {
      articleDataFormatted,
      logged_in: req.session.logged_in,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Render one article
// ------------------
router.get('/article/:id', async (req, res) => {
  try {

    res.render('profile', {
      ...user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
