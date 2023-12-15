const router = require('express').Router();

const userRoutes = require('./userRoutes');
const articleRoutes = require('./articleRoutes');
const keywordRoutes = require('./keywordRoutes');
// const locationRoutes = require('./locationRoutes');
// const projectRoutes = require('./projectRoutes');

router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/keywords', keywordRoutes);
// router.use('/locations', locationRoutes);
// router.use('/projects', projectRoutes);

module.exports = router;
