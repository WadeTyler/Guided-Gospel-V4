const db = require("../../db/db");
const { getTimestampInSQLFormat } = require("../../lib/utils/sqlFormatting");

const followUnfollowUser = async (req, res) => {
  try {
    const userid = req.body.userid;
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

      await db.execute('UPDATE user SET following = following + 1 WHERE userid = ?', [userid]);
      await db.execute('UPDATE user SET followers = followers + 1 WHERE userid = ?', [targetUserID]);

      return res.status(200).json({ message: "Followed" });
    }

    // Unfollow
    const unfollowQuery = 'DELETE FROM together_follows WHERE followerid = ? AND followingid = ?';
    await db.execute(unfollowQuery, [userid, targetUserID]);

    await db.execute('UPDATE user SET following = following - 1 WHERE userid = ?', [userid]);
    await db.execute('UPDATE user SET followers = followers - 1 WHERE userid = ?', [targetUserID]);
    
    return res.status(200).json({ message: "User Unfollowed" });
  
  } catch (error) {
    console.error("Error in followUnfollowUser controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get the User's following list
const getFollowing = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = 'SELECT followingid FROM together_follows WHERE followerid = ?';
    const [following] = await db.query(query, [userid]);

    return res.status(200).json(following);
  } catch (error) {
    console.error("Error in getFollowing controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get the User's Followers list
const getFollowers = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = 'SELECT followerid FROM together_follows WHERE followingid = ?';
    const [followers] = await db.query(query, [userid]);

    return res.status(200).json(followers);
  } catch (error) {
    console.error("Error in getFollowing controller", error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get suggested users
const getSuggestedUsers = async (req, res) => {
  try {
    const userid = req.body.userid;

    // Obtain the user's suggested users by getting the followingUsers of the people that the user is following
    // User -> Following -> *Following* (Target People)

    // Who the user is following
    const [usersFollowing] = await db.query("SELECT * FROM together_follows WHERE followerid = ? ORDER BY rand() LIMIT 5", [userid]);
    
    // Suggested Users: Array of userid 
    const suggestedUsersUserids = [];
    
    if (usersFollowing.length === 0) {
      // Not following anyone, return users with most followers
      const [topUsers] = await db.query("SELECT userid FROM user ORDER BY followers DESC LIMIT 5");


      // Add to suggestedUsers
      topUsers.forEach((user) => {
        suggestedUsersUserids.push(user.userid);
      });
    } else {
      // Retreive following of following
      for (let i = 0; i < usersFollowing.length; i++) {
        const [target] = await db.query("SELECT followingid FROM together_follows WHERE followerid = ? ORDER BY rand() LIMIT 1", [usersFollowing[i].followingid]);

        if (target.length === 0) {
          // FollowingUser is not following anyone, retreive a topuser instead
          const [topUsers] = await db.query("SELECT userid FROM user ORDER BY followers DESC LIMIT 5");

          
          const index = 0;
          while (suggestedUsersUserids.includes(topUsers[index].userid) && index < 4) {
            index++;
          }

          // Check if isSelf
          if (topUsers[index].userid === userid) continue;

          // Check if already following
          const [alreadyFollowing] = await db.query("SELECT * FROM together_follows WHERE followerid = ? AND followingid = ?", [userid, topUsers[index].userid]);

          if (alreadyFollowing.length > 0) continue;

          // Add to suggested users
          else suggestedUsersUserids.push(topUsers[index].userid);

        } else {
          
          // Check if self
          if (target[0].followingid === userid) continue;

          // Check if already following
          const [alreadyFollowing] = await db.query("SELECT * FROM together_follows WHERE followerid = ? AND followingid = ?", [userid, target[0].userid]);

          if (alreadyFollowing.length > 0) continue;

          // Add target to suggested users
          else suggestedUsersUserids.push(target[0].followingid);
        }
      }
    }

    // If there is less than 5 suggested users add random users. Only perform this up to 5 times.
    let iterations = 0;

    while (suggestedUsersUserids.length < 5 && iterations < 5) {
      iterations++;

      const [randomUser] = await db.query("SELECT userid FROM user ORDER BY rand() LIMIT 1");

      if (randomUser[0].userid === userid) continue;

      // Check if already following
      const [alreadyFollowing] = await db.query("SELECT * FROM together_follows WHERE followerid = ? AND followingid = ?", [userid, randomUser[0].userid]);

      if (alreadyFollowing.length > 0) continue;

      if (!suggestedUsersUserids.includes(randomUser[0].userid)) {
        suggestedUsersUserids.push(randomUser[0].userid);
      }
    }
     
    // Retreive usernames, avatars, and bio
    const suggestedUsers = [];
    for (let i = 0; i < suggestedUsersUserids.length; i++) {
      const [user] = await db.query("SELECT username, avatar, bio FROM user WHERE userid = ?", suggestedUsersUserids[i]);

      suggestedUsers.push(user[0]);
    }


    return res.status(200).json(suggestedUsers);

  } catch (error) {
    console.log("Error in getSuggestedUsers controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  followUnfollowUser,
  getFollowing,
  getFollowers,
  getSuggestedUsers
}