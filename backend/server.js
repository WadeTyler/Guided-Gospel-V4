// server.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Cron Jobs
const resetRates = require('./lib/cronjobs/resetRates');

// Routes
const userRoutes = require('./routes/user.routes');
const sessionRoutes = require('./routes/session.routes');
const messageRoutes = require('./routes/message.routes');
const aiRoutes = require('./routes/ai.routes');
const verseRoutes = require('./routes/verses.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const bibleRoutes = require('./routes/bible/bible.routes');
const adminRoutes = require('./routes/admin.routes');

require('dotenv').config();

// middleware
const app = express();
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


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

resetRates();

const PORT = process.env.PORT || 8000;
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});