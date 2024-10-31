const db = require("../../db/db");
const { getTimestampInSQLFormat } = require("../../lib/utils/sqlFormatting");

const followUnfollowUser = async (req, res) => {
  try {
    const userid = req.cookies.userid;
    const targetUsername = req.params.username;
    
    const getUserIDQuery = 'SELECT userid FROM user WHERE username = ?';
    const [user] = await db.query(getUserIDQuery, [targetUsername]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const targetUserID = user[0].userid;

    if (userid === targetUserID) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    
    const checkIfFollowingQuery = 'SELECT * FROM together_follows WHERE followerid = ? AND followingid = ?';
    const [following] = await db.query(checkIfFollowingQuery, [userid, targetUserID]);
    console.log(following);

    if (following.length === 0) {
      // Follow
      const followQuery = 'INSERT INTO together_follows (followerid, followingid, timestamp) VALUES (?, ?, ?)';
      const timestamp = getTimestampInSQLFormat();
      await db.execute(followQuery, [userid, targetUserID, timestamp]);
      return res.status(200).json({ message: "Followed" });
    }

    // Unfollow
    const unfollowQuery = 'DELETE FROM together_follows WHERE followerid = ? AND followingid = ?';
    await db.execute(unfollowQuery, [userid, targetUserID]);
    
    return res.status(200).json({ message: "User Unfollowed" });
  
  } catch (error) {
    console.error("Error in followUnfollowUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get the User's following list
const getFollowing = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM together_follows WHERE followerid = ?';
    const [following] = await db.query(query, [userid]);

    return res.status(200).json({ following });
  } catch (error) {
    console.error("Error in getFollowing controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get the User's Followers list
const getFollowers = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM together_follows WHERE followingid = ?';
    const [following] = await db.query(query, [userid]);

    return res.status(200).json({ following });
  } catch (error) {
    console.error("Error in getFollowing controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}



module.exports = {
  followUnfollowUser,
  getFollowing,
  getFollowers
}