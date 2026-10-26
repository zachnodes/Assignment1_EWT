const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const config = require('../config.json');

// Opens the database file (creates it if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Creates the tables if they aren't already there, adds a default
// manager account, then calls the callback so the app can start.
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
      }
    });

    // Default manager login comes from config.json (kept out of git)
    // OR IGNORE skips this if the admin user already exists.
    db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      [config.adminUsername, bcrypt.hashSync(config.adminPassword, 10)],
      function(err) {
        if (err) {
          console.log('Error creating default user:', err);
          return;
        }
        console.log('Database ready');
        callback();
      }
    );
  });
}

// Other model files use db to run queries
module.exports = { db, initDatabase };