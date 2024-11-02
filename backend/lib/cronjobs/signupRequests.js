const cron = require('node-cron');
const db = require('../../db/db');

const removeToken = (token, milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Remaining minutes and hours
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;

  const now = new Date();

  var cronHours = now.getHours() + hours;
  
  var cronMinutes = now.getMinutes() + minutes;
  if (cronMinutes >= 60) {
    cronMinutes -= 60;
    cronHours++;
  }


  // minute hour day_of_month month day_of_week
  const cronSchedule = `${cronMinutes} ${cronHours} * * *`;
  
  const job = cron.schedule(cronSchedule, async () => {
    try {
      const deleteQuery = 'DELETE FROM SignUpRequests WHERE signupid = ?';
      await db.query(deleteQuery, [token]);

      // Stop the job after execution
      job.stop();
    } catch (error) {
      console.log(`Error in removeToken in signupRequests.js: ${error}`);
    }
  });

  console.log(`Cron job scheduled for token ${token} at ${cronSchedule}`);
};

module.exports = {
  removeToken
}