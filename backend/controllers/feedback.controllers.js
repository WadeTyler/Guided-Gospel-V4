const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');
const { getTimestampInSQLFormat } = require('../lib/utils/sqlFormatting');

const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: "A message is required to submit feedback." });
    }

    const feedbackid = uuidv4();

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    var query = '';
    var values = [feedbackid, feedback, timestamp];

    const userid = req.cookies.userid;
    if (!userid) {
      query = 'INSERT INTO feedback (feedbackid, text, timestamp) VALUES (?, ?, ?)';
    } else {
      query = 'INSERT INTO feedback (feedbackid, text, timestamp, userid) VALUES (?, ?, ?, ?)';
      values.push(userid);
    }

    await db.query(query, values);

    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.log("Error in submitFeedback controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const submitBugReport = async (req, res) => {
  try {
    const userid = req.cookies.userid;
    const { category, impact, issue } = req.body;
    
    if (!category || !impact || !issue) {
      return res.status(400).json({ message: "All fields are required to submit a bug report." });
    }

    const timestamp = getTimestampInSQLFormat();

    const query = 'INSERT INTO BugReports (userid, category, impact, issue, timestamp) VALUES (?, ?, ?, ?, ?)';
    const values = [userid, category, impact, issue, timestamp];

    await db.query(query, values);

    return res.status(200).json({ message: "Bug report submitted successfully" });
    
  } catch (error) {
    console.log("Error in submitBugReport controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  submitFeedback,
  submitBugReport
}