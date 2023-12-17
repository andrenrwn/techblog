const blogConfig = require('../config/config');
const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Article, ArticleKeyword, Comment, Keyword, RelatedArticle } = require('../models');
const { withAuth } = require('../utils/auth');
//const withBoard = require('../utils/withboard');

// Create an article
// -----------------
router.get('/', withAuth, async (req, res) => {
  try {
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

    res.render('createarticle', {
      articleDataFormatted,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Display one article and its comments
// ------------------------------------
router.get('/:id', async (req, res) => {
  console.log("=== DISPLAY ARTICLE ===", req.params.id);
  try {

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
        console.log(keywordelem.get());
        return (keywordelem.get());
      });
      plainelem.user = elem.user.get();
      // console.log("===============PLAINELEM===============", plainelem);
      //console.log(elem.get());
      //console.log(JSON.stringify(elem, null, 4), "------\n");
      return plainelem;
    });

    let mainArticle = articleDataFormatted.find((elem) => {
      return (elem.id == req.params.id);
    });

    let commentData = await Comment.findAll({
      order: [['created_at', 'DESC']],
      where: { article_id: req.params.id },
      include: [{
        model: User,
        attributes: { exclude: ['password'] }
      }]
    });

    console.log("===========COMMENTS===========");
    console.log(commentData);

    let commentDataFormatted = commentData.map((elem) => {
      return elem.get();
    });

    //console.log(JSON.stringify(commentData.user, null, 4));
    //console.log(JSON.stringify(articleDataFormatted, null, 4));
    // Example:
    // [
    //   {
    //     id: 4,
    //     user_id: 4,
    //     article_id: 4,
    //     parent: null,
    //     content: 'I replied 4th!',
    //     createdAt: 2023-12-16T03:10:22.000Z,
    //     updatedAt: 2023-12-16T03:10:22.000Z
    //   }
    // ]

    res.render('showarticle', {
      mainArticle,
      articleDataFormatted,
      commentDataFormatted,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      article_author: (req.session.user_id === mainArticle.user_id),
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
