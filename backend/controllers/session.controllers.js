const db = require('../db/db');


// Get all sessions for a user
const getSessions = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM session WHERE userid = ?';
    const [sessionsData] = await db.query(query, [userid]);
    
    return res.status(200).json(sessionsData);
  } catch (error) {
    console.log("Error in getSessions controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getSessions
}