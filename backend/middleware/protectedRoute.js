require("dotenv").config();
const db = require('../db/db');
const jwt = require('jsonwebtoken');

// Verify if the user is authenticated
const protectedRoute = (req, res, next) => {
  try {

    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res.status(404).json({ error: "authToken not found" });
    }

    // Verify Token
    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        res.clearCookie("authToken");
        return res.status(401).json({ message: "Unauthorized. Please Login again." });
      }

      // extract userid from token
      const userid = decoded.userid;

      // Check if userid is in db
      
      const user = db.query("SELECT userid FROM user WHERE userid = ?", [userid]);
      
      if (user.length === 0) {
        // Not Found
        res.clearCookie("authToken");
        return res.status(404).json({ message: "User does not exist" });
      }

      // Found - Set the req.userid to the userid
      req.body.userid = userid;
      next();
    });
  

    
  } catch (error) {
    console.log("Error in protectedRoute: ", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = protectedRoute;