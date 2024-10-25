const db = require('../../db/db');

const checkIfEmailExists = async(email) => {
  try {
    const query = 'SELECT email FROM user WHERE email = ?';
    const [rows] = await db.query(query, [email]);

    if (rows.length > 0) {
      return true;
    }

    return false;

  } catch (error) {
    throw new Error(error);
  }
}

module.exports = checkIfEmailExists;