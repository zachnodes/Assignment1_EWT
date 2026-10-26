// Put this in front of any route that only logged in staff should reach.
// If nobody is logged in, send them to the login page instead.
function requireLogin(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = requireLogin;