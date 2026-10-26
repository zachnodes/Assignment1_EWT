const { db } = require('./db');

function getAllGames(callback) {
  db.all('SELECT * FROM games ORDER BY title', function(err, rows) {
    callback(err, rows);
  });
}

function getGameById(id, callback) {
  db.get('SELECT * FROM games WHERE id = ?', [id], function(err, row) {
    callback(err, row);
  });
}

function addGame(game, callback) {
  db.run(
    `INSERT INTO games (title, category, price, stock, min_players, max_players, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [game.title, game.category, game.price, game.stock, game.min_players, game.max_players, game.description],
    function(err) {
      callback(err);
    }
  );
}

function updateGame(id, game, callback) {
  db.run(
    `UPDATE games
     SET title = ?, category = ?, price = ?, stock = ?, min_players = ?, max_players = ?, description = ?
     WHERE id = ?`,
    [game.title, game.category, game.price, game.stock, game.min_players, game.max_players, game.description, id],
    function(err) {
      callback(err);
    }
  );
}

function deleteGame(id, callback) {
  db.run('DELETE FROM games WHERE id = ?', [id], function(err) {
    callback(err);
  });
}

module.exports = { getAllGames, getGameById, addGame, updateGame, deleteGame };