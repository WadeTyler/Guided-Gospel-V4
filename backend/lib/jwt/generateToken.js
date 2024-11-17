const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (value) => {

  const token = jwt.sign({value}, process.env.JWT_SECRET);
  return token;
}

module.exports = generateToken;