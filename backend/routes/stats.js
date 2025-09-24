const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statscontroller');

// Get total accounts count
router.get('/accountcount', statsController.getAccountsCount);

// Get accounts by date range (expects ?start=YYYY-MM-DD&end=YYYY-MM-DD)
router.get('/accountsbydate', statsController.getAccountsByDate);

// Get pawn tickets by date range (expects ?start=YYYY-MM-DD&end=YYYY-MM-DD)
router.get('/pawnticketsbydate', statsController.getPawnTicketsByDate);

module.exports = router;


