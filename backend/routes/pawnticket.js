

const express = require('express');
const router = express.Router();
const pawnController = require('../controllers/pawnTicketController');


router.get('/', pawnController.getAllPawns);


router.post('/', pawnController.createPawn);


router.get('/:id', pawnController.getPawnById);
router.put('/:id', pawnController.updatePawn);
router.delete('/:id', pawnController.deletePawn);


router.patch('/:id/status', pawnController.updatePawnStatusAndSettled);

module.exports = router;