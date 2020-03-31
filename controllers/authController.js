const bcrypt = require('bcryptjs');
const passport = require('passport');
const { validationResult } = require('express-validator')

// Models
let User = require('../models/user');


// Get registration page
exports.getRegister = (req, res) => {
  res.render('register')
}

// Get user login page
exports.getLogin = (req, res) => {
  res.render('login');
}

// Logout user
exports.getLogout = (req, res) => {
  req.logout();
  res.redirect('/');
}

// Login user
exports.postLogin = (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res);
}

// Register user
exports.postRegister = (req, res) => {
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

    // Salting & hashing password
    bcrypt.genSalt((err, salt) => {
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
            res.redirect('/auth/login');
          }
        });
      });
    });
  }
}
