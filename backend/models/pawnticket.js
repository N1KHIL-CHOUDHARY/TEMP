const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
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

module.exports = {
  db,
  createPawnTicket: (data, callback) => {
    const { account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled } = data;
    db.run(
      `INSERT INTO pawntickets (account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },
  // Add more CRUD functions as needed
};
