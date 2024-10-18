const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');

router.post("/", userController.getMe);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/update", userController.updateUser);

module.exports = router;