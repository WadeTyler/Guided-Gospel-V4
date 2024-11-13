const express = require('express');
const aiController = require('../controllers/ai.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const rates = require('../middleware/rates');
const router = express.Router();
const checkSuspended = require('../middleware/checkSuspended');

// Routes
router.post('/completion', protectedRoute, checkSuspended, rates.checkRates, aiController.getChatCompletion);
router.post('/summary', protectedRoute, aiController.getAndSetSummary);

module.exports = router;