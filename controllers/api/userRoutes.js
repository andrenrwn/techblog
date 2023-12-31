const router = require('express').Router();
const { User } = require('../../models');
const { withAuth } = require('../../utils/auth');

/**
 * @name POST /api/users/
 * @description Creates a new user from the sign-up form
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} name Username
 * @param {STRING} alias User's alias, attached to posts and comments.
 * @param {STRING} email User's email
 * @param {STRING} password User's password
 * @returns {JSON} The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize
 */
router.post('/', async (req, res) => {
  // console.log("==================== Creating ", JSON.stringify(req.body)); // debug logs
  try {
    let newUser = req.body;
    newUser.isadmin = false;
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.name;
      req.session.useralias = userData.alias;
      req.session.logged_in = true;
      res.status(200).json(
        { id: userData.id, name: userData.name, alias: userData.alias, email: userData.email, isadmin: userData.isadmin, created_at: userData.created_at });
    });

  } catch (err) {
    console.log("error creating", err); // debug logs
    res.status(400).json({ message: `Error in post /: ${err}` });
  }
});


/**
 * @name PUT /api/users/
 * @description Modifies user information. Logged in users can only modify their own data.
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} name Username
 * @param {STRING} alias User's alias, attached to posts and comments.
 * @param {STRING} email User's email
 * @param {STRING} password User's password
 * @returns {JSON} The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize
 */
router.put('/', withAuth, async (req, res) => {
  // console.log("==================== Creating ", JSON.stringify(req.body)); // debug logs
  try {
    let newUser = {};
    if (req.body.hasOwnProperty('name')) { newUser['name'] = req.body.name }
    if (req.body.hasOwnProperty('alias')) { newUser['alias'] = req.body.alias }
    if (req.body.hasOwnProperty('email')) { newUser['email'] = req.body.email }
    if (req.body.hasOwnProperty('password')) { newUser['password'] = req.body.password }

    // reject requests with different "id" parameters
    if (newUser.hasOwnProperty('id') && (newUser.id !== req.session.user_id)) {
      console.log("User id different from login id");
      res.status(400).json({ message: "User id different from login id" });
      return;
    };

    const userData = await User.update(req.body, {
      where: { id: req.session.user_id },
      individualHooks: true
    });

    console.log("========= Updated user: ", JSON.stringify(userData));

    req.session.destroy(() => {
      res.status(200).json({ message: "User updated, session logged out" });
      res.end();
    });

  } catch (err) {
    console.log("error creating", err); // debug logs
    res.status(400).json({ message: `Error in post /: ${err}` });
  }
});


/**
 * @name POST /api/users/login
 * @description Logs in a user using their email and passwords. Successful login populates the expressjs session
 * @param {JSON} req.body JSON object literals in the POST HTTP body containing the following key/value pairs:
 * @param {STRING} email User's email
 * @param {STRING} password User's password
 * @returns {JSON} The user's information is returned in a JSON object | error in JSON indicating what went wrong from sequelize
 */
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    };

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.name;
      req.session.useralias = userData.alias;
      req.session.logged_in = true;
      res.status(200).json({
        id: userData.id,
        name: userData.name,
        alias: userData.alias,
        email: userData.email,
        isadmin: userData.isadmin,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        message: 'You are now logged in!'
      });
    });

    console.log("User Logged in:", {
      id: userData.id,
      name: userData.name,
      alias: userData.alias,
      email: userData.email,
      isadmin: userData.isadmin,
      message: 'You are now logged in!'
    });
    // console.log("SESSION", req.session.user_id); // debug logs

  } catch (err) {
    res.status(400).json({ message: `Error in POST login: ${err}` });
  }
});

/**
 * @name POST /api/users/logout
 * @description Logs out a currently logged in user session
 */
// Logout route path via POST
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

/**
 * @name GET /api/users/logout
 * @description Logs out a currently logged in user session and redirects them to the home page.
 *              Can be linked directly as an a href
 */
router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect(302, '/');
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
