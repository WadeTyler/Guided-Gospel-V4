const express = require('express');
const protectedRoute = require('../../middleware/protectedRoute');
const messagesController = require('../../controllers/together/messages.controller');
const router = express();

router.post("/sessions/create", protectedRoute, messagesController.createMessageSession);
router.get("/sessions", protectedRoute, messagesController.getUserSessions);
router.get("/all/:sessionid", protectedRoute, messagesController.getSessionMessages);
router.put("/all/:sessionid/read", protectedRoute, messagesController.markMessagesRead);

module.exports = router;
