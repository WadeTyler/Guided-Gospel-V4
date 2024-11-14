const express = require('express');
const postsController = require('../../controllers/together/posts.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const checkSuspended = require('../../middleware/checkSuspended');
const { checkIfPostExists } = require('../../lib/utils/postsUtil');
const { checkUsernameExistsParam } = require('../../middleware/checkUsernameExists');
const router = express.Router();

router.get("/all/:type", protectedRoute, postsController.getAllPosts);
router.post("/", protectedRoute, checkSuspended, postsController.createPost);
router.delete("/delete", protectedRoute, checkSuspended, postsController.deletePost);
router.get("/likes", protectedRoute, postsController.getUserLikes);
router.post("/:postid/like", protectedRoute, checkSuspended, checkIfPostExists, postsController.likeUnlikePost);
router.post("/:postid/addComment", protectedRoute, checkSuspended, checkIfPostExists, postsController.addComment);
router.get("/:postid/comments", protectedRoute, checkIfPostExists, postsController.getComments);
router.get("/users/:username", protectedRoute, checkUsernameExistsParam, postsController.getUserPosts);
router.get("/users/comments/:username", protectedRoute, checkUsernameExistsParam, postsController.getUserComments);
router.get("/users/likes/:username", protectedRoute, checkUsernameExistsParam, postsController.getLikedPosts);

module.exports = router;