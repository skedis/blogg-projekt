const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.use(new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      // Getting user from database
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, req.flash('danger', 'Invalid username/password'));
        }

        // Comparing password to database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, req.flash('danger', 'Invalid username/password'));
          }
        });
      });
    }
  ));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
