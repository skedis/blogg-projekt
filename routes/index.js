const express = require('express');

const router = express.Router();

// Models
let Post = require('../models/post');

// Routes
router.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        posts: posts
      });
    }
  });
});

module.exports = router;
