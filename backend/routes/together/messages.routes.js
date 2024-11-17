const express = require('express');
const protectedRoute = require('../../middleware/protectedRoute');
const messagesController = require('../../controllers/together/messages.controller');
const router = express();

router.post("/sessions/create", protectedRoute, messagesController.createMessageSession);
router.get("/sessions", protectedRoute, messagesController.getUserSessions);

module.exports = router;