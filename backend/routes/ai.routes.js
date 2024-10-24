const express = require('express');
const aiController = require('../controllers/ai.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const rates = require('../middleware/rates');
const router = express.Router();

// Routes
router.post('/completion', protectedRoute, rates.checkRates, aiController.getChatCompletion);
router.post('/summary', protectedRoute, aiController.getAndSetSummary);

module.exports = router;