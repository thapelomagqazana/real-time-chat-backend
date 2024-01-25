const express = require("express");

// const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");

const morgan = require("morgan");
const cors = require("cors");

// dotenv.config();

const app = express();

// Middleware
app.use(express.json());
// Morgan for logging HTTP requests in the console
app.use(morgan("dev"))
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/chatroom", chatRoomRoutes);



module.exports = app;