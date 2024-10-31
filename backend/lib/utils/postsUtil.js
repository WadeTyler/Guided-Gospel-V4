const db = require("../../db/db");

const checkIfPostExists = async (req, res, next) => {
  try {
    const postid = req.params.postid;

    if (!postid) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const postQuery = 'SELECT * FROM together_posts WHERE postid = ?';
    const [posts] = await db.query(postQuery, [postid]);

    if (posts.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    next();

  } catch (error) {
    console.error("Error in checkIfPostExists middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  checkIfPostExists
}