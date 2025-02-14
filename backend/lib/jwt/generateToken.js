const jwt = require('jsonwebtoken');
// require('dotenv').config();

const generateToken = (value) => {

  const timestamp = new Date().getTime();

  const token = jwt.sign({value, timestamp}, process.env.JWT_SECRET);
  return token;
}

module.exports = generateToken;