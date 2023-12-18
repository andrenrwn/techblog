const blogConfig = require('../config/config');
const sequelize = require('../config/connection');
const router = require('express').Router();
const { User, Article, ArticleKeyword, Comment, Keyword, RelatedArticle } = require('../models');
const { withAuth } = require('../utils/auth');
//const withBoard = require('../utils/withboard');

// Create an article
// -----------------
router.get('/create', withAuth, async (req, res) => {
  try {

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });
    console.log(user);

    const articleData = await Article.findAll({
      order: [['updated_at', 'DESC']],
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
      user,
      articleDataFormatted,
      user_id: req.session.user_id,
      username: req.session.username,
      useralias: req.session.useralias,
      logged_in: req.session.logged_in,
    });

  } catch (err) {
    res.status(500).json({ message: `error on GET /create : ${err}` });
  }
});


let displayArticles = async function (req, res) {
  console.log("=== DISPLAY ARTICLE ==="); // debug log

  try {
    const articleData = await Article.findAll({
      order: [['updated_at', 'DESC']],
      include: [{
        model: Keyword,
        through: {
          attributes: []
        },
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
        // console.log(keywordelem.get()); // debug logs
        return (keywordelem.get());
      });
      plainelem.user = elem.user.get();
      // console.log("===============PLAINELEM===============", plainelem); // debug logs [TBD: keywords]
      return plainelem;
    });

    let mainArticle;
    if (req.params.hasOwnProperty('id') && req.params.id > 0) {
      mainArticle = articleDataFormatted.find((elem) => {
        return (elem.id == req.params.id);
      });
    } else if (articleDataFormatted.length > 0) {
      mainArticle = articleDataFormatted[0];
    };

    let commentData = await Comment.findAll({
      order: [['updated_at', 'DESC']],
      where: { article_id: mainArticle.id },
      include: [{
        model: User,
        attributes: { exclude: ['password'] }
      }]
    });

    console.log("===========COMMENTS===========", commentData.length);
    // console.log(commentData);

    let commentDataFormatted = commentData.map((elem) => {
      return elem.get({ plain: true });
    });

    // console.log(JSON.stringify(articleDataFormatted, null, 4));
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
      username: req.session.username,
      useralias: req.session.useralias
    });

  } catch (err) {
    res.status(500).json({ message: `error on GET /:id : ${err}` });
  };
}

// Display the latest article and its comments
router.get('/', displayArticles);

// Display one article and its comments
// ------------------------------------
router.get('/:id', displayArticles);


module.exports = router;
