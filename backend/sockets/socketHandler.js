
const { Server } = require("socket.io");
const db = require('../db/db');
const { getTimestampInSQLFormat } = require("../lib/utils/sqlFormatting");


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
      
      if (sessionid === "") {
        return;
      }
      else {
        // Add message
        const timestamp = getTimestampInSQLFormat();
        await db.query("INSERT INTO together_messages (sessionid, userid, timestamp, text) VALUES(?, ?, ?, ?)", [sessionid, userid, timestamp, text]);

        // Add notification
        const [targetUsers] = await db.query("SELECT user1, user2 FROM together_sessions WHERE sessionid = ?", [sessionid]);
        var targetUser;        
        if (targetUsers[0].user1 === userid) targetUser = targetUsers[0].user2;
        else targetUser = targetUsers[0].user1;

        await db.query("INSERT INTO notifications (receiverid, timestamp, type, seen, senderid) VALUES(?, ?, ?, ?, ?)", [targetUser, timestamp, "message", 0, userid]);

        // Retrieve message
        const [messages] = await db.query(`
          SELECT together_messages.*, user.username, user.avatar FROM together_messages JOIN user ON together_messages.userid = user.userid WHERE together_messages.sessionid = ? ORDER BY timestamp DESC LIMIT 1`, [sessionid]);

        const message = messages[0];

        console.log("Receiving Message: ", message);
        io.to(room).emit("receive-message", message);
      }
    })

    
  });
}

module.exports = {
  setupSocket,
}