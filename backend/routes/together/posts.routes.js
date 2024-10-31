const express = require('express');
const postsController = require('../../controllers/together/posts.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const { checkIfPostExists } = require('../../lib/utils/postsUtil');
const router = express.Router();

router.get("/", protectedRoute, postsController.getAllPosts);
router.post("/", protectedRoute, postsController.createPost);
router.get("/likes", protectedRoute, postsController.getUserLikes);
router.post("/:postid/like", protectedRoute, checkIfPostExists, postsController.likeUnlikePost);

module.exports = router;