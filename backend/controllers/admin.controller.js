
const db = require("../db/db");
const { evaluateFlagscore } = require("../lib/violations/checkViolations");

// Returns the Admin's administrator information
const getAdmin = async (req, res) => {
  try {
    const userid = req.body.userid;

    if (!userid) {
      return res.status(404).json({ error: "Not Signed in" });
    }

    const [admins] = await db.query("SELECT * FROM Administrators WHERE userid = ?", [userid]);

    if (admins.length === 0 || !admins[0].userid) {
      return res.status(401).json({ error: "Not an Admin" });
    }

    return res.status(200).json(admins[0]);


  } catch (error) {
    console.log("Error in getAdmin controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Return all users in the database
const getUsers = async (req, res) => {
  try {
    const query = 'SELECT username, userid, firstname, lastname, email, age, denomination, rates, defaultrates, createdat, lastactive, suspended, flagscore FROM user ORDER BY lastname ASC';
    const [users] = await db.query(query);

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Return user by firstname, lastname, or email
const searchForUser = async (req, res) => {
  try {

    const value = req.params.value;

    const query = 'SELECT userid, firstname, lastname, email, age, denomination, rates, createdat FROM user WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? ORDER BY lastname ASC';
    const values = [`%${value}%`, `%${value}%`, `%${value}%`];

    const [users] = await db.query(query, values);

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchForUser controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get all user data
const getUserData = async (req, res) => {
  try {
    
    const userid = req.params.userid;
    if (!userid) {
      return res.status(400).json({ messagee: "No userid provided"});
    }

    const query = `SELECT * FROM user WHERE userid = ?`;
    const [userData] = await db.query(query, [userid]);

    if (userData.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    userData[0].password = "";

    return res.status(200).json(userData[0]);


  } catch (error) {
    console.log("Error in getUserData controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const suspendAndUnsuspendUser = async (req, res) => {
  try {
    const userid = req.params.userid;

    if (!userid) {
      return res.status(400).json({ message: "No userid provided" });
    }

    const query = `UPDATE user SET suspended = NOT suspended WHERE userid = ?`;
    await db.query(query, [userid]);

    return res.status(200).json({ message: "User suspended/unsuspended" });

  } catch (error) {
    console.log("Error in suspendAndUnsuspendUser controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

}

// Set new Default Rates
const setDefaultRates = async (req, res) => {
  try {
    const userid = req.params.userid;
    const { newRates } = req.body;
    if (!userid || !newRates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `UPDATE user SET defaultrates = ? WHERE userid = ?`;

    await db.query(query, [newRates, userid]);

    return res.status(200).json({ message: "Default Rates Updated" });

  } catch (error) {
    console.log("Error in setDefaultRates controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
}

// Reset Current Rates
const resetRates = async (req, res) => {
  try {
    const userid = req.params.userid;
    if (!userid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `UPDATE user SET rates = defaultrates WHERE userid = ?`;
    await db.query(query, [userid]);

    return res.status(200).json({ message: "Rates Reset" });

  } catch (error) {
    console.log("Error in resetRates controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get all post reports

const getAllPostReports = async (req, res) => {
  try {
    const query = "SELECT * from violations WHERE violation_type = ? ORDER BY timestamp DESC";
    const values = ['report_post'];

    const [reports] = await db.query(query, values);

    return res.status(200).json(reports);
  } catch (error) {
    console.log("Error in getAllPostReports Controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Reset a user's flagscore. Require's userid.
const resetFlagScore = async (req, res) => {
  try {
    const userid = req.params.userid;

    // Deletes all of the user's flags in the past 7 days.
    const query = 'DELETE FROM flags WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK';
    await db.query(query, [userid]);
    
    // Revaluate flagscore
    evaluateFlagscore(userid);

    return res.status(200).json({ message: "User's relevant flags removed." });

  } catch (error) {
    console.log("Error in resetFlagScore controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Select user's posts, comments, and private messages
const getUsersContent = async (req, res) => {
  try {
    const userid = req.params.userid;

    // Select posts
    const [posts] = await db.query("SELECT * FROM together_posts WHERE userid = ? ORDER BY timestamp DESC", [userid]);
    // Select comments
    const [comments] = await db.query("SELECT * FROM together_comments WHERE userid = ? ORDER BY timestamp DESC", [userid]);
    // Select messages
    const [messages] = await db.query("SELECT * FROM together_messages WHERE userid = ? ORDER BY timestamp DESC", [userid]);

    return res.status(200).json({posts, comments, messages});

  } catch (error) {
    console.log("Error in getUsersContent: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all dashboard data
const getDashboardData = async (req, res) => {
  try {
    
    // Select total amount of users
    const [totalUsers] = await db.query("SELECT userid, createdat FROM user");

    // Select amount of new users in the last week
    const [usersThisWeek] = await db.query("SELECT userid, createdat FROM user WHERE createdat > UTC_TIMESTAMP() - INTERVAL 1 WEEK");

    // Select total flagweight in the past week
    const [flagsThisWeek] = await db.query("SELECT weight, timestamp FROM flags WHERE timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK");

    // Select total violations in the past week
    const [violationsThisWeek] = await db.query("SELECT violationid, timestamp, violation_type FROM violations WHERE timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK");

    // Number of posts this week
    const [posts] = await db.query("SELECT postid, timestamp FROM together_posts WHERE timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK");
    const numberPosts = posts.length;

    // Number of private messages past week
    const [privateMessages] = await db.query("SELECT messageid, timestamp FROM together_messages WHERE timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK");
    const numberMessages = privateMessages.length;
    
    // Number of guided messages in the past week (Not including deleted ones)
    const [guidedMessagesThisWeekData] = await db.query("SELECT messageid, timestamp FROM message WHERE timestamp > UTC_TIMESTAMP() - INTERVAL 1 WEEK AND sender = 'ai' ORDER BY timestamp DESC");

    // Array of Plot[] Type holds a timestamp and value
    const guidedMessagesThisWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (6 - i)); // Start from 7 days ago
      return {
        value: 0,
        timestamp: date.toISOString().split("T")[0], // Only date part (YYYY-MM-DD)
      };
    });

    // Loop through each selected message
    guidedMessagesThisWeekData.forEach(({ timestamp }) => {
      const messageDate = new Date(timestamp).toISOString().split("T")[0];
      
      // Compare the message's timestamp to each day
      guidedMessagesThisWeek.forEach((day) => {
        if (day.timestamp === messageDate) {
          day.value += 1;
        }
      });
    });

    return res.status(200).json({ totalUsers, usersThisWeek, flagsThisWeek, violationsThisWeek, numberPosts, numberMessages, guidedMessagesThisWeek });

  } catch (error) {
    console.log("Error in getDashboardData: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAdmin,
  getUsers,
  searchForUser,
  getUserData,
  suspendAndUnsuspendUser,
  setDefaultRates,
  resetRates,
  getAllPostReports,
  resetFlagScore,
  getUsersContent,
  getDashboardData
}