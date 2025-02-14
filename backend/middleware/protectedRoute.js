require("dotenv").config();
const db = require('../db/db');
const jwt = require('jsonwebtoken');

// Verify if the user is authenticated
const protectedRoute = async (req, res, next) => {
  try {

    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res.status(404).json({ error: "authToken not found" });
    }

    // Verify Token
    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        res.clearCookie("authToken");
        throw new Error(err);
        return res.status(401).json({message: "Invalid authToken. Please Login again."});
      }

      // extract userid from token
      const userid = decoded.userid;

      // Check if userid is in db

      const user = await db.query("SELECT userid FROM user WHERE userid = ?", [userid]);
      console.log("USER: ", user);

      if (user[0].length === 0) {
        // Not Found
        res.clearCookie("authToken");
        return res.status(404).json({message: "User does not exist"});
      }

      // Found - Set the req.userid to the userid
      try {
        req.body.userid = user[0][0].userid;
      } catch (e) {
        res.clearCookie("authToken");
        return res.status(401).json({ message: "Unauthorized" });
      }

      next();
    });
  

    
  } catch (error) {
    console.log("Error in protectedRoute: ", error);
    res.clearCookie("authToken");
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = protectedRoute;