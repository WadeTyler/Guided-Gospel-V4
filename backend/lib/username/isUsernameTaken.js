const db = require('../../db/db');


const isUsernameTaken = async (username) => {
  try {
    const query = 'SELECT username FROM user WHERE username = ?';
    const [users] = await db.query(query, [username]);

    if (users.length === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in checkUsernameTaken: ", error);
    return { message: "Internal Server Error" };
  }
}

module.exports = isUsernameTaken;