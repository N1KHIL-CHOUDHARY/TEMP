const db = require('./db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      account_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_photo TEXT,
      gender TEXT,
      address TEXT,
      phone_number TEXT,
      aadhaar_number TEXT,
      pan_number TEXT,
      created_at TEXT,
      introducer_id INTEGER,
      FOREIGN KEY(introducer_id) REFERENCES introducers(introducer_id)
    )
  `);
});

module.exports =db;