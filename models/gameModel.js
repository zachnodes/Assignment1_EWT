const { db } = require('./db');

function getAllGames(callback) {
  db.all('SELECT * FROM games ORDER BY title', function(err, rows) {
    callback(err, rows);
  });
}

module.exports = { getAllGames };