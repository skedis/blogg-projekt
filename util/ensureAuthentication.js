/* 
  Used in router, makes sure the user is authenticated 
  before moving on to the next middleware 
*/
module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  next();
}
