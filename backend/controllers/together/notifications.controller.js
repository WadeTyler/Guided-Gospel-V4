const db = require('../../db/db');
const { getTimestampInSQLFormat } = require('../../lib/utils/sqlFormatting');

const createNotification = async (req, res) => {
  try {
    const { type, receiverid } = req.body;
    const senderid = req.body.userid;

    if (!type || !senderid) {
      return res.status(400).json({ message: "Type and Senderid are required" });
    }

    if (receiverid === senderid)
      return res.status(400).json({ message: "You cannot send a notification to yourself" });

    // Check valid type 
    if (type !== "follow" && type !== "like") {
      return res.status(400).json({ message: "Invalid Type." });
    }

    const timestamp = getTimestampInSQLFormat();

    // Check if notification already exists
    const checkQuery = 'SELECT * FROM notifications WHERE receiverid = ? AND type = ? ORDER BY timestamp DESC LIMIT 1';
    const [checks] = await db.query(checkQuery, [receiverid, type]);
    if (checks.length > 0) {
      // Check timestamp on notificaton. If less than 3 hours, return. 
      const lastTimestamp = new Date(checks[0].timestamp);
      const currentTimestamp = new Date(timestamp);
      const threeHoursMs = (1000 * 60 * 60 * 3);      
      const difference = currentTimestamp - lastTimestamp;

      if (difference < threeHoursMs) { 
        console.log("Here");
        return res.status(200).json({ message: "Notification already sent." });
      }

    }
  
    const values = [receiverid, timestamp, type, 0, senderid];
    await db.query("INSERT INTO notifications (receiverid, timestamp, type, seen, senderid) VALUES(?, ?, ?, ?, ?)", values);

    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.log("Error in createNotificaton controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getUserNotifications = async (req, res) => {
  try {
    const receiverid = req.body.userid;

    // Get data from database
    const [notifications] = await db.query('SELECT notifications.*, user.username AS sender_username FROM notifications JOIN user ON notifications.senderid = user.userid WHERE receiverid = ? ORDER BY timestamp DESC', [receiverid]);
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getUserNotifications controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const deleteAllNotifications = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = 'DELETE FROM notifications WHERE receiverid = ?';
    await db.query(query, [userid]);

    return res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAllNotifications controller, ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const markAllNotificationsRead = async (req, res) => {
  try {
    const userid = req.body.userid;

    const query = 'UPDATE notifications SET seen = 1 WHERE receiverid = ?';
    await db.query(query, [userid]);

    return res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.log("Error in markAllNotificationsRead controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createNotification,
  getUserNotifications,
  deleteAllNotifications,
  markAllNotificationsRead
}