const router = require('express').Router();
const sequelize = require('../../config/connection');
const { QueryTypes } = require('sequelize');
const { Article, Keyword, User } = require('../../models');
const withAuth = require('../../utils/auth');


/**
 * @name GET /api/keywords/&order=ASC
 * @description Get all keywords and its associated articles
 * @param {STRING} ?order = 'ASC'|'DESC' --- based on order of the string. Default: 'DESC'
 * @returns {ARRAY} Array of all keywords in JSON format | JSON error message if failed
  */
router.get('/', async (req, res) => {
  console.log('===== LIST ALL KEYWORDS ====='); // debug logs

  // validate GET query parameter for ordering
  let order = 'ASC'; // default
  if (req.query.hasOwnProperty('order')) {
    if (req.params.query.toUpperCase() === 'ASC') {
      order = 'ASC';
    } else if (req.params.query.toUpperCase() === 'DESC') {
      order = 'DESC';
    };
  };

  try {
    const keywordData = await Keyword.findAll({
      order: [['keyword', order]],
      include: [{
        model: Article,
        through: {
          attributes: []
        },
        // required: true
      }
        // ,
        // {
        //   model: User,
        //   attributes: ['id', 'alias']
        // }
      ]
    });

    // convert data (serialize) from sequelize instance to plain javascript object
    let keywordArr = keywordData.map((elem) => {
      let newelem = elem.get();
      newelem.articles = [];
      for (let i = 0; i < elem.articles.length; i++) {
        newelem.articles.push({ id: elem.articles[i].id, title: elem.articles[i].title });
      };
      return newelem;
    });

    // let articleDataFormatted = await articleData.get();
    console.log("KEYWORDARRAY:", keywordArr); // debug logs

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(keywordArr, null, 2));

    //res.status(200).json(articleDataFormatted);

  } catch (err) {
    res.status(500).json(err);
  }

});


/**
 * @name GET /api/keywords/:id
 * @description Get a keyword by id and list its associated articles
 * @returns {JSON} Array of all keywords in JSON format | JSON error message if failed
  */
router.get('/:id', async (req, res) => {
  console.log('===== LIST A KEYWORD ====='); // debug logs

  try {
    const keywordData = await Keyword.findOne({
      where: { id: req.params.id },
      include: [{
        model: Article,
        through: {
          attributes: []
        },
        // required: true
      }
        // ,
        // {
        //   model: User,
        //   attributes: ['id', 'alias']
        // }
      ]
    });

    // convert data (serialize) from sequelize instance to plain javascript object
    let newKeyword = keywordData.get();
    newKeyword.articles = [];
    for (let i = 0; i < keywordData.articles.length; i++) {
      newKeyword.articles.push({ id: keywordData.articles[i].id, title: keywordData.articles[i].title });
    };

    // let articleDataFormatted = await articleData.get();
    console.log("KEYWORD:", newKeyword); // debug logs

    res.setHeader('Content-Type', 'application/json');
    res.status(200).end(JSON.stringify(newKeyword, null, 2));

    //res.status(200).json(articleDataFormatted);

  } catch (err) {
    res.status(500).json(err);
  }

});



/**
 * @name POST /api/keywords
 * @description Find or create a new keyword
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} keyword A keyword string
 * @returns {JSON} JSON message and object returning the newly created keyword | error in JSON indicating what went wrong from sequelize
 */
router.post('/', async (req, res) => {
  /* req.body should include a keyword
    {
      "keyword": "entertainment",
    }
  */
  if (!req.body.hasOwnProperty('keyword')) {
    console.log("Error: please supply a keyword:");
    res.status(400).json({ message: "Error: please supply a keyword:" });
    return;
  }

  console.log("=== ADDING A KEYWORD ===", req.body.keyword);

  let keyword, created;
  try {
    [keyword, created] = await Keyword.findOrCreate({
      where: { keyword: req.body.keyword.toLowerCase() },
      defaults: {
        keyword: req.body.keyword.toLowerCase()
      }
    });
  } catch (err) {
    console.log("ERROR: ", err);
    res.status(404).json(err);
    return;
  };

  console.log("CREATED: ", keyword.get(), created);

  if (!created) {
    res.status(200).json({ message: "Keyword not created", keyword: keyword.get() });
  } else {
    // console.log("KEYWORDS:", keyword); // debug logs
    res.status(200).json({ message: "Keyword created", keyword: keyword.get() });
  };
});


/**
 * @name PUT /api/keywords/:oldkeyword
 * @description Change the :oldkeyword to a new keyword that's defined in the POST body
 * @param {JSON} req.body JSON object with the following key/value pair:
 * @param {STRING} keyword A keyword string
 * @returns {JSON} JSON message whether a record is updated or not | error in JSON indicating what went wrong from sequelize
 */router.put('/:oldkeyword', withAuth, async (req, res) => {

  console.log("=== PUT - change a keyword ===");

  // input validation check
  if (!req.body.hasOwnProperty('keyword')) {
    console.log("Error: please supply a keyword:");
    res.status(400).json({ message: "Error: please supply a keyword:" });
    return;
  }

  const updatedKeyword = {
    keyword: req.body.keyword.toLowerCase()
  };

  try {
    console.log('updating keyword from', req.params.oldkeyword, 'to', updatedKeyword);

    // unsure what's wrong with the below operation, replacing with direct SQL
    // const [rowsUpdated, [updatedKeywordData]] = await Keyword.update(
    //   updatedKeyword,
    //   {
    //     where: {
    //       keyword: req.params.oldkeyword.toLowerCase(),
    //     },
    //     returning: true,
    //   }
    // );

    [updatedKeywordData, rowsUpdated] = await sequelize.query(
      'UPDATE keyword SET keyword = ? WHERE keyword = ?',
      {
        replacements: [
          req.body.keyword.toLowerCase(),
          req.params.oldkeyword.toLowerCase()
        ],
        type: QueryTypes.UPDATE,
      }
    );

    console.log("ROWSUPDATED:", rowsUpdated, updatedKeywordData);
    if (rowsUpdated === 0) {
      res.status(200).json({ message: `Keyword ${req.params.oldkeyword.toLowerCase()} not updated` });
    } else {
      res.status(200).json({ message: `Keyword ${req.params.oldkeyword.toLowerCase()} updated to ${req.body.keyword.toLowerCase()}` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

/**
 * @name DELETE /api/keywords/:oldkeyword
 * @description Delete :oldkeyword from the database [TBD: Should only be available to the admin user]
 * @param {STRING} :oldkeyword --- an HTML URL encoded string
 * @returns {JSON} Message on how many records were deleted
  */
router.delete('/:oldkeyword', withAuth, async (req, res) => {
  try {
    const keywordData = await Keyword.destroy({
      where: {
        keyword: req.params.oldkeyword.toLowerCase()
      },
    });

    if (!keywordData) {
      res.status(404).json({ message: 'No keyword deleted' });
      return;
    }

    res.status(200).json({ message: `Keyword ${req.params.oldkeyword.toLowerCase()} deleted. Delete operations: ${keywordData}` });
  } catch (err) {
    console.log(err); // debug logs
    res.status(500).json(err);
  }
});


module.exports = router;
