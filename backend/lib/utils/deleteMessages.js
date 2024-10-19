const db = require('../../db/db');

const deleteSessionMessages = async (sessionid) => {
  try {
    if (!sessionid) {
      throw new Error("Session id is required");
    }

    const query = 'DELETE FROM message WHERE sessionid = ?';
    await db.query(query, [sessionid]);

  } catch (error) {
    console.log("Error in deleteMessagesFromSession util", error);
    throw new Error("Internal Server Error");
  }
}

const deleteAllUserMessages = async (userid) => {
  try {
    if (!userid) {
      throw new Error("User id is required");
    }

    const query = 'DELETE FROM message WHERE userid = ?';
    await db.query(query, [userid]);

  } catch (error) {
    console.log("Error in deleteAllUserMessages util", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  deleteSessionMessages,
  deleteAllUserMessages
}