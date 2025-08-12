const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const accountRoutes = require('./accounts');
const pawnTicketRoutes = require('./pawnticket');
const statsRoutes = require('./stats');

router.use('/auth', authRoutes);

router.use('/accounts', accountRoutes);

router.use('/pawntickets', pawnTicketRoutes);

router.use('/stats',statsRoutes);

module.exports = router;