
// Middleware to check if the user is an admin

require("dotenv").config();
const db = require('../db/db');
const jwt = require('jsonwebtoken');

// Verify if the user is authenticated
const authenticatedAdmin = (req, res, next) => {
  try {

    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res.status(404).json({ error: "authToken not found" });
    }

    // Verify Token
    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.clearCookie("authToken");
        throw new Error(err);
        return res.status(401).json({ message: "Invalid authToken. Please Login again." });
      }

      // extract userid from token
      const userid = decoded.userid;

      // Check if userid is in Administrators table
      
      const user = db.query("SELECT userid FROM Administrators WHERE userid = ?", [userid]);
      
      if (user.length === 0) {
        // Not Found
        res.clearCookie("authToken");
        return res.status(404).json({ message: "Not Administrator" });
      }

      next();
    });
  
  } catch (error) {
    console.log("Error in authenticatedAdmin: ", error);
    return res.status(401).json({ message: "Not Administrator" });
  }
}

module.exports = authenticatedAdmin;