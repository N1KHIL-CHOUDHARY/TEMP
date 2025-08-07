const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    photo TEXT,
    address TEXT,
    phone_no TEXT,
    aadhaar TEXT,
    pan TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pawntickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER,
    pawn_item_type TEXT,
    loan_amount REAL,
    adv REAL,
    interest REAL,
    pawned_date TEXT,
    status TEXT,
    settled INTEGER,
    FOREIGN KEY(account_id) REFERENCES accounts(id)
  )`);

 

 
});

db.close();
