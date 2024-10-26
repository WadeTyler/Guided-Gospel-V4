
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const generateToken = require('../middleware/generateToken');
const checkIfEmailExists = require('../lib/utils/checkEmailExists');
const passwordRecoveryCron = require('../lib/cronjobs/passwordRecovery');
const signupRequestsCron = require('../lib/cronjobs/signupRequests');
const emailMessages = require('../lib/email/emailMessages');
const sendEmail = require('../lib/email/sendEmail.js');
const getTimestampInSQLFormat = require('../lib/utils/sqlFormatting').getTimestampInSQLFormat;
const checkEmailFormat = require('../lib/utils/checkEmailFormat');

const defaultRates = 50;

const completeSignUp = async (req, res) => {
  try {
    const { verificationToken } = req.body || {};
    if (!verificationToken) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Get User from SignUpRequests table
    const [users] = await db.query('SELECT * FROM SignUpRequests WHERE verificationToken = ?', [verificationToken]);

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const userData = users[0];

    // Check if email already exists
    if (await checkIfEmailExists(userData.email)) {
      return res.status(400).json({ message: "Email already exists" });
    }



    // Generate userid
    const userid = uuidv4();

    // Insert user into database
    const query = 'INSERT INTO user (userid, firstname, lastname, email, age, denomination, password, rates, createdat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [userid, userData.firstname, userData.lastname, userData.email, null, null, userData.password, defaultRates, getTimestampInSQLFormat()];

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
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      age: "",
      denomination: "",
      rates: defaultRates,
    }

    // Remove user from SignUpRequests table
    await db.query('DELETE FROM SignUpRequests WHERE verificationToken = ?', [verificationToken]);

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in completeSignUp controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const signUp = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body || {};

    // Check if all fields are provided
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (firstname.length < 2) {
      return res.status(400).json({ message: "First name must be at least 2 characters" });
    }

    if (lastname.length < 2) {
      return res.status(400).json({ message: "Last name must be at least 2 characters" });
    }

    // Check if email already exists
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check email format
    if (!checkEmailFormat(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = await generateToken(email + firstname + lastname);

    // Insert user into SignUpRequests table
    const query = 'INSERT INTO SignUpRequests (verificationToken, firstname, lastname, email, password, timestamp) VALUES (?, ?, ?, ?, ?, ?)';

    const values = [verificationToken, firstname, lastname, email, hashedPassword, getTimestampInSQLFormat()];
    await db.query(query, values);

    // Send email
    sendEmail(email, "Complete Your Registration - Guided Gospel", "Please complete your registration.", emailMessages.emailVerification(verificationToken));

    // Activate Cronjob to remove token after 10 minutes
    signupRequestsCron.removeToken(verificationToken, 600000);

    return res.status(200).json({ message: "Verification email sent" });
    

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

    if (age && (age < 13 || age > 130)) {
      return res.status(400).json({ message: "Invalid age" });
    }

    if (firstname && firstname.length < 2) {
      return res.status(400).json({ message: "First name must be at least 2 characters" });
    }

    if (lastname && lastname.length < 2) {
      return res.status(400).json({ message: "Last name must be at least 2 characters" });
    }

    // Check if email exists
    const emailExists = await checkIfEmailExists(email);
    if (email !== user.email && emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check email format
    if (email && !checkEmailFormat(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Make sure both current and newPassword are provided
    if ((currentPassword && !newPassword) || (newPassword && !currentPassword)) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    var hashedPassword = user.password;
  
    // Check if password matches if updating
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
      }

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
      age || null,
      denomination || null,
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

const deleteUser = async (req, res) => {
  try {
    const userid = req.cookies.userid;

    await db.query('DELETE FROM message WHERE userid = ?;', [userid]);
    await db.query('DELETE FROM session WHERE userid = ?;', [userid]);
    await db.query('DELETE FROM user WHERE userid = ?;', [userid]);

    res.clearCookie('userid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const submitForgotPassword = async (req, res) => {
  try {

    // Check for spamCookie
    const spamCookie = req.cookies['forgotPasswordSpam'];
    if (spamCookie) {
      return res.status(400).json({ message: "Please wait before submitting another request" });
    }


    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email exists
    const emailExists = await checkIfEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({ message: "No account exists with the provided email." });
    }

    

    // Add spam cookie
    const spamToken = await generateToken(email);

    res.cookie('forgotPasswordSpam', spamToken, { 
      httpOnly: true, 
      maxAge: 60000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    // Add recovery token to database
    const recoveryToken = await generateToken(email + email);
    await db.query('INSERT INTO RequestedRecovery (recoveryToken, email) VALUES (?, ?)', [recoveryToken, email]);

    passwordRecoveryCron.removeToken(recoveryToken, 600000);

    sendEmail(email, "Password Recovery - Guided Gospel", "You have requested a password recovery.", emailMessages.passwordRecovery(recoveryToken));

    res.status(200).json({ message: "Password recovery email sent" });

  } catch (error) {
    console.log("Error in submitForgotPassword controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { recoveryToken, newPassword, confirmNewPassword } = req.body || {};
    if (!recoveryToken) {
      return res.status(400).json({ message: "Recovery token is required" });
    }

    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "New password and confirm new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [emails] = await db.query('SELECT email FROM RequestedRecovery WHERE recoveryToken = ?', [recoveryToken]);

    if (!emails || emails.length === 0) {
      return res.status(400).json({ message: "This session has expired. Please submit another password reset request." });
    }

    const email = emails[0].email;

    await db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email]);


    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.log("Error in resetPassword controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const isValidRecoveryToken = async (req, res) => {
  try {
    const { recoveryToken } = req.params || {};

    if (!recoveryToken) {
      return res.status(400).json({ message: "Recovery token is required" });
    } 

    const [email] = await db.query('SELECT * FROM RequestedRecovery WHERE recoveryToken = ?', [recoveryToken]);

    if (!email || email.length === 0) {
      return res.status(400).json({ message: "Invalid recovery token" });
    }

    return res.status(200).json({ message: "Valid recovery token" });

  } catch (error) {
    console.log("Error in isValidRecoveryToken controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
  completeSignUp,
  signUp,
  login,
  logout,
  updateUser,
  getMe,
  deleteUser,
  submitForgotPassword,
  resetPassword,
  isValidRecoveryToken
}