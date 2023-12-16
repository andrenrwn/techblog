const router = require('express').Router();

const userRoutes = require('./userRoutes');
const articleRoutes = require('./articleRoutes');
const keywordRoutes = require('./keywordRoutes');
const commentRoutes = require('./commentRoutes');
// const projectRoutes = require('./projectRoutes');

router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/keywords', keywordRoutes);
router.use('/comments', commentRoutes);
// router.use('/projects', projectRoutes);

module.exports = router;
