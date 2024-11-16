const express = require('express');
const router = express();
const notificatonController = require("../../controllers/together/notifications.controller");
const protectedRoute = require("../../middleware/protectedRoute");


router.post("/create", protectedRoute, notificatonController.createNotification);
router.get('/all', protectedRoute, notificatonController.getUserNotifications);

module.exports = router;