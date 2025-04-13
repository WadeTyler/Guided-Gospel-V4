const nodemailer = require('nodemailer');
const checkEmailFormat = require('../utils/checkEmailFormat');
// require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {

    if (!to) {
      console.error("No recipient specified");
      return;
    }

    if (!checkEmailFormat(to)) {
      console.error("Invalid email format");
      return;
    }

    const mailData = {
      from: ' "Guided Gospel" <contact@guidedgospel.net>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    }

    // send email with defined transport object
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          throw new Error(`Error in sendEmail: ${err.message || err}`);
        } else {
          return resolve(info);
        }
      });
    })


    console.log("Email sent %s", info.messageId);
  } catch (error) {
    throw new Error(`Error in sendEmail: ${error.message || error}`);
  }
}

module.exports = sendEmail;