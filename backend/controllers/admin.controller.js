
const db = require("../db/db");

// Returns the Admin's administrator information
const getAdmin = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    if (!userid) {
      return res.status(404).json({ error: "Not Signed in" });
    }

    const [admins] = await db.query("SELECT * FROM Administrators WHERE userid = ?", [userid]);

    if (admins.length === 0 || !admins[0].userid) {
      return res.status(401).json({ error: "Not an Admin" });
    }

    return res.status(200).json(admins[0]);


  } catch (error) {
    console.log("Error in getAdmin controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Return all users in the database
const getUsers = async (req, res) => {
  try {
    const query = 'SELECT userid, firstname, lastname, email, age, denomination, rates, createdat FROM user ORDER BY lastname ASC';
    const [users] = await db.query(query);

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Return user by firstname, lastname, or email
const searchForUser = async (req, res) => {
  try {

    const value = req.params.value;

    const query = 'SELECT userid, firstname, lastname, email, age, denomination, rates, createdat FROM user WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? ORDER BY lastname ASC';
    const values = [`%${value}%`, `%${value}%`, `%${value}%`];

    const [users] = await db.query(query, values);

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchForUser controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



module.exports = {
  getAdmin,
  getUsers,
  searchForUser
}