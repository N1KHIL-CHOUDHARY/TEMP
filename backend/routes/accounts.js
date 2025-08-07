const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController'); 


// GET all accounts
router.get('/', accountController.getAllAccounts);

// GET one account by ID
router.get('/:id', accountController.getAccountById);

// POST create new account
router.post('/', accountController.createAccount);

// PUT update account
router.put('/:id', accountController.updateAccount);

// DELETE account
router.delete('/:id', accountController.deleteAccount);

// GET search accounts by query


module.exports = router;
