const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const pawnController = require('../controllers/pawnTicketController');


router.get('/', accountController.getAllAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccountById);
router.patch('/:id', accountController.updateAccount); 
router.delete('/:id', accountController.deleteAccount);


router.get('/:accountId/pawntickets', pawnController.getPawnsByAccount);

module.exports = router;