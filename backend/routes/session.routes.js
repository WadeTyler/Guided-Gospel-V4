const express = require('express');
const sessionController = require('../controllers/session.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const rates = require('../middleware/rates');
const router = express.Router();
const checkSuspended = require('../middleware/checkSuspended');

router.get('/', protectedRoute, sessionController.getSessions);
router.post('/create', protectedRoute, checkSuspended, rates.checkRates, sessionController.createSession);
router.delete('/:sessionid', protectedRoute, checkSuspended, sessionController.deleteSession);
router.delete('/', protectedRoute, checkSuspended, sessionController.deleteAllSessions);

module.exports = router;