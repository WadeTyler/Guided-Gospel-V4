const db = require('../../db/db');

const checkIfEmailExists = async(email) => {
  try {

    // Check user table
    const userQuery = 'SELECT email FROM user WHERE email = ?';
    const [rows] = await db.query(userQuery, [email]);

    if (rows.length > 0) {
      return true;
    }

    // Check DeletedEmails table
    const deletedEmailQuery = 'SELECT email FROM DeletedEmails WHERE email = ?';
    const [deletedRows] = await db.query(deletedEmailQuery, [email]);

    if (deletedRows.length > 0) {
      return true;
    }

    // Not found
    return false;

  } catch (error) {
    throw new Error(error);
  }
}

module.exports = checkIfEmailExists;