const db = require('./db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pawntickets (
  pawn_ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  pawned_item TEXT,
  item_type TEXT,
  weight REAL,
  loan_amount REAL NOT NULL,
  purity REAL,
  adv_amount REAL,
  interest_rate REAL,
  pawned_date TEXT NOT NULL,
  settled_date TEXT,
  status TEXT,
  FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);`);
});

module.exports =db;