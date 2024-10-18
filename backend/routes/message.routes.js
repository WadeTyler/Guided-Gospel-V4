const express = require('express');
const router = express.Router();
import messageController from '../controllers/message.controllers';
const protectedRoute = require('../lib/utils/protectedRoute');

router.get('/:sessionid', protectedRoute, messageController.getMessages);


module.exports = router;