const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { getTimestampInSQLFormat } = require('../lib/utils/sqlFormatting');

const getMessages = async (req, res) => {
  try {
    const sessionid = req.params.sessionid;
    if (!sessionid) {
      return res.status(400).json({ message: "Session id is required" });
    }

    const query = 'SELECT * FROM message WHERE sessionid = ? ORDER BY timestamp';

    const [messagesData] = await db.query(query, [sessionid]);
    return res.status(200).json(messagesData);
  } catch (error) {
    console.log("Error in getMessages controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const addMessage = async (req, res, next) => {
  try {
    const { sessionid, sender, text } = req.body || {};

    if (!sessionid || !sender || !text) return res.status(400).json({ message: "Session id, sender and text are required" });

    const userid = req.cookies.userid;

    const timestamp = getTimestampInSQLFormat();
    const messageid = uuidv4();

    const insertMessageQuery = 'INSERT INTO message (messageid, sessionid, userid, timestamp, sender, text) VALUES (?, ?, ?, ?, ?, ?)';
    const insertMessagesValues = [messageid, sessionid, userid, timestamp, sender, text];

    await db.query(insertMessageQuery, insertMessagesValues);

    // Update Session last modified timestamp
    const lastModifiedQuery = 'UPDATE session SET lastmodified = ? WHERE sessionid = ?';
    const lastModifiedValues = [timestamp, sessionid];

    await db.query(lastModifiedQuery, lastModifiedValues);

    res.status(200).json({ messageid, sessionid, userid, timestamp, sender, text});
    next();
  } catch (error) {
    console.log("Error in addMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



module.exports = {
  getMessages,
  addMessage,
}