
const { Server } = require("socket.io");

const connectedUsers = new Map();

const setupSocket = (io) => {
  console.log("Setting up socket");

  io.on("connection", (socket) => {

    console.log(socket.connected);

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

    
  });
}

module.exports = {
  setupSocket,
}