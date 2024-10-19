const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const getMessages = async (req, res) => {
  try {
    const sessionid = req.params.sessionid;
    if (!sessionid) {
      return res.status(400).json({ message: "Session id is required" });
    }

    const query = 'SELECT * FROM message WHERE sessionid = ?';

    const [messsagesData] = await db.query(query, [sessionid]);
    return res.status(200).json(messsagesData);
  } catch (error) {
    console.log("Error in getMessages controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const addMessage = async (req, res) => {
  try {
    const { sessionid, sender, text } = req.body || {};

    if (!sessionid || !sender || !text) return res.status(400).json({ message: "Session id, sender and text are required" });

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const messageid = uuidv4();

    const query = 'INSERT INTO message (messageid, sessionid, timestamp, sender, text) VALUES (?, ?, ?, ?, ?)';
    const values = [messageid, sessionid, timestamp, sender, text];

    await db.query(query, values);

    return res.status(200).json({ messageid, sessionid, timestamp, sender, text});

  } catch (error) {
    console.log("Error in addMessage controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  getMessages,
  addMessage
}