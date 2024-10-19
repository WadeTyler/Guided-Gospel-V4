
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const checkIfEmailExists = require('../lib/utils/checkEmailExists');

const signUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body || {};

    // Check if all fields are provided
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate userid
    const userid = uuidv4();

    // Insert user into database
    const query = 'INSERT INTO user (userid, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)';
    const values = [userid, firstname, lastname, email, hashedPassword];

    await db.query(query, values);

    // Store userid in a cookie (with HttpOnly flag to secure it)
    res.cookie('userid', userid, { 
      httpOnly: true, 
      maxAge: 604800000, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    const user = {
      userid,
      firstname,
      lastname,
      email,
      age: "",
      denomination: "",
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log("Error in signUp controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required"});
    }
    
    const query = 'SELECT * FROM user WHERE email = ?';
    const [results] = await db.query(query, [email]);

    // If email not found
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Store userid in a cookie (with HttpOnly flag to secure it)
    res.cookie('userid', user.userid, { 
      httpOnly: true, 
      maxAge: 604800000, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });


    const { password: _, ...userWithoutPassword} = user;
    return res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.log("Error in login controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    
    res.clearCookie('userid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    return res.status(200).json({ message: "User logged out successfully" });

  } catch (error) {
    console.log("Error in logout controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const updateUser = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const [userData] = await db.query('SELECT * FROM user WHERE userid = ?', [userid]);
    const user = userData[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstname, lastname, email, age, denomination, currentPassword, newPassword } = req.body || {};

    if (!firstname && !lastname && !email && !age && !denomination) { 
      return res.status(400).json({ message: "No fields to update" });
    }

    // Check if email exists
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Make sure both current and newPassword are provided
    if (currentPassword && !newPassword || newPassword && !currentPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    var hashedPassword = user.password;
  
    // Check if password matches if updating
    if (currentPassword && newPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid current password" });
      }
      // If it matches, hash the new password
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update user in database
    const query = 'UPDATE user SET firstname = ?, lastname = ?, email = ?, age = ?, denomination = ?, password = ? WHERE userid = ?';

    const values = [
      firstname || user.firstname,
      lastname || user.lastname,
      email || user.email,
      age || user.age,
      denomination || user.denomination,
      hashedPassword,
      userid
    ];

    await db.query(query, values);

    // Get new updated user values
    const [updatedUserData] = await db.query('SELECT * FROM user WHERE userid = ?', [userid]);
    const updatedUser = updatedUserData[0];

    // Remove Password from userObject
    const { password: _, ...userWithoutPassword} = updatedUser;

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log("Error in updateUser controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  
}

const getMe = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    const query = 'SELECT * FROM user WHERE userid = ?';
    const [userData] = await db.query(query, [userid]);
    const user = userData[0];

    // Remove password
    const { password: _, ...userWithoutPassword} = user;
    return res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.log("Error in getMe controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  signUp,
  login,
  logout,
  updateUser,
  getMe
}