
const { Server } = require("socket.io");
const db = require('../db/db');
const { getTimestampInSQLFormat } = require("../lib/utils/sqlFormatting");
const { checkPrivateMessageSpamViolations, containsFlagWords, checkFlaggedWordsViolations, evaluateFlagscore } = require("../lib/violations/checkViolations");


const connectedUsers = new Map();

const setupSocket = async (io) => {
  console.log("Setting up socket");

  io.on("connection", (socket) => {

    // Listen for user registration
    socket.on('register', (userid) => {
      console.log(`A user signed in: ${userid}`);
      connectedUsers.set(socket.id, userid);
      console.log("Connected Users: ", Array.from(connectedUsers.values()));
    });

    socket.on('disconnect', () => {
      const userid = connectedUsers.get(socket.id);
      console.log("Disconnecting");
      if (userid) {
        console.log(`User disconnected: ${userid}`);
        connectedUsers.delete(socket.id);
      }

      console.log("Connected Users after Disconnect: ", Array.from(connectedUsers.values()));
    });

    socket.on("join-room", (room, cb) => {
      const userid = connectedUsers.get(socket.id);
      socket.join(room);
      cb(`User joinedJoined Room: ${room}`);
      
    })
    
    socket.on("private-message", async (room, userid, sessionid, text) => {

      // No Session id
      if (sessionid === "") {
        const output = "No sessionid provided";
        io.to(socket.id).emit("message-denied", output);
        return;
      }

      const [user] = await db.query("SELECT * FROM user WHERE userid = ?", [userid]);

      if (user[0].suspended) {
         const output = "Your account is suspended and you are prohibited from sending messages. If you believe this is an issue please contact support.";
         evaluateFlagscore(userid);
         io.to(socket.id).emit("message-denied", output);
         return;
      }


      // Determine the target user
      const [targetUsers] = await db.query("SELECT user1, user2 FROM together_sessions WHERE sessionid = ?", [sessionid]);
      var targetUser;        
      if (targetUsers[0].user1 === userid) targetUser = targetUsers[0].user2;
      else targetUser = targetUsers[0].user1;

      const timestamp = getTimestampInSQLFormat();

      // Check for Messaging spam by checking message count in past 2 minutes
      const [lastMessages] = await db.query("SELECT * FROM together_messages WHERE userid = ? AND timestamp > UTC_TIMESTAMP() - INTERVAL 2 MINUTE ORDER BY timestamp DESC LIMIT 4", [userid]);
    
      if (lastMessages.length >= 4) {
        const difference = new Date() - new Date(lastMessages[lastMessages.length - 1].timestamp);
        const secondsRemaining = Math.floor((120000 - difference) / 1000)
        const output = `You are sending messages too fast. Please wait ${secondsRemaining} seconds. Please do not attempt to spam.`;

        // Deny user's message
        io.to(socket.id).emit("message-denied", output);

        // Add violation to user
        await db.query("INSERT INTO violations (content, violation_type, timestamp, violatorid, reporterid) VALUES(?, ?, ?, ?, ?)", [text, "attempted_pm_spam", timestamp, userid, targetUser]);
        // Check violations 
        await checkPrivateMessageSpamViolations(userid);

        // Early return
        return;
      }

      // Check flagged words
      if (containsFlagWords(text)) {
        await db.query("INSERT INTO violations (content, violation_type, timestamp, violatorid) VALUES(?, ?, ?, ?)", [text, 'flagged_word', timestamp, userid]);
        await checkFlaggedWordsViolations(userid);
        io.to(socket.id).emit("message-denied", "Your message contains flagged word(s). Please revise your message.");
        return;
      }

      // Add message
      await db.query("INSERT INTO together_messages (sessionid, userid, timestamp, text) VALUES(?, ?, ?, ?)", [sessionid, userid, timestamp, text]);

      // Add notification
      await db.query("INSERT INTO notifications (receiverid, timestamp, type, seen, senderid) VALUES(?, ?, ?, ?, ?)", [targetUser, timestamp, "message", 0, userid]);

      // Retrieve message
      const [messages] = await db.query(`
        SELECT together_messages.*, user.username, user.avatar FROM together_messages JOIN user ON together_messages.userid = user.userid WHERE together_messages.sessionid = ? ORDER BY timestamp DESC LIMIT 1`, [sessionid]);

      const message = messages[0];


      // Output the message to the session
      console.log("Emittng message back to users");
      io.to(room).emit("receive-message", message);
    })

    
  });
}

module.exports = {
  setupSocket,
}