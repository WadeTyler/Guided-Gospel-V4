const express = require('express');
const feedbackController = require('../controllers/feedback.controllers');
const router = express.Router();

router.post('/', feedbackController.submitFeedback);

module.exports = router;