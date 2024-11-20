const db = require('../../db/db');
const { v4: uuidv4 } = require('uuid');
const generateToken = require('../../lib/jwt/generateToken');
const { getTimestampInSQLFormat } = require('../../lib/utils/sqlFormatting');

// Relevant DB tables

/*
together_sessions
+--------------+--------------+------+-----+---------+-------+
| Field        | Type         | Null | Key | Default | Extra |
+--------------+--------------+------+-----+---------+-------+
| sessionid    | varchar(512) | NO   | PRI | NULL    |       |
| user1        | varchar(512) | YES  |     | NULL    |       |
| user2        | varchar(512) | YES  |     | NULL    |       |
| lastModified | timestamp    | YES  |     | NULL    |       |
+--------------+--------------+------+-----+---------+-------+

together_messages
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| messageid | int          | NO   | PRI | NULL    | auto_increment |
| sessionid | varchar(512) | YES  |     | NULL    |                |
| userid    | varchar(512) | YES  |     | NULL    |                |
| timestamp | timestamp    | YES  |     | NULL    |                |
| text      | text         | YES  |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
*/

const createMessageSession = async (req, res) => {
  try {
    const user1 = req.body.userid;  // current user
    const user2 = req.body.user2;   // target user



    if (user1 === user2) return res.status(400).json({ message: "You cannot create a session with yourself." });

    // Check if session already exists
    const [existingSessions] = await db.query("SELECT * FROM together_sessions WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)", [user1, user2, user2, user1]);

    if (existingSessions.length > 0) {
      return res.status(200).json(existingSessions[0]);
    }

    // Generate sessionid
    const uuid = uuidv4();
    const sessionid = generateToken(uuid);

    const lastModified = getTimestampInSQLFormat();

    // add to database
    await db.query("INSERT INTO together_sessions (sessionid, user1, user2, lastModified) VALUES(?, ?, ?, ?)", [sessionid, user1, user2, lastModified]);

    const [session] = await db.query("SELECT * FROM together_sessions WHERE sessionid = ?", [sessionid]);

    return res.status(200).json(session[0]);

  } catch (error) {
   console.log("Error in createMessageSession controller: ", error);
   return res.status(500).json({ message: "Internal Server Error" }); 
  }
}

const getUserSessions = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = `SELECT together_sessions.*, together_messages.text AS lastMessage FROM together_sessions 
    JOIN together_messages ON together_sessions.sessionid = together_messages.sessionid
    AND together_messages.timestamp = (SELECT MAX(timestamp) FROM together_messages WHERE together_messages.sessionid = together_sessions.sessionid)
    WHERE together_sessions.user1 = ? OR together_sessions.user2 = ? ORDER BY timestamp DESC`;

    const [sessions] = await db.query(query, [userid, userid]);

    if (sessions.length === 0) {
      return res.status(200).json([]);
    }

    // Add both user's username and avatar;
    for (const session of sessions) {
      // Add user1's
      const userQuery = 'SELECT username, avatar FROM user WHERE userid = ?';
      const [user1Data] = await db.query(userQuery, [session.user1]);

      session.user1_username = user1Data[0].username;
      session.user1_avatar = user1Data[0].avatar;

      // Add user2's
      const [user2Data] = await db.query(userQuery, [session.user2]);

      session.user2_username = user2Data[0].username;
      session.user2_avatar = user2Data[0].avatar;

    };

    return res.status(200).json(sessions);

  } catch (error) {
   console.log("Error in getUserSessions controller: ", error);
   return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getSessionMessages = async (req, res) => {
  try {
    const sessionid = req.params.sessionid;

    if (!sessionid) return res.status(400).json({ message: "sessionid is required" });
    

    const [messages] = await db.query(`SELECT together_messages.*, user.username, user.avatar FROM together_messages JOIN user ON together_messages.userid = user.userid WHERE together_messages.sessionid = ? ORDER BY timestamp ASC`, [sessionid]);

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getSessionMessages controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const markMessagesRead = async (req, res) => {
  try {
    const sessionid = req.params.sessionid;
    const userid = req.body.userid;

    const query = 'UPDATE together_messages SET seen = 1 WHERE sessionid = ?';
    await db.query(query, [sessionid]);

    const [users] = await db.query("SELECT user1, user2 FROM together_sessions WHERE sessionid = ?", [sessionid]);

    // Determine sender from the session
    const user1 = users[0].user1;
    const user2 = users[0].user2;
    const targetUser = user1 === userid ? user2 : user1;

    const notification_query = "UPDATE notifications SET seen = 1 WHERE senderid = ? AND type = 'message'";
    await db.query(notification_query, [targetUser]);

    return res.status(200).json({ message: "Messages Marked Read" });
  } catch (error) {
    console.log("Error in markMessagesRead", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createMessageSession,  
  getUserSessions,
  getSessionMessages,
  markMessagesRead
}