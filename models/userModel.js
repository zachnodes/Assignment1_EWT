const { db } = require('./db');

const getUserByUsername = (username, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    callback(err, row);
  });
}

module.exports = { getUserByUsername };