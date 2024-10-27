const express = require('express');
const adminController = require('../controllers/admin.controller');
const protectedRoute = require('../middleware/protectedRoute');
const authenticatedAdmin = require('../middleware/authenticatedAdmin');
const router = express.Router();

router.get("/", protectedRoute, authenticatedAdmin, adminController.getAdmin);

module.exports = router;