const express = require('express');
const sessionController = require('../controllers/session.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');
const router = express.Router();

router.get('/', protectedRoute, sessionController.getSessions);
router.post('/create', protectedRoute, sessionController.createSession);
router.delete('/:sessionid', protectedRoute, sessionController.deleteSession);
router.delete('/all', protectedRoute, sessionController.deleteAllSessions);

module.exports = router;