const express = require('express');
const sessionController = require('../controllers/session.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');
const router = express.Router();

router.get('/', protectedRoute, sessionController.getSessions);

module.exports = router;