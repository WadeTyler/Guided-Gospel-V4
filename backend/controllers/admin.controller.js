
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

module.exports = {
  getAdmin,
}