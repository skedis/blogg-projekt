const express = require('express');
const { check } = require('express-validator')
const isAuth = require('../util/ensureAuthentication');

const blogController = require('../controllers/blogController');

const router = express.Router();

// GET Routes
router.get('/', blogController.getIndex);
router.get('/add', isAuth, blogController.getAddPost);
router.get('/edit/:id', isAuth, blogController.getEditPost);
router.get('/:id', blogController.getSinglePost);

// POST Routes
router.post('/add', [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('content').not().isEmpty().withMessage('Content is required')
], isAuth, blogController.postAddPost);

router.post('/edit/:id', isAuth, blogController.postEditPost);

// DELETE Routes
router.delete('/:id', isAuth, blogController.deleteSinglePost);

module.exports = router;
