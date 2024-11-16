const db = require('../../db/db');
const { getTimestampInSQLFormat } = require('../../lib/utils/sqlFormatting');

const createNotification = async (req, res) => {
  try {
    const { type, receiverid } = req.body;
    const senderid = req.body.userid;

    if (!type || !senderid) {
      return res.status(400).json({ message: "Type and Senderid are required" });
    }

    // Check valid type 
    if (type !== "follow" && type !== "like") {
      return res.status(400).json({ message: "Invalid Type." });
    }
  
    const values = [receiverid, getTimestampInSQLFormat(), type, 0, senderid];
    await db.query("INSERT INTO notifications (receiverid, timestamp, type, seen, senderid) VALUES(?, ?, ?, ?, ?)", values);

    return res.status(200).json({ message: "Notification added successfully" });
  } catch (error) {
    console.log("Error in createNotificaton controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getUserNotifications = async (req, res) => {
  try {
    const receiverid = req.body.userid;

    // Get data from database
    const [notifications] = await db.query('SELECT * FROM notifications WHERE receiverid = ?', [receiverid]);
    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getUserNotifications controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createNotification,
  getUserNotifications,
}