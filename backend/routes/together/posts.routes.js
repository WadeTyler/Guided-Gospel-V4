const express = require('express');
const postsController = require('../../controllers/together/posts.controller');
const protectedRoute = require('../../middleware/protectedRoute');
const router = express.Router();

router.get("/", protectedRoute, postsController.getAllPosts);
router.post("/", protectedRoute, postsController.createPost);
router.post("/:postid/like", protectedRoute, postsController.likeUnlikePost);
router.get("/likes", protectedRoute, postsController.getUserLikes);

module.exports = router;