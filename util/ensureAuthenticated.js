module.exports = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'You must login to view this');
    res.redirect('/users/login');
  }
}
