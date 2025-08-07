const db = require('../models/account').db;

exports.getAllAccounts = (req, res) => {
  const { query } = req.query;
  let sql = 'SELECT * FROM accounts';
  const params = [];

  if (query) {
    sql += ' WHERE customer_name LIKE ?';
    params.push(`%${query}%`);
  }

  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json(rows);
  });
};


// GET account by ID
exports.getAccountById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM accounts WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Account not found' });
    res.json(row);
  });
};

// POST create new account
exports.createAccount = (req, res) => {
  const { customer_name, photo, address, phone_no, aadhaar, pan,Gender } = req.body;
  db.run(
    'INSERT INTO accounts (customer_name, photo, address, phone_no, aadhaar, pan) VALUES (?, ?, ?, ?, ?, ?)',
    [customer_name, photo, address, phone_no, aadhaar, pan,Gender],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
};

// PATCH update account (partial update)
exports.updateAccount = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const fields = [];
  const values = [];
  for (const key of ["customer_name", "photo", "address", "phone_no", "aadhaar", "pan"]) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }
  values.push(id);
  const sql = `UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`;
  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, updated: this.changes });
  });
};

// DELETE account
exports.deleteAccount = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM accounts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
};

// SEARCH accounts by name or phone
exports.searchAccounts = (req, res) => {
  const { query } = req.query;
  const likeQuery = `%${query}%`;
  db.all(
    'SELECT * FROM accounts WHERE customer_name LIKE ? OR phone_no LIKE ?',
    [likeQuery, likeQuery],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json(rows);
    }
  );
};
