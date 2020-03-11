const express = require('express');
const { check, validationResult } = require('express-validator')
const isAuth = require('../util/ensureAuthenticated');

const router = express.Router();

// Models
let Post = require('../models/post');
let User = require('../models/user');

// Routes ----------------------------------------------

// Add post GET
router.get('/posts/add', isAuth, (req, res) => {
  res.render('add_post');
});

// Add post POST
router.post('/posts/add', [
  check('title').not().isEmpty().withMessage('Title is required'),
  check('content').not().isEmpty().withMessage('Content is required')
], isAuth, (req, res) => {
  // Get validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('add_post', { errors: errors.errors })
  } else {
    let newPost = new Post();
    newPost.title = req.body.title;
    newPost.content = req.body.content;
    newPost.author = req.user._id;

    newPost.save((err) => {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Post Added');
        res.redirect('/');
      }
    });
  }
});

// Edit Form GET
router.get('/posts/edit/:id', isAuth, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    }

    if (post.author != req.user._id) {
      req.flash('danger', 'You are not authorized to edit this')
      res.redirect('/')
    } else {
      res.render('edit_post', {
        post: post
      });
    }
  });
});

// Edit Form POST
router.post('/posts/edit/:id', isAuth, (req, res) => {
  let post = {}
  post.title = req.body.title;
  post.content = req.body.content;
  post.modifiedAt = Date.now();

  let query = { _id: req.params.id }

  Post.updateOne(query, post, (err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Post Updated');
      res.redirect('/');
    }
  });
});

// Single post GET
router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    User.findById(post.author, (err, user) => {
      res.render('post', {
        post: post,
        username: user.username
      });
    });
  });
});

// Single post DELETE
router.delete('/posts/:id', isAuth, (req, res) => {
  if (!req.user._id) {
    res.status(500).send();
  } else {
    let query = { _id: req.params.id }

    Post.findById(req.params.id, (err, post) => {
      if (post.author != req.user._id) {
        res.status(500).send();
      } else {
        Post.remove(query, (err) => {
          if (err) {
            console.log(err);
          }
          res.send('Success');
        });
      }
    });
  }
});

module.exports = router;
