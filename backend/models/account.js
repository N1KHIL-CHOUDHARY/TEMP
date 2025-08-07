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
});

module.exports = {
  db,

  // 1. Create new account
  createAccount: (data, callback) => {
    const { customer_name, photo, address, phone_no, aadhaar, pan } = data;
    db.run(
      `INSERT INTO accounts (customer_name, photo, address, phone_no, aadhaar, pan) VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_name, photo, address, phone_no, aadhaar, pan],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  // 2. Get all accounts
  // 2. Get all accounts with optional pagination
  getAllAccounts: (options, callback) => {
    // options: { page, pageSize }
    let query = `SELECT * FROM accounts ORDER BY id DESC`;
    let params = [];
    if (options && options.page && options.pageSize) {
      const offset = (options.page - 1) * options.pageSize;
      query += ` LIMIT ? OFFSET ?`;
      params.push(options.pageSize, offset);
    }
    db.all(query, params, (err, rows) => {
      callback(err, rows);
    });
  },

  // 3. Get account by ID
  getAccountById: (id, callback) => {
    db.get(`SELECT * FROM accounts WHERE id = ?`, [id], (err, row) => {
      callback(err, row);
    });
  },

  // 4. Partial update account (PATCH)
  updateAccount: (id, data, callback) => {
    const fields = [];
    const values = [];
    for (const key of ["customer_name", "photo", "address", "phone_no", "aadhaar", "pan"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) {
      return callback(null, 0); 
    }
    values.push(id);
    const sql = `UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`;
    db.run(sql, values, function (err) {
      callback(err, this.changes);
    });
  },

  // 5. Delete account
  deleteAccount: (id, callback) => {
    db.run(`DELETE FROM accounts WHERE id = ?`, [id], function (err) {
      callback(err, this.changes);
    });
  },

  // 6. Search accounts by name or phone
  searchAccounts: (query, callback) => {
    const likeQuery = `%${query}%`;
    db.all(
      `SELECT * FROM accounts WHERE customer_name LIKE ? OR phone_no LIKE ?`,
      [likeQuery, likeQuery],
      (err, rows) => {
        callback(err, rows);
      }
    );
  }
};
