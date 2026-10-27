const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const showLogin = (req, res) => {
  res.render('login', {});
}

const handleLogin = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  userModel.getUserByUsername(username, (err, user) => {
    if (err) {
      res.render('login', { error: 'Something went wrong, try again.' });
      return;
    }

    if (!user) {
      res.render('login', { error: 'Wrong username or password.' });
      return;
    }

    // Compare the typed password to the hashed one in the database
    bcrypt.compare(password, user.password, (err, matches) => {
      if (err || !matches) {
        res.render('login', { error: 'Wrong username or password.' });
        return;
      }

      // Remember who is logged in for future requests
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/manager');
    });
  });
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { showLogin, handleLogin, logout };