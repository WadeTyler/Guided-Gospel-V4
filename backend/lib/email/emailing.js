const checkEmailFormat = require('../utils/checkEmailFormat');
const {emailjs} = require('./emailjs.config');
// require('dotenv').config();

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;

const sendOTPEmail = async (email, otp) => {

  if (!email || !checkEmailFormat(email)) throw new Error("Invalid email format");

  const templateParams = {
    email: email,
    passcode: otp,
  }

  if (!SERVICE_ID || !TEMPLATE_ID) {
    throw new Error("Email credentials are not set");
  }

  const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  if (response.status !== 200) {
    throw new Error("Failed to send email");
  }
  console.log("Email sent successfully");
  return response;
}

module.exports = {
  sendOTPEmail
}