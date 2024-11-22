const express = require('express');
const router = express.Router();
const followsController = require('../../controllers/together/follows.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const { checkUsernameExistsParam } = require('../../middleware/checkUsernameExists');
const checkSuspended = require('../../middleware/checkSuspended');

router.post("/:username", protectedRoute, checkSuspended, checkUsernameExistsParam, followsController.followUnfollowUser);
router.get("/following", protectedRoute, followsController.getFollowing);
router.get("/followers", protectedRoute, followsController.getFollowers);
router.get("/suggestedusers", protectedRoute, followsController.getSuggestedUsers);
router.get("/followers/:userid", protectedRoute, followsController.getTargetsFollowersList);
router.get("/following/:userid", protectedRoute, followsController.getTargetsFollowingList);

module.exports = router;