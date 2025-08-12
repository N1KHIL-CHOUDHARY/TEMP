
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statscontroller');


router.get('/accountcount',statsController.getAccountsCount);



module.exports = router;


