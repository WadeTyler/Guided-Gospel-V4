const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');

router.get('/:sessionid', protectedRoute, messageController.getMessages);
router.post('/add', protectedRoute, messageController.addMessage);

module.exports = router;