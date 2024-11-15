const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const protectedRoute = require('../middleware/protectedRoute');
const { checkUsernameExistsParam } = require('../middleware/checkUsernameExists');
const checkSuspended = require('../middleware/checkSuspended');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Section
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// Routes
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
router.post("/changeavatar", upload.single('avatar'), protectedRoute, userController.changeAvatar);
router.post("/changebanner", upload.single('banner'), protectedRoute, userController.changeBanner);
router.post("/updatetogetherprofile", protectedRoute, userController.updateTogetherProfile);

module.exports = router;