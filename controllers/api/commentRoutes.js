const router = require('express').Router();
const sequelize = require('../../config/connection');
const { QueryTypes } = require('sequelize');
const { User, Article, Comment, ArticleKeyword, Keyword } = require('../../models');
const withAuth = require('../../utils/auth');
//const withBoard = require('../../utils/withboard');

/**
 * @name GET /api/comments/&order=ASC?attr=modified_at
 * @description Get all comments, including their keywords and users
 * @param {STRING} ?attr = 'modified_at|created_at' --- select the column to sort by. Default: 'created_at'
 * @param {STRING} ?order = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC'
 * @returns {ARRAY} Array of all comments in JSON format | JSON error message if failed
  */
router.get('/', async (req, res) => {
  // console.log('===== LIST ALL COMMENTS ====='); // debug logs

  // validate GET query parameter for ordering
  let order = 'DESC'; // default
  if (req.query.hasOwnProperty('order')) {
    if (req.params.query.toUpperCase() === 'ASC') {
      order = 'ASC';
    } else if (req.params.query.toUpperCase() === 'DESC') {
      order = 'DESC';
    };
  };

  // validate GET query parameter for attribute to sort
  let attr = 'created_at';
  if (req.query.hasOwnProperty('attr')) {
    attr = Object.keys(Comment.getAttributes()).find((elem) => {
      // check if the query property is one of the Article model attribute (column) names
      return (req.query.attr.toLowerCase() === elem.toLowerCase());
    });
    if (attr == null) {
      attr = 'created_at';
    };
  };

  try {
    const articleData = await Comment.findAll({
      order: [[attr, order]],
      include: [{
        model: Keyword,
        through: {
          attributes: []
        },
        // required: true
      },
      {
        model: User,
        attributes: ['id', 'alias']
      }]
    });

    // convert data (serialize) from sequelize instance to plain javascript object
    const articleDataFormatted = articleData.map((elem) => {
      let plainelem = elem.get();
      plainelem.keywords = elem.keywords.map((keywordelem) => {
        return keywordelem.get();
      });
      plainelem.user = elem.user.get();
      return plainelem;
    });

    // let articleDataFormatted = await articleData.get();
    console.log(articleDataFormatted); // debug logs

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(articleDataFormatted, null, 2));

    //res.status(200).json(articleDataFormatted);

  } catch (err) {
    res.status(500).json(err);
  }

});

/**
 * @name GET /api/comments/:id
 * @description Get an article based on its article id
 * @param {INTEGER} :id --- article id
 * @returns {JSON} Article in JSON format | JSON error message if failed
  */
router.get('/:id', async (req, res) => {
  // console.log('===== FIND ONE ARTICLE BY ID ====='); // debug logs

  try {
    const articleData = await Comment.findOne({
      where: { id: req.params.id },
      include: [{
        model: Keyword,
        through: {
          attributes: []
        },
      },
      {
        model: User,
        attributes: ['id', 'alias']
      }]
    });

    // console.log(articleData); debug logs
    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(articleData, null, 2));

  } catch (err) {
    res.status(500).json(err);
  }

});


/**
 * @name POST /api/comments
 * @description Create a new article into the database by the user's id, including its associated Keywords. Depends on the Article model.
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {INTEGER} parent A parent referring to another article_id. Parents can be used to denote followups, newer versions, or updates to an article.
 * @param {FLOAT} version A version number to attach to the article
 * @param {STRING} title The title of the article
 * @param {STRING} content The content of the article
 * @param {STRING} status A string indicating the article's status
 * @param {ARRAY} keywords An array of INTEGER strings IDs. ie. "keywords": ['5g','tech']
 * @returns {{JSON,ARRAY}} JSON object returning the newly created article {{ "id": "<newid>", "product_name": <new category name>", ... }, ARRAY } and ARRAY JSON tag objects that was created | error in JSON indicating what went wrong from sequelize
 */
router.post('/', withAuth, async (req, res) => {
  /* req.body should look like this...
    {
      parent: 1,
      version: 1.1,
      title: "A fleeting post",
      content: "Et aute culpa fugiat tempor duis eu ad pariatur magna sunt minim anim labore officia. Irure sit non non quis ea consectetur eiusmod ut laboris mollit cillum incididunt mollit.",
      status: "active",
      keywords: ['tech', 'iot', '5g']
    }
  */
  console.log(req.session);
  let article;
  try {
    article = await Comment.create({
      parent: req.body.parent,
      version: req.body.version,
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      user_id: req.session.user_id
    });
  } catch (err) {
    console.log(err); // debug logs
    res.status(400).json(err);
    return false;
  };

  // if there are any added keywords, we need to create pairings to bulk create in the Keywords model
  let keywords = [];
  // check if tagIds exist first to prevent a crash
  if (req.body.hasOwnProperty('keywords') && req.body.keywords.length) {
    for (let i = 0; i < req.body.keywords.length; i++) {
      let e = req.body.keywords[i].toLowerCase();
      let keyword, created;
      try {
        [keyword, created] = await Keyword.findOrCreate({
          where: { keyword: e },
          defaults: {
            keyword: e
          }
        });
      } catch (err) {
        console.log(err);
        res.status(404).json(err);
      };
      keywords.push(keyword.get());
    };

    // destroy article >-< keyword relationship
    await ArticleKeyword.destroy({
      where: {
        article_id: article.id
      }
    });

    // Associate keywords with article
    await ArticleKeyword.bulkCreate(
      keywords.map((elem) => {
        return { article_id: article.id, keyword_id: elem.id };
      })
    );

  };

  // console.log("KEYWORDS:", keywords); // debug logs

  res.status(200).json({ article, keywords });
});


/**
 * @name PUT /api/comments/:id
 * @description Modify an article by id.
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {INTEGER} parent A parent referring to another article_id. Parents can be used to denote followups, newer versions, or updates to an article.
 * @param {FLOAT} version A version number to attach to the article
 * @param {STRING} title The title of the article
 * @param {STRING} content The content of the article
 * @param {STRING} status A string indicating the article's status
 * @param {ARRAY} keywords An array of INTEGER strings IDs. ie. "keywords": ['5g','tech']
 * @returns {JSON} JSON message reporting the number of records updated | error in JSON indicating what went wrong from sequelize
 */
router.put('/:id', withAuth, async (req, res) => {
  let articleId = req.params.id;
  let updatedArticle = {
    parent: req.body.parent,
    version: req.body.version,
    title: req.body.title,
    content: req.body.content
  };
  let rowsUpdated, updatedArticleData;
  // console.log("PUT before: ", articleId, req.session.user_id, updatedArticle);

  try {

    [updatedArticleData, rowsUpdated] = await sequelize.query(
      'UPDATE article SET parent = ?, version = ?, title = ?, content = ? WHERE id=? AND user_id=?',
      {
        replacements: [
          updatedComment.parent,
          updatedComment.version,
          updatedComment.title,
          updatedComment.content,
          req.params.id,
          req.session.user_id
        ],
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    // console.log('\nUpdated article:', updatedArticleData); // debug log

    // // Somehow the following is unreliable and waits until after (sequelize problem with promises? bug?). Replacing with the above raw query.
    // [updatedArticleData, rowsUpdated] = await Comment.update(
    //   updatedArticle,
    //   {
    //     where: {
    //       id: articleId,
    //       user_id: req.session.user_id
    //     },
    //     returning: true
    //   }
    // );

  } catch (err) {
    console.log(err); // debug logs
    res.status(500).json({ message: `${err}` });
  };

  // if there are any added keywords, we need to create pairings to bulk create in the Keywords model
  let keywords = [];
  // check if tagIds exist first to prevent a crash
  if (req.body.hasOwnProperty('keywords') && req.body.keywords.length) {
    for (let i = 0; i < req.body.keywords.length; i++) {
      let e = req.body.keywords[i].toLowerCase();
      let keyword, created;
      try {
        [keyword, created] = await Keyword.findOrCreate({
          where: { keyword: e },
          defaults: {
            keyword: e
          }
        });
      } catch (err) {
        console.log(err);
        res.status(404).json(err);
      };
      keywords.push(keyword.get());
    };

    // destroy article >-< keyword relationship
    await ArticleKeyword.destroy({
      where: {
        article_id: article.id
      }
    });

    // Associate keywords with article
    await ArticleKeyword.bulkCreate(
      keywords.map((elem) => {
        return { article_id: article.id, keyword_id: elem.id };
      })
    );

  };

  if (rowsUpdated == 0) {
    console.log('Nothing updated')
    res.status(400).json({ message: 'Nothing updated' });
  } else {
    res.status(200).json({ message: 'Article updated' });
  };

});


/**
 * @name DELETE /api/comments/:id
 * @description Delete an article based on its article id
 * @param {INTEGER} :id --- article id
 * @returns {JSON} Article in JSON format | JSON error message if failed
  */
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const articleData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if (!articleData) {
      res.status(404).json({ message: 'No article found with this user and id!' });
      return;
    }

    res.status(200).json({ message: `Article ${req.params.id} deleted. Delete operations: ${articleData}` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
