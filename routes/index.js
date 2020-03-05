const express = require("express");

const router = express.Router();

// Models
let Post = require("../models/post");

// Routes
router.get("/", (req, res) => {
  // Problem >>>>>>>>
  Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user"
      }
    }
  ]).exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        posts: result
      });
    }
  });

  /*   Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        posts: posts
      });
    }
  }); */
});

module.exports = router;
