const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const config = require('../config.json');

// Opens the database file (creates it if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Creates the tables if they aren't already there
const initDatabase = (callback) => {
  // serialize makes the statements run one after another, in order
  db.serialize(() => {
    // Create games table
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
    `, (err) => {
      if (err) {
        console.log('Error creating games table:', err);
      }
    });
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.log('Error creating users table:', err);
      }
    });
    
    // Insert username and password from config.json
    db.run(
      'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
      [config.adminUsername, bcrypt.hashSync(config.adminPassword, 10)],
      (err) => {
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