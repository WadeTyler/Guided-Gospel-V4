const db = require('../../db/db');
const { getTimestampInSQLFormat } = require('../../lib/utils/sqlFormatting');

const createNotification = async (req, res) => {
  try {
    const { type, receiverid } = req.body;
    const senderid = req.body.userid;

    if (!type || !senderid) {
      return res.status(400).json({ message: "Type and Senderid are required" });
    }
    console.log(type);
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

module.exports = {
  createNotification
}