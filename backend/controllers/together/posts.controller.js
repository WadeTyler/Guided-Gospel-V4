
const db = require("../../db/db");
const generateToken = require("../../lib/jwt/generateToken");
const { getTimestampInSQLFormat } = require("../../lib/utils/sqlFormatting");

const getAllPosts = async (req, res) => {
  try {
    
    const userid = req.body.userid;
    const type = req.params.type;

    // Get Following Posts
    if (type === 'following') {
      const followingQuery = 'SELECT together_posts.*, user.username FROM together_posts JOIN user on together_posts.userid = user.userid WHERE together_posts.userid IN (SELECT followingid FROM together_follows WHERE followerid = ?) ORDER BY timestamp DESC';
      const [posts] = await db.query(followingQuery, [userid]);
      return res.status(200).json(posts);
    }

    // Get All Posts
    const query = 'SELECT together_posts.*, user.username FROM together_posts JOIN user ON together_posts.userid = user.userid ORDER BY timestamp DESC';
    const [posts] = await db.query(query);
    res.status(200).json(posts);


  } catch (error) {
    console.error("Error in getAllPosts controller", error);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;

    const query = 'SELECT together_posts.*, user.username FROM together_posts JOIN user ON together_posts.userid = user.userid WHERE user.username = ? ORDER BY timestamp DESC';

    const [posts] = await db.query(query, [username]);

    return res.status(200).json(posts);

  } catch (error) {
    console.error("Error in getUsersPosts controller", error);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const createPost = async (req, res) => {
  try {
    const userid = req.body.userid;

    // Check spam cookie
    if (req.cookies.spamPost) {
      return res.status(429).json({ message: `You are posting too frequently. Please wait before sending another post.` });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const timestamp = getTimestampInSQLFormat();

    const query = 'INSERT INTO together_posts (userid, content, timestamp) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [userid, content, timestamp]);

    const postid = result.insertId
    const selectPostQuery = 'SELECT together_posts.*, user.username FROM together_posts JOIN user ON together_posts.userid = user.userid WHERE postid = ? ORDER BY timestamp DESC';
    const [post] = await db.query(selectPostQuery, [postid]);

    // Add Spam Cookie
    res.cookie('spamPost', timestamp, { 
      httpOnly: true, 
      maxAge: 60 * 1000 * 3,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.status(201).json(post[0]);

  } catch (error) {
    console.error("Error in createPost controller", error);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const deletePost = async (req, res) => {
  try {
    const postid = req.body.postid;
    const userid = req.body.userid;

    if (!postid) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if post exists
    const [posts] = await db.query("SELECT * FROM together_posts WHERE postid = ?", [postid]);

    if (posts.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the owner of the post
    if (userid !== posts[0].userid) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    // Delete Post
    const deletePostQuery = 'DELETE FROM together_posts WHERE postid = ?';
    await db.execute(deletePostQuery, [postid]);

    return res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    console.log("Error in deletePost controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const userid = req.body.userid;
    const { postid } = req.params;
    
    if (!postid) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const postQuery = 'SELECT * FROM together_posts WHERE postid = ?';
    const [posts] = await db.query(postQuery, [postid]);
    if (posts.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const selectLikeQuery = 'SELECT * FROM together_likes WHERE userid = ? AND postid = ?';
    const [likes] = await db.query(selectLikeQuery, [userid, postid]);

    if (likes.length > 0) {
      // Delete Like
      const deleteLikeQuery = 'DELETE FROM together_likes WHERE userid = ? AND postid = ?';
      await db.execute(deleteLikeQuery, [userid, postid]);

      const removeLikeQuery = 'UPDATE together_posts SET likes = likes - 1 WHERE postid = ?';
      await db.execute(removeLikeQuery, [postid]);

      return res.status(200).json({ message: "Post Unliked" });
    }

    // Add Like

    const timestamp = getTimestampInSQLFormat();

    const likeQuery = 'INSERT INTO together_likes (userid, postid, timestamp) VALUES (?, ?, ?)';
    await db.execute(likeQuery, [userid, postid, timestamp]);

    const addLikeQuery = 'UPDATE together_posts SET likes = likes + 1 WHERE postid = ?';
    await db.execute(addLikeQuery, [postid]);

    return res.status(200).json({ message: "Post Liked" });
  } catch (error) {
    console.error("Error in likePost controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all the likes of the user
const getUserLikes = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = 'SELECT * FROM together_likes WHERE userid = ? ORDER BY postid ASC';
    const [likes] = await db.query(query, [userid]);

    return res.status(200).json(likes);
  } catch (error) {
    console.error("Error in getUserLikes controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const userid = req.body.userid;

    // Check spam token
    if (req.cookies.spamComment) {
      return res.status(429).json({ message: `You are commenting too frequently. Please wait before sending another comment.` });
    }

    const postid = req.params.postid;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const timestamp = getTimestampInSQLFormat();

    const commentQuery = 'INSERT INTO together_comments (postid, userid, content, timestamp) VALUES (?, ?, ?, ?)';
    await db.execute(commentQuery, [postid, userid, content, timestamp]);

    // Update post counter
    const updatePostQuery = 'UPDATE together_posts SET comments = comments + 1 WHERE postid = ?';
    await db.execute(updatePostQuery, [postid]);

    // Add Spam Cookie
    res.cookie('spamComment', timestamp, {
      httpOnly: true,
      maxAge: 60 * 1000 * 3, // 3 minutes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error in addComment controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

const getComments = async (req, res) => {
  try {
    const postid = req.params.postid;

    const query = 'SELECT together_comments.*, user.username FROM together_comments JOIN user ON together_comments.userid = user.userid WHERE postid = ? ORDER BY timestamp DESC';

    const [comments] = await db.query(query, [postid]);

    return res.status(200).json(comments);
  } catch (error) {
    console.log("Error in getComments controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  likeUnlikePost,
  getUserLikes,
  addComment,
  getComments,
  getUserPosts
}