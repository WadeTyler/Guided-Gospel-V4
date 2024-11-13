const db = require('../db/db');

// Verify if the user is unsuspended
const checkSuspended = async (req, res, next) => {
  const userid = req.body.userid;
  const [users] = await db.query("SELECT * FROM user WHERE userid = ?", [userid]);

  if (users.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  if (users[0].suspended === 1) {
    return res.status(403).json({ message: "Your account is suspended. Please contact support if you believe this is a mistake." });
  }

  next();
}

module.exports = checkSuspended;