const mongoose = require("mongoose");
const { mongoURI } = require("./config/config");
const app = require("./app");


const PORT = process.env.PORT || 3000;



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