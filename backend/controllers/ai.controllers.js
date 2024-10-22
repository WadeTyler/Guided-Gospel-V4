
const OpenAI = require('openai');
const db = require('../db/db');

// Load API key from .env file
const openAIAPIKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  organization: 'org-5gX4eunNs46WYfL0mAAWLLvf',
  project: 'proj_JhUmfjLZuCJ1pPOrPJFdRSMZ',
});

// System prompt
const systemPrompt = `
  You are a Christian advisor. Your role is to support and guide users in their faith journey. Provide a listening ear, offer scriptural insights, and help users navigate any spiritual questions or concerns they may have. Your goal is to affirm the user's beliefs, offer encouragement based on Biblical teachings, and remind them of God's love and presence in their life.

  Response Rules:
  - Limit your response to 2 paragraphs.
  - Add '<br/><br/>' at the end of each paragraph.
  - Ask a related question at the end of your response.
  `;

const getChatCompletion = async (req, res) => {
  try {
    const { message, sessionid } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!sessionid) {
      return res.status(400).json({ error: "Session id is required" });
    }

    // Get the chat history
    const messages = await getChatHistory(sessionid);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return res.status(200).json( completion.choices[0].message );
  } catch (error) {
    console.log("Error in getChatCompletion Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// This gets the chat history, and returns it as an array of messages according to openai's format
const getChatHistory = async (sessionid) => {
  try {
    
    const query = 'SELECT sender, text, timestamp FROM message WHERE sessionid = ? ORDER BY timestamp';

    const [messagesData] = await db.query(query, [sessionid]);
    console.log(messagesData);

    var messages = [
      {role: "system", content: systemPrompt},
    ];

    // Iterate over each message and add it to the messages array
    messagesData.forEach(element => {

      if (element.sender === 'user') {
        messages.push({role: "user", content: element.text});
      }
      else {
        messages.push({role: "assistant", content: element.text});
      }
    });
    return messages;

  } catch (error) {
    throw new Error ("Error in getChatHistory function", error);
  }
}


module.exports = {
  getChatCompletion,
}