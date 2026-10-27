const { db } = require('./db');

const getAllGames = (callback) => {
  db.all('SELECT * FROM games ORDER BY title', (err, rows) => {
    callback(err, rows);
  });
}

const getGameById = (id, callback) => {
  db.get('SELECT * FROM games WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
}

const addGame = (game, callback) => {
  db.run(
    `INSERT INTO games (title, category, price, stock, min_players, max_players, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [game.title, game.category, game.price, game.stock, game.min_players, game.max_players, game.description],
    (err) => {
      callback(err);
    }
  );
}

const updateGame = (id, game, callback) => {
  db.run(
    `UPDATE games
     SET title = ?, category = ?, price = ?, stock = ?, min_players = ?, max_players = ?, description = ?
     WHERE id = ?`,
    [game.title, game.category, game.price, game.stock, game.min_players, game.max_players, game.description, id],
    (err) => {
      callback(err);
    }
  );
}

const deleteGame = (id, callback) => {
  db.run('DELETE FROM games WHERE id = ?', [id], (err) => {
    callback(err);
  });
}

// Used by the bot. COLLATE NOCASE means "catan" matches "Catan".
const getGameByTitle = (title, callback) => {
  db.get('SELECT * FROM games WHERE title = ? COLLATE NOCASE', [title], (err, row) => {
    callback(err, row);
  });
}

// Used by the bot. Finds games where count fits between min and max players.
const getGamesByPlayerCount = (count, callback) => {
  db.all(
    'SELECT * FROM games WHERE min_players <= ? AND max_players >= ? ORDER BY title',
    [count, count],
    (err, rows) => {
      callback(err, rows);
    }
  );
}

module.exports = {
  getAllGames,
  getGameById,
  addGame,
  updateGame,
  deleteGame,
  getGameByTitle,
  getGamesByPlayerCount
};