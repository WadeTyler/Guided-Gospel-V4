const db = require('../db/db');

const checkUsernameExistsParam = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const query = `SELECT * FROM user WHERE username = ?`;
    const [user] = await db.query(query, [username]);

    // Username does not exist
    if (user.length === 0) {
      return res.status(404).json({ error: "Username not found" });
    }
    // Username exists
    next();
  } catch (error) {
    console.error("Error in checkUsernameExists middleware: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }

}

const checkUsernameExistsBody = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const query = `SELECT * FROM user WHERE username = ?`;
    const [user] = await db.query(query, [username]);

    // Username does not exist
    if (user.length === 0) {
      return res.status(404).json({ error: "Username not found" });
    }
    // Username exists
    next();
  } catch (error) {
    console.error("Error in checkUsernameExists middleware: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }

}

module.exports = {
  checkUsernameExistsParam,
  checkUsernameExistsBody
}