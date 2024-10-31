const express = require('express');
const router = express.Router();
const followsController = require('../../controllers/together/follows.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const { checkUsernameExistsParam } = require('../../middleware/checkUsernameExists');

router.post("/:username", protectedRoute, checkUsernameExistsParam, followsController.followUnfollowUser);
router.get("/following", protectedRoute, followsController.getFollowing);
router.get("/followers", protectedRoute, followsController.getFollowers);

module.exports = router;