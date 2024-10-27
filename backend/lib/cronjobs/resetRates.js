const cron = require('node-cron');
const db = require('../../db/db');


const resetRates = () => {
  // minute hour day_of_month month day_of_week
  cron.schedule('0 0 * * *', async () => {
    try {
      const resetQuery = 'UPDATE user SET rates = defaultrates';
      await db.query(resetQuery, [defaultRates]);
      console.log(`Rates reset to ${defaultRates}`);
    } catch (error) {
      console.log(`Error in resetRates: ${error}`);
    }
  });
};

module.exports = resetRates;