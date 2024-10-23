const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const protectedRoute = require('../lib/utils/protectedRoute');

router.get("/", protectedRoute, userController.getMe);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", protectedRoute, userController.logout);
router.post("/update", protectedRoute, userController.updateUser);
router.delete("/", protectedRoute, userController.deleteUser);

module.exports = router;