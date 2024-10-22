const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { deleteSessionMessages, deleteAllUserMessages } = require('../lib/utils/deleteMessages');

// Get all sessions for a user
const getSessions = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM session WHERE userid = ? ORDER BY lastmodified DESC';
    const [sessionsData] = await db.query(query, [userid]);
    
    return res.status(200).json(sessionsData);
  } catch (error) {
    console.log("Error in getSessions controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Create a new session (Returns the sessionid)
const createSession = async (req, res) => {
  try {
    
    const userid = req.cookies.userid;
    const sessionid = uuidv4();

    const lastmodified = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const query = 'INSERT INTO session (sessionid, userid, lastmodified) VALUES (?, ?, ?)';
    const values = [sessionid, userid, lastmodified];

    await db.query(query, values);

    return res.status(200).json({ sessionid });
  } catch (error) {
    console.log("Error in createSession controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a session
const deleteSession = async (req, res) => {
  try {
    const sessionid = req.params.sessionid;
    if (!sessionid) {
      return res.status(400).json({ message: "Session id is required" });
    } 

    // Delete all messages in the session
    await deleteSessionMessages(sessionid);

    // Delete the session
    const query = 'DELETE FROM session WHERE sessionid = ?';
    await db.query(query, [sessionid]);
    

    return res.status(200).json({ message: "Session deleted successfully" });

  } catch (error) {
    console.log("Error in deleteSession controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete all sessions
const deleteAllSessions = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    // Delete all messages for the user
    await deleteAllUserMessages(userid);

    // Delete all sessions for the user
    const query = 'DELETE FROM session WHERE userid = ?';
    await db.query(query, [userid]);

    return res.status(200).json({ message: "All sessions deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAllSessions controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getSessions,
  createSession,
  deleteSession,
  deleteAllSessions
}