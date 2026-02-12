const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'wheelspinner.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS wheels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT NOT NULL DEFAULT 'default',
      title TEXT NOT NULL,
      config TEXT NOT NULL,
      created TEXT NOT NULL DEFAULT (datetime('now')),
      last_read TEXT,
      last_write TEXT NOT NULL DEFAULT (datetime('now')),
      read_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(uid, title)
    );

    CREATE TABLE IF NOT EXISTS shared_wheels (
      path TEXT PRIMARY KEY,
      uid TEXT DEFAULT 'default',
      config TEXT NOT NULL,
      copyable INTEGER NOT NULL DEFAULT 1,
      review_status TEXT DEFAULT 'Pending',
      created TEXT NOT NULL DEFAULT (datetime('now')),
      last_read TEXT,
      read_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_reviews INTEGER NOT NULL DEFAULT 0,
      session_reviews INTEGER NOT NULL DEFAULT 0,
      last_review TEXT
    );

    CREATE TABLE IF NOT EXISTS carousels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );
  `);
}

module.exports = { getDb };
