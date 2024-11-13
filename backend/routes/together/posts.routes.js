const express = require('express');
const postsController = require('../../controllers/together/posts.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const { checkIfPostExists } = require('../../lib/utils/postsUtil');
const { checkUsernameExistsParam } = require('../../middleware/checkUsernameExists');
const router = express.Router();

router.get("/all/:type", protectedRoute, postsController.getAllPosts);
router.post("/", protectedRoute, postsController.createPost);
router.delete("/delete", protectedRoute, postsController.deletePost);
router.get("/likes", protectedRoute, postsController.getUserLikes);
router.post("/:postid/like", protectedRoute, checkIfPostExists, postsController.likeUnlikePost);
router.post("/:postid/addComment", protectedRoute, checkIfPostExists, postsController.addComment);
router.get("/:postid/comments", protectedRoute, checkIfPostExists, postsController.getComments);
router.get("/users/:username", protectedRoute, checkUsernameExistsParam, postsController.getUserPosts);

module.exports = router;