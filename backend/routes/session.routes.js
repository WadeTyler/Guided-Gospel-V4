const express = require('express');
const sessionController = require('../controllers/session.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');
const rates = require('../lib/utils/rates');
const router = express.Router();

router.get('/', protectedRoute, sessionController.getSessions);
router.post('/create', protectedRoute, rates.checkRates, sessionController.createSession);
router.delete('/:sessionid', protectedRoute, sessionController.deleteSession);
router.delete('/', protectedRoute, sessionController.deleteAllSessions);

module.exports = router;