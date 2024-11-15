const express = require('express');
const adminController = require('../controllers/admin.controller');
const protectedRoute = require('../middleware/protectedRoute');
const authenticatedAdmin = require('../middleware/authenticatedAdmin');
const router = express.Router();

router.get("/", protectedRoute, authenticatedAdmin, adminController.getAdmin);
router.get("/users", protectedRoute, authenticatedAdmin, adminController.getUsers);
router.get("/users/search/:value", protectedRoute, authenticatedAdmin, adminController.searchForUser);
router.get("/users/:userid", protectedRoute, authenticatedAdmin, adminController.getUserData);
router.post("/users/:userid/suspend", protectedRoute, authenticatedAdmin, adminController.suspendAndUnsuspendUser);
router.post("/users/:userid/setDefaultRates", protectedRoute, authenticatedAdmin, adminController.setDefaultRates);
router.post("/users/:userid/resetRates", protectedRoute, authenticatedAdmin, adminController.resetRates);
router.get("/postreports", protectedRoute, authenticatedAdmin, adminController.getAllPostReports);


module.exports = router;