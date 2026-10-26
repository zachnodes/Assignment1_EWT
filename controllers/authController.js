const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

function showLogin(req, res) {
  res.render('login', {});
}

function handleLogin(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  userModel.getUserByUsername(username, function(err, user) {
    if (err) {
      res.render('login', { error: 'Something went wrong, try again.' });
      return;
    }

    if (!user) {
      res.render('login', { error: 'Wrong username or password.' });
      return;
    }

    // Compare the typed password to the hashed one in the database
    bcrypt.compare(password, user.password, function(err, matches) {
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

function logout(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
}

module.exports = { showLogin, handleLogin, logout };