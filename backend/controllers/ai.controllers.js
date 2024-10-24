
const OpenAI = require('openai');
const db = require('../db/db');
const rates = require('../middleware/rates');

// Load API key from .env file
const openAIAPIKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  organization: 'org-5gX4eunNs46WYfL0mAAWLLvf',
  project: 'proj_JhUmfjLZuCJ1pPOrPJFdRSMZ',
});


const getChatCompletion = async (req, res) => {
  try {

    const { message, sessionid, firstname, age, denomination } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (!sessionid) {
      return res.status(400).json({ message: "Session id is required" });
    }

    // System prompt
    const systemPrompt = `
    You are a Christian advisor. Your role is to support and guide users in their faith journey. Provide a listening ear, offer scriptural insights, and help users navigate any spiritual questions or concerns they may have. Your goal is to affirm the user's beliefs, offer encouragement based on Biblical teachings, and remind them of God's love and presence in their life.

    ${firstname ? `The user's name is: ${firstname}.` : ''}
    ${age ? `The user's age is: ${age}.` : ''}
    ${denomination ? `The user's denomination is: ${denomination}.` : ''}

    Response Rules:
    - Limit your response to 2 paragraphs.
    - When you finish a paragraph add '<br/><br/>'.
    - Ask a related question at the end of your response.
    `;

    // Get the chat history
    const messages = await getChatHistory(sessionid, systemPrompt);

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
const getChatHistory = async (sessionid, systemPrompt) => {
  try {
    
    const query = 'SELECT sender, text, timestamp FROM message WHERE sessionid = ? ORDER BY timestamp';

    const [messagesData] = await db.query(query, [sessionid]);

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

// Get a summary based on the message
const getAndSetSummary = async (req, res) => {
  try {
    const { sessionid } = req.body;
    
    if (!sessionid) {
      return res.status(400).json({ error: "Session id is required" });
    }

    const systemPrompt = "You are a helpful assistant. Your role is to provide a summary of user's conversation. Your summary should be no more than 4 words. Don't include any personal information or details that could identify the user. Your goal is to provide a concise summary of the conversation. Don't include the word 'user' in your summary.";

    const messages = await getChatHistory(sessionid, systemPrompt);

    const summary = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages
    });

    const content = summary.choices[0].message.content;

    // Save the summary to the database
    const query = 'UPDATE session SET summary = ? WHERE sessionid = ?';
    await db.query(query, [content, sessionid]);
    
    return res.status(200).json({ summary: content });
  } catch (error) {
    console.log("Error in getAndSetSummary Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getChatCompletion,
  getAndSetSummary,
}