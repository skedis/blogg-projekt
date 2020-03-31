const express = require('express');

const blogController = require('../controllers/blogController');

const router = express.Router();

// GET Routes
router.get('/', blogController.getIndex);

module.exports = router;
