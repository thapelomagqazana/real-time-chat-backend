const express = require("express");
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const { mongoURI } = require("./config/config");
const morgan = require("morgan");
const cors = require("cors");

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Morgan for logging HTTP requests in the console
app.use(morgan("dev"))
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Routes
app.use("/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = app;