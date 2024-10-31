
const db = require("../../db/db");

const getAllPosts = async (req, res) => {
  try {
    const query = 'SELECT together_posts.*, user.username FROM together_posts JOIN user ON together_posts.userid = user.userid ORDER BY timestamp DESC';

    const [posts] = await db.query(query);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getAllPosts controller", error);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const createPost = async (req, res) => {
  try {
    const userid = req.cookies.userid;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const query = 'INSERT INTO together_posts (userid, content) VALUES (?, ?)';
    const [result] = await db.execute(query, [userid, content]);

    const postid = result.insertId
    const selectPostQuery = 'SELECT together_posts.*, user.username FROM together_posts JOIN user ON together_posts.userid = user.userid WHERE postid = ? ORDER BY timestamp DESC';
    const [post] = await db.query(selectPostQuery, [postid]);


    res.status(201).json(post[0]);

  } catch (error) {
    console.error("Error in createPost controller", error);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const likeUnlikePost = async (req, res) => {
  try {
    const userid = req.cookies.userid;
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

    const likeQuery = 'INSERT INTO together_likes (userid, postid) VALUES (?, ?)';
    await db.execute(likeQuery, [userid, postid]);

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
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM together_likes WHERE userid = ? ORDER BY postid ASC';
    const [likes] = await db.query(query, [userid]);

    return res.status(200).json(likes);
  } catch (error) {
    console.error("Error in getUserLikes controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {
  getAllPosts,
  createPost,
  likeUnlikePost,
  getUserLikes
}