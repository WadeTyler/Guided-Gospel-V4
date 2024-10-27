
// Middleware to check if the user is an admin

const db = require("../db/db");

const authenticatedAdmin = async (req, res, next) => {
  try {

    const userid = req.cookies.userid;
    if (!userid) {
      return res.status(401).json({ error: "Unauthorized" });
    } 

    const [admins] = await db.query("SELECT administratorid FROM Administrators WHERE userid = ?", [userid]);

    if (admins.length === 0 || !admins[0].administratorid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();

  } catch (error) {
    console.error("Error in authenticatedAdmin middleware: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
}

module.exports = authenticatedAdmin;