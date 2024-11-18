// server.js

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const {setupSocket} = require('./sockets/socketHandler');

// Cron Jobs
const resetRates = require('./lib/cronjobs/resetRates');
const resetDeletedEmails = require('./lib/cronjobs/resetDeletedEmails');

// Routes
const userRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');
const messageRoutes = require('./routes/message.routes');
const aiRoutes = require('./routes/ai.routes');
const verseRoutes = require('./routes/verses.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const bibleRoutes = require('./routes/bible/bible.routes');
const adminRoutes = require('./routes/admin.routes');
const postsRoutes = require('./routes/together/posts.routes');
const followsRoutes = require('./routes/together/follows.routes');
const notificationsRoutes = require('./routes/together/notifications.routes');
const togetherMessagesRoutes = require('./routes/together/messages.routes');


require('dotenv').config();

// middleware
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/verse", verseRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/bible", bibleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/together/posts", postsRoutes);
app.use("/api/together/follows", followsRoutes);
app.use("/api/together/notifications", notificationsRoutes);
app.use("/api/together/messages", togetherMessagesRoutes);

const staticPath = path.join(__dirname, "../frontend/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(staticPath));

  // Catch all for routing on the frontend
  app.get("*", (req, res) => {
      if (!req.path.includes(".")) {
        res.sendFile(path.resolve(staticPath, "index.html"));
      } else {
        res.status(404).send("Not Found");
      }
  })
}

// Reset Cron Jobs
resetRates();
resetDeletedEmails();





// Socket.io connect
setupSocket(io);

const PORT = process.env.PORT || 8000;
// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
