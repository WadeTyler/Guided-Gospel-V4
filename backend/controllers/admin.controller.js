
const db = require("../db/db");

// Returns the Admin's administrator information
const getAdmin = async (req, res) => {
  try {
    const userid = req.body.userid;

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
    const query = 'SELECT username, userid, firstname, lastname, email, age, denomination, rates, defaultrates, createdat, lastactive, suspended FROM user ORDER BY lastname ASC';
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

// Get all user data
const getUserData = async (req, res) => {
  try {
    
    const userid = req.params.userid;
    if (!userid) {
      return res.status(400).json({ messagee: "No userid provided"});
    }

    const query = `SELECT * FROM user WHERE userid = ?`;
    const [userData] = await db.query(query, [userid]);

    if (userData.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    userData[0].password = "";

    return res.status(200).json(userData[0]);


  } catch (error) {
    console.log("Error in getUserData controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const suspendAndUnsuspendUser = async (req, res) => {
  try {
    const userid = req.params.userid;

    if (!userid) {
      return res.status(400).json({ message: "No userid provided" });
    }

    const query = `UPDATE user SET suspended = NOT suspended WHERE userid = ?`;
    await db.query(query, [userid]);

    return res.status(200).json({ message: "User suspended/unsuspended" });

  } catch (error) {
    console.log("Error in suspendAndUnsuspendUser controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }

}

// Set new Default Rates
const setDefaultRates = async (req, res) => {
  try {
    const userid = req.params.userid;
    const { newRates } = req.body;
    if (!userid || !newRates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `UPDATE user SET defaultrates = ? WHERE userid = ?`;

    await db.query(query, [newRates, userid]);

    return res.status(200).json({ message: "Default Rates Updated" });

  } catch (error) {
    console.log("Error in setDefaultRates controller: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
}

// Reset Current Rates
const resetRates = async (req, res) => {
  try {
    const userid = req.params.userid;
    if (!userid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `UPDATE user SET rates = defaultrates WHERE userid = ?`;
    await db.query(query, [userid]);

    return res.status(200).json({ message: "Rates Reset" });

  } catch (error) {
    console.log("Error in resetRates controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
    
  }
}

// Get all post reports

const getAllPostReports = async (req, res) => {
  try {
    const query = "SELECT * from violations WHERE violation_type = ? ORDER BY timestamp DESC";
    const values = ['report_post'];

    const [reports] = await db.query(query, values);

    return res.status(200).json(reports);
  } catch (error) {
    console.log("Error in getAllPostReports Controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = {
  getAdmin,
  getUsers,
  searchForUser,
  getUserData,
  suspendAndUnsuspendUser,
  setDefaultRates,
  resetRates,
  getAllPostReports
}