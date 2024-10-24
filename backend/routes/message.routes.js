const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const rates = require('../middleware/rates');

router.get('/:sessionid', protectedRoute, messageController.getMessages);
router.post('/add', protectedRoute, rates.checkRates, messageController.addMessage, rates.reduceRate);

module.exports = router;