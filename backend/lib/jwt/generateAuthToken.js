const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAuthToken = ({userid}) => {

  const expiresIn = 60 * 60 * 24 * 7; // 7 days

  const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET, { expiresIn: expiresIn });
  return token;

}

module.exports = generateAuthToken;