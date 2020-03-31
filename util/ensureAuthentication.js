//  Used for checking if the user is authenticated before moving on to other tasks
module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  next();
}
