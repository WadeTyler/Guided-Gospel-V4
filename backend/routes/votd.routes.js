
const express = require('express');
const versesController = require('../controllers/votd.controller');
const protectedRoute = require('../middleware/protectedRoute');
const router = express.Router();

router.get('/votd', protectedRoute, versesController.getVotd);

module.exports = router;