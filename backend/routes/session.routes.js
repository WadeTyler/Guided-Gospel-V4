const express = require('express');
const sessionController = require('../controllers/session.controllers');
const router = express.Router();

router.get('/', sessionController.getSessions);

module.exports = router;