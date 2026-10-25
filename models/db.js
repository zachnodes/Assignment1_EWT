const sqlite3 = require('sqlite3').verbose();

// Opens the database file (creates it if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Creates the tables if they aren't already there,
// then calls the callback so the app knows it can start.
function initDatabase(callback) {
  // serialize makes the statements run one after another, in order
  db.serialize(function() {
    db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE,
        category TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        min_players INTEGER,
        max_players INTEGER,
        description TEXT
      )
    `, function(err) {
      if (err) {
        console.log('Error creating games table:', err);
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, function(err) {
      if (err) {
        console.log('Error creating users table:', err);
        return;
      }
      console.log('Database ready');
      callback();
    });
  });
}

// Other model files use db to run queries
module.exports = { db, initDatabase };