const db = require('../../db/db');

const checkRates = async (req, res, next) => {
  const userid = req.cookies.userid;

  const ratesQuery = 'SELECT rates FROM user WHERE userid = ?';
  const [rates] = await db.query(ratesQuery, [userid]);

  if (rates[0].rates <= 0) {
    return res.status(400).json({ message: "Sorry. You have hit your daily message limit. Please come back tomorrow." });
  }
  next();
}

const reduceRate = async (req, res) => {
  
  const sender = req.body.sender;
  if (sender !== 'ai') {
    return;
  }

  const userid = req.cookies.userid;
  const query = 'UPDATE user SET rates = rates - 1 WHERE userid = ?';
  await db.query(query, [userid]);
}

module.exports = {
  checkRates,
  reduceRate
}