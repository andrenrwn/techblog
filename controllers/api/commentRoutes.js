const router = require('express').Router();
const sequelize = require('../../config/connection');
const { QueryTypes } = require('sequelize');
const { User, Article, Comment, ArticleKeyword, Keyword } = require('../../models');
const { withAuth, isNumeric } = require('../../utils/auth');
//const withBoard = require('../../utils/withboard');

/**
 * @name GET /api/comments/&order=ASC?attr=modified_at?articleid=<articleid>?userid=<userid>
 * @description Get comments from an article and/or userid
 * @param {STRING} ?attr = 'modified_at|created_at' --- select the column to sort by. Default: 'created_at'
 * @param {STRING} ?order = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC'
 * @param {INTEGER} ?articleid = The article id that the comments belong to. 0 means all articles.
 * @param {INTEGER} ?userid = The user id that the comments belong to. 0 means all users.
 * @returns {ARRAY} Array of all of the article's comments in JSON format | JSON error message if failed
 */
router.get('/', async (req, res) => {
  console.log('===== LIST ALL COMMENTS ====='); // debug logs

  // validate GET query parameter for ordering
  // console.log(req.params.query); // debug logs
  let order = 'DESC'; // default
  if (req.query.hasOwnProperty('order')) {
    if (req.query.order.toUpperCase() === 'ASC') {
      order = 'ASC';
    } else if (req.query.order.toUpperCase() === 'DESC') {
      order = 'DESC';
    };
  };

  // validate GET query parameter for attribute to sort
  let attr = 'created_at';
  if (req.query.hasOwnProperty('attr')) {
    attr = Object.keys(Comment.getAttributes()).find((elem) => {
      // check if the query property is one of the Comment model attribute (column) names
      return (req.query.attr.toLowerCase() === elem.toLowerCase());
    });
    if (attr == null) {
      attr = 'created_at';
    };
  };

  // Add article id and/or user id to find parameters if specified
  let articleid;
  let commentsToFind = {
    order: [[attr, order]],
    include: [{
      model: Article,
      attributes: ['id', 'title'],
    }, {
      model: User,
      attributes: ['alias']
    }]
  };

  if (req.query.hasOwnProperty('articleid') && isNumeric(req.query.articleid)) {
    articleid = parseInt(req.query.articleid);
    if (articleid > 0) {
      // if specified, look for this specific article id
      commentsToFind.where = { article_id: articleid };
    };
  };

  if (req.query.hasOwnProperty('userid') && isNumeric(req.query.userid)) {
    userid = parseInt(req.query.userid);
    if (userid > 0) {
      // if specified, look for this specific user id
      if (commentsToFind.hasOwnProperty('where')) {
        commentsToFind.where.user_id = userid;
      } else {
        commentsToFind.where = { user_id: userid };
      };
    };
  };

  try {
    const commentData = await Comment.findAll(commentsToFind);

    // convert data (serialize) from sequelize instance to plain javascript object
    const commentDataFormatted = commentData.map((elem) => {
      let plainelem = elem.get();
      // plainelem.keywords = elem.keywords.map((keywordelem) => {
      //   return keywordelem.get();
      // });
      // plainelem.user = elem.user.get();
      return plainelem;
    });

    // let commentDataFormatted = await commentData.get();
    //console.log(commentDataFormatted); // debug logs

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(commentDataFormatted, null, 2));

    //res.status(200).json(commentDataFormatted);

  } catch (err) {
    res.status(500).json(err);
  }

});


/**
 * validateCommentInput(req) validates the HTTP POST body JSON content
 * @param {OBJECT} req --- expresjs req (request) object containing the HTTP body in req.body
 * @returns {ARRAY} [ success, status, message ] --- [ if validated, status value, error message ]
 */
async function validateCommentInput(req) {
  // POST requires at least a non-null parent or existing article_id
  if (!(req.body.hasOwnProperty('parent') && isNumeric(req.body.parent) && parseInt(req.body.parent) > 0)) {
    if (!(req.body.hasOwnProperty('article_id') && isNumeric(req.body.article_id) && (parseInt(req.body.article_id) > 0))) {
      console.log("You must have a valid article id to create a comment, or specify a parent comment id when replying");
      return [false, 400, "You must have a valid article id to create a comment, or specify a parent comment id when replying"];
      // res.status(400).json({ message: "You must have a valid article id to create a comment, or specify a parent comment id when replying" });
    };
  };

  if (req.body.hasOwnProperty('article_id') && isNumeric(req.body.article_id) && parseInt(req.body.article_id) > 0) {
    const article = await Article.findOne({ where: { id: req.body.article_id } });
    if (article === null) {
      console.log('Article Not Found!'); // debug log
      // res.status(404).json({ message: "Article id not found" });
      return [false, 404, "No valid article id found"];;
    } else {
      console.log(`Found article ${article}`); // debug log
    };
  };

  if (req.body.hasOwnProperty('parent') && isNumeric(req.body.parent) && parseInt(req.body.parent) > 0) {
    const parent = await Comment.findOne({ where: { id: req.body.parent } });
    if (parent === null) {
      console.log('Parent comment not found!'); // debug log
      // res.status(404).json({ message: "Parent comment id not found" });
      return [false, { message: "Parent comment id not found" }];
    } else {
      console.log(`Found article ${parent}`); // debug log
    };
  };

  return [true, 200, "validated"];
};


/**
 * @name POST /api/comments
 * @description Create a new comment into the database by article and if this is a reply (by parent comment id). Users must be logged in to post comments.
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {INTEGER} parent A parent comment referring to another comment. Parent should override article_id
 * @param {INTEGER} user_id The user id associated with this comment.
 * @param {INTEGER} article_id The article the comment is attached to.
 * @param {STRING} content The content of the comment
 * @returns {JSON} JSON object returning the newly created comment { "id": "<newid>", "content": "<comment content>"", ... } | error in JSON indicating what went wrong from sequelize
 */
router.post('/', withAuth, async (req, res) => {
  /* req.body should look like this...
    {
      parent: 1,
      user_id: 1,
      article_id: 1,
      content: "Et aute culpa fugiat tempor duis eu ad pariatur magna sunt minim anim labore officia. Irure sit non non quis ea consectetur eiusmod ut laboris mollit cillum incididunt mollit.",
    }
  */
  console.log("=== POST - CREATE COMMENT ===");

  // console.log(req.session); // debug log

  // validate req.body input
  const [success, status, error] = await validateCommentInput(req);
  if (!success) {
    res.status(status).json({ message: error });
    return;
  };

  let comment;
  try {
    comment = await Comment.create({
      parent: req.body.parent,
      user_id: req.session.user_id,
      article_id: req.body.article_id,
      content: req.body.content,
    });
  } catch (err) {
    console.log(err); // debug logs
    res.status(400).json(err);
    return false;
  };

  res.status(200).json(comment);
});



/**
  * @name PUT /api/comments/:id
  * @description Modify a comment by id.
  * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
  * @param {INTEGER} parent A parent comment referring to another comment. Parent should override article_id
  * @param {INTEGER} user_id The user id associated with this comment.
  * @param {INTEGER} article_id The article the comment is attached to.
  * @param {STRING} content The content of the comment
  * @returns {JSON} JSON message reporting the number of records updated | error in JSON indicating what went wrong from sequelize
  */
router.put('/:id', withAuth, async (req, res) => {
  console.log("=== PUT - MODIFY COMMENT ===");

  // validate req.body input
  const [success, status, error] = await validateCommentInput(req);
  if (!success) {
    res.status(status).json({ message: error });
    return;
  };

  // check if the comment if of the same user (Users should only be able to update their own comments)
  const oldcomment = await Comment.findOne({ where: { id: req.params.id, user_id: req.session.user_id } });
  if (oldcomment === null) {
    console.log(`Cannot find comment ${req.params.id} with user ${req.session.user_id}!`); // debug log
    res.status(404).json({ message: `Cannot find comment ${req.params.id} with user ${req.session.user_id}!` });
    return;
  } else {
    // console.log(`Found comment ${req.params.id}`); // debug log
  };

  let updatedComment = {
    parent: req.body.parent,
    user_id: req.session.user_id,
    article_id: req.body.article_id,
    content: req.body.content
  };
  let rowsUpdated, updatedCommentData;
  // console.log("PUT before: ", articleId, req.session.user_id, updatedArticle);

  try {
    [updatedCommentData, rowsUpdated] = await sequelize.query(
      'UPDATE comment SET parent = ?, article_id = ?, content = ? WHERE id = ? AND user_id = ?',
      {
        replacements: [
          updatedComment.parent,
          updatedComment.article_id,
          updatedComment.content,
          req.params.id,
          req.session.user_id
        ],
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    // console.log('\nUpdated article:', updatedArticleData); // debug log

    // // Somehow the following is unreliable and waits until after (sequelize problem with promises? bug?). Replacing with the above raw query.
    // [updatedCommentData, rowsUpdated] = await Comment.update(
    //   updatedComment,
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

  if (rowsUpdated == 0) {
    console.log('Nothing updated')
    res.status(400).json({ message: 'Nothing updated' });
  } else {
    res.status(200).json({ message: 'Comment updated' });
  };

});


/**
 * @name DELETE /api/comments/:id
 * @description Delete an article based on its article id
 * @param {INTEGER} :id --- article id
 * @returns {JSON} Message describing result of how many rows are deleted | JSON error message if failed
  */
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this user and id!' });
      return;
    }

    res.status(200).json({ message: `Comment ${req.params.id} deleted. Delete operations: ${commentData}` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
