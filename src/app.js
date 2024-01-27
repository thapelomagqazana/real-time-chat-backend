const express = require("express");

const authRoutes = require("./routes/authRoutes");
const chatRoomRoutes = require("./routes/chatRoomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const morgan = require("morgan");
const cors = require("cors");

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
app.use("/message", messageRoutes);
app.use("/user", userRoutes);



module.exports = app;