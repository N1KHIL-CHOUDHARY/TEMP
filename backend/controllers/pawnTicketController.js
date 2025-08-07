const db = require('../models/pawnticket').db;

// GET all pawns
exports.getAllPawns = (req, res) => {
  db.all('SELECT * FROM pawntickets ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
};

// GET a pawn by ID
exports.getPawnById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM pawntickets WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Pawn ticket not found' });
    res.json(row);
  });
};

// POST create new pawn ticket
exports.createPawn = (req, res) => {
  const { account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled } = req.body;
  db.run(
    `INSERT INTO pawntickets (account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [account_id, pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled || 0],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
};

// PUT update pawn details
exports.updatePawn = (req, res) => {
  const { id } = req.params;
  const { pawn_item_type, loan_amount, adv, interest, pawned_date, status, settled } = req.body;
  db.run(
    `UPDATE pawntickets SET pawn_item_type = ?, loan_amount = ?, adv = ?, interest = ?, pawned_date = ?, WHERE id = ?`,
    [pawn_item_type, loan_amount, adv, interest, pawned_date, id],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, updated: this.changes });
    }
  );
};

// DELETE a pawn
exports.deletePawn = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pawntickets WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
};

// PATCH update status and settled_date of a pawn ticket
exports.updatePawnStatusAndSettled = (req, res) => {
  const { id } = req.params;
  const { status, settled_date } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }
  const sql = `UPDATE pawntickets SET status = ?, settled_date = ? WHERE id = ?`;
  db.run(sql, [status, settled_date || null, id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, updated: this.changes });
  });
};

// GET filter by status
exports.getPawnsByStatus = (req, res) => {
  const { status } = req.params;
  db.all('SELECT * FROM pawntickets WHERE status = ? ORDER BY id DESC', [status], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
};

// GET pawns by accountId
exports.getPawnsByAccount = (req, res) => {
  const { accountId } = req.params;
  db.all('SELECT * FROM pawntickets WHERE account_id = ? ORDER BY id DESC', [accountId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
};

