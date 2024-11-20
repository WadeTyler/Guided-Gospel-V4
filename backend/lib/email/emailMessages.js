

const passwordRecovery = (recoveryToken) => {

  const link = `http://guidedgospel.net/updatepassword/${recoveryToken}`;

  const message = `
  <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none; font-size: 2rem; font-weight: bold">Guided Gospel</a>
  <p>You have requested a password recovery.</p>
  <p>Please click the link below to reset your password.</p>
  <br/>
  <p>Your Recovery Code is: <strong style="color: #f59e0b;">${recoveryToken}</strong></p>
  <br/>
  <p>If you did not request this recovery, please ignore this email.</p>
  <p>Thank you for using <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none;">Guided Gospel</a>.</p>
  <br />
  `;

  return message;

}

const emailVerification = (verificationToken) => {
  const link = `http://guidedgospel.net/completesignup/${verificationToken}`;
  const message = `
  <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none; font-size: 2rem; font-weight: bold">Guided Gospel</a>
  <p>Please click the link below to complete your account registration.</p>
  <br/>
  <p>Your Verification Code is: <strong style="color: #f59e0b;">${verificationToken}</strong></p>
  <br/>
  <p>If you did not request this, please ignore this email.</p>
  <p>Thank you for using <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none;">Guided Gospel</a>.</p>
  <br />
  `;

  return message;
}

const postReported = (userid, content) => {
  const message = `
  <a href="https://guidedgospel.net/" style="color: #f59e0b; text-decoration: none; font-size: 2rem; font-weight: bold">Guided Gospel</a>
  <p>A user's post has been reported.</p>
  <p>userid: ${userid}</p>
  <p>The report message is:</p>
  <p><em>${content}</p></em>
  `
  return message;
}



module.exports = {
  passwordRecovery,
  emailVerification,
  postReported
}