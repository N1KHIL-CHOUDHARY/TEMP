const db = require('../models/pawntickets'); 

// GET all pawns
exports.getAllPawns = (req, res) => {
  db.all('SELECT * FROM pawntickets ORDER BY pawn_ticket_id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json(rows);
  });
};

// GET pawn by ID
exports.getPawnById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM pawntickets WHERE pawn_ticket_id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Pawn ticket not found' });
    res.json(row);
  });
};

// CREATE pawn ticket
exports.createPawn = (req, res) => {
  const {
    account_id,
    pawned_item,
    item_type,
    weight,
    loan_amount,
    purity,
    adv_amount,
    interest_rate,
    pawned_date,
    status

  } = req.body;

  console.log(req.body);

  if (!account_id || !loan_amount || !pawned_date) {
    return res.status(400).json({ success: false, message: 'account_id, loan_amount, and pawned_date are required' });
  }

  db.run(
    `INSERT INTO pawntickets (
      account_id, pawned_item, item_type, weight, loan_amount, purity, adv_amount,
      interest_rate, pawned_date,status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      account_id,
      pawned_item || null,
      item_type || null,
      weight || null,
      loan_amount,
      purity || null,
      adv_amount || null,
      interest_rate || null,
      pawned_date,
      status || null
    ],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
};

// UPDATE pawn ticket (full update like PUT)
exports.updatePawn = (req, res) => {
  const { id } = req.params;
  const {
    pawned_item,
    item_type,
    weight,
    loan_amount,
    purity,
    adv_amount,
    interest_rate,
    pawned_date,
    status,
    settled_date
  } = req.body;

  db.run(
    `UPDATE pawntickets SET 
      pawned_item = ?, 
      item_type = ?, 
      weight = ?, 
      loan_amount = ?, 
      purity = ?, 
      adv_amount = ?, 
      interest_rate = ?, 
      pawned_date = ?, 
      status = ?, 
      settled_date = ? 
     WHERE pawn_ticket_id = ?`,
    [
      pawned_item || null,
      item_type || null,
      weight || null,
      loan_amount || null,
      purity || null,
      adv_amount || null,
      interest_rate || null,
      pawned_date || null,
      status || null,
      settled_date || null,
      id
    ],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, updated: this.changes });
    }
  );
};

// DELETE pawn ticket
exports.deletePawn = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pawntickets WHERE pawn_ticket_id = ?', [id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
};

// PATCH status + settled_date
exports.updatePawnStatusAndSettled = (req, res) => {
  const { id } = req.params;
  const { status, settled_date } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  db.run(
    `UPDATE pawntickets SET status = ?, settled_date = ? WHERE pawn_ticket_id = ?`,
    [status, settled_date || null, id],
    function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, updated: this.changes });
    }
  );
};

// GET by status
exports.getPawnsByStatus = (req, res) => {
  const { status } = req.params;
  db.all(
    'SELECT * FROM pawntickets WHERE status = ? ORDER BY pawn_ticket_id DESC',
    [status],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json(rows);
    }
  );
};

// GET pawns by account_id
exports.getPawnsByAccount = (req, res) => {
  const { accountId } = req.params;
  db.all(
    'SELECT * FROM pawntickets WHERE account_id = ? ORDER BY pawn_ticket_id DESC',
    [accountId],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json(rows);
    }
  );
};
