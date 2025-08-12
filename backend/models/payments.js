const db = require('./db');

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS payments (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  pawn_ticket_id INTEGER NOT NULL,
  payment_date TEXT NOT NULL,
  amount_paid REAL NOT NULL,
  payment_for TEXT NOT NULL, -- 'principal' or 'interest'
  FOREIGN KEY(pawn_ticket_id) REFERENCES pawntickets(pawn_ticket_id)
);`)
})

module.exports =db;