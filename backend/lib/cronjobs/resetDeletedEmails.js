const cron = require('node-cron');
const db = require('../../db/db');


const resetDeletedEmails = () => {
  // Runs daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    try {
      // Delete all emails in the table
      await db.query('DELETE FROM DeletedEmails');
      console.log('DeletedEmails table reset');
    } catch (error) {
      console.log(`Error in resetDeletedEmails: ${error}`);
    }
  });
};

module.exports = resetDeletedEmails;