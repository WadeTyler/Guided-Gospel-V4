const express = require('express');
const feedbackController = require('../controllers/feedback.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const authenticatedAdmin = require('../middleware/authenticatedAdmin');
const router = express.Router();

router.get('/all', protectedRoute, authenticatedAdmin, feedbackController.getFeedbacks);
router.post('/', feedbackController.submitFeedback);
router.get("/bugreports", protectedRoute, authenticatedAdmin, feedbackController.getAllBugReports);
router.post('/bugreport', protectedRoute, feedbackController.submitBugReport);

module.exports = router;