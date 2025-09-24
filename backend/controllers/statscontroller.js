const dbaccount = require('../models/accounts');
const dbpawnticket = require('../models/pawntickets');

exports.getAccountsCount = (req, res) => {
    dbaccount.get('SELECT COUNT(customer_name) AS total_accounts FROM accounts', (err, row) => {
        if (err) {
            res.status(500).json({'success': false, 'error': err.message});
            return;
        }

        res.status(200).json({'success': true, 'data': row});
    });
};

exports.getAccountsByDate = (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }

    const query = `
        SELECT * FROM accounts
        WHERE date(created_at) BETWEEN ? AND ?;
    `;

    const countQuery = `
        SELECT COUNT(*) AS total FROM accounts
        WHERE date(created_at) BETWEEN ? AND ?;
    `;

    dbaccount.all(query, [start, end], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        dbaccount.get(countQuery, [start, end], (err, countRow) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            res.json({ success: true, data: rows, total: countRow.total });
        });
    });
};

exports.getPawnTicketsByDate = (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }

    const query = `
        SELECT * FROM pawntickets
        WHERE date(pawned_date) BETWEEN ? AND ?;
    `;

    const countQuery = `
        SELECT COUNT(*) AS total FROM pawntickets
        WHERE date(pawned_date) BETWEEN ? AND ?;
    `;

    dbpawnticket.all(query, [start, end], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        dbpawnticket.get(countQuery, [start, end], (err, countRow) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            res.json({ success: true, data: rows, total: countRow.total });
        });
    });
};
