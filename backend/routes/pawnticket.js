const express = require('express');
const router = express.Router();
const pawnController = require('../controllers/pawnTicketController');

// GET all pawns
router.get('/', pawnController.getAllPawns);

// GET a pawn by ID
router.get('/:id', pawnController.getPawnById);


router.post('/create', pawnController.createPawn);

// PUT update pawn details
router.put('/:id', pawnController.updatePawn);

// DELETE a pawn (optional: soft delete or actual delete)
router.delete('/:id', pawnController.deletePawn);


router.patch('/:id/status', pawnController.updatePawnStatusAndSettled);

// GET filter by status (active, closed)
router.get('/status/:status', pawnController.getPawnsByStatus);

router.get('/account/:accountId', pawnController.getPawnsByAccount);

module.exports = router;
