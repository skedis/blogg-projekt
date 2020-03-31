const { validationResult } = require('express-validator')

// Models
let Post = require('../models/post');
let User = require('../models/user');

// Gets the index page
exports.getIndex = (req, res) => {
    Post.find({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
  
        res.render('index', {
          posts: result
        });
      }
    });
}

// Gets the post creation page
exports.getAddPost = (req, res) => {
  res.render('add_post');
}

// Adds new post to database
exports.postAddPost = (req, res) => {
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
}

// Gets the post edit page
exports.getEditPost = (req, res) => {
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
}

// Change data on given post
exports.postEditPost = (req, res) => {
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
}

// Gets a single specific post
exports.getSinglePost = (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    User.findById(post.author, (err, user) => {
      res.render('post', {
        post: post,
        username: user.username
      });
    });
  });
}

// Deletes a single specific post
exports.deleteSinglePost =  (req, res) => {
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
}
