

const passwordRecovery = (recoveryToken) => {

  const link = `http://localhost:3000/updatepassword/${recoveryToken}`;

  const message = `
  <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none; font-size: 2rem; font-weight: bold">Guided Gospel</a>
  <p>You have requested a password recovery.</p>
  <p>Please click the link below to reset your password.</p>
  <br/>
  <a href="${link}">Reset Password</a>
  <br/>
  <p>If you did not request this recovery, please ignore this email.</p>
  <p>Thank you for using <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none;">Guided Gospel</a>.</p>
  <br />
  `;

  return message;

}

const emailVerification = (verificationToken) => {
  const link = `http://localhost:3000/completesignup/${verificationToken}`;
  const message = `
  <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none; font-size: 2rem; font-weight: bold">Guided Gospel</a>
  <p>Please click the link below to complete your account registration.</p>
  <br/>
  <a href="${link}">Complete Registration</a>
  <br/>
  <p>If you did not request this, please ignore this email.</p>
  <p>Thank you for using <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none;">Guided Gospel</a>.</p>
  <br />
  `;

  return message;
}



module.exports = {
  passwordRecovery,
  emailVerification
}