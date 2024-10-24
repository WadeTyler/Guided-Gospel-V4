const express = require('express');
const feedbackController = require('../controllers/feedback.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const router = express.Router();

router.post('/', feedbackController.submitFeedback);
router.post('/bugreport', protectedRoute, feedbackController.submitBugReport);

module.exports = router;