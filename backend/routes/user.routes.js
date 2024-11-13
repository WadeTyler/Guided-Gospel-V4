const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const { checkUsernameExistsParam } = require('../middleware/checkUsernameExists');
const checkSuspended = require('../middleware/checkSuspended');

router.get("/", protectedRoute, userController.getMe);
router.post("/signup", userController.signUp);
router.post("/completesignup", userController.completeSignUp);
router.post("/login", userController.login);
router.post("/logout", protectedRoute, userController.logout);
router.post("/update", protectedRoute, checkSuspended, userController.updateUser);
router.post("/forgotpassword/submit", userController.submitForgotPassword);
router.post("/resetpassword", userController.resetPassword);
router.get("/validrecoverytoken/:recoveryToken", userController.isValidRecoveryToken);
router.delete("/", protectedRoute, checkSuspended, userController.deleteUser);
router.get("/:username", protectedRoute, checkUsernameExistsParam, userController.getUserProfile);

module.exports = router;