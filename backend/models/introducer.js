const db = require('./db');

db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS introducers (
  introducer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  introducer_name TEXT NOT NULL,
  introducer_phone_number TEXT,
  introducer_aadhaar_number TEXT,
  introducer_pan_number TEXT,
  introducer_photo TEXT
);`)
})

module.exports =db;