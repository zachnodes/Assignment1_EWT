const { db } = require('./db');

function getUserByUsername(username, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], function(err, row) {
    callback(err, row);
  });
}

module.exports = { getUserByUsername };