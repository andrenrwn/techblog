const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const articleRoutes = require('./articleRoutes');

// https://expressjs.com/en/api.html#req
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function (req, res, next) {
  console.log('%s === ROUTE LOG === %s %s %s', new Date().toLocaleString(), req.method, req.url, req.path);
  console.log('%s === user id: %s, logged in: %s, cookie: %s', new Date().toLocaleString(), req.session.user_id, req.session.logged_in, JSON.stringify(req.session.cookie));
  next();
});

// router.use('/', boardRoutes);
router.use('/', homeRoutes);
router.use('/articles', articleRoutes);
router.use('/api', apiRoutes);

module.exports = router;
