const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator')

const router = express.Router();

// Models
let User = require('../models/user');

// Routes ----------------------------------------------

// Register user GET
router.get('/users/register', (req, res) => {
  res.render('register')
});

// Register user POST
router.post('/users/register', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  check('password').not().isEmpty().withMessage('Password is required'),
  check('password_confirm', 'Passwords must match').custom((value, { req, loc, path }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    } else { 
      return value; 
    }
  })

], (req, res) => {
  // Get validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('register', { errors: errors.errors });
  } else {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let newUser = new User({
      username: username,
      email: email,
      password: password
    });

    // Salting password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }

        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Succesfully registered');
            res.redirect('/users/login');
          }
        })
      });
    });
  }
});

// Login GET
router.get('/users/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/users/login', (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res);
});

// Logout GET
router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

module.exports = router;
