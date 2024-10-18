// server.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes
const userRoutes = require('./routes/user.routes');

require('dotenv').config();


// middleware
const app = express();
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/user", userRoutes);

const PORT = process.env.PORT || 8000;
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});