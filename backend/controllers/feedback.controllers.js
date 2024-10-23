const db = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: "A message is required to submit feedback." });
    }

    const feedbackid = uuidv4();

    const query = 'INSERT INTO feedback (feedbackid, text) VALUES (?, ?)';
    await db.query(query, [feedbackid, feedback]);

    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.log("Error in submitFeedback controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  submitFeedback
}