const express = require('express');
const aiController = require('../controllers/ai.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');
const router = express.Router();

// Routes
router.post('/completion', protectedRoute, aiController.getChatCompletion);

module.exports = router;