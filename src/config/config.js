require('dotenv').config();

module.exports = {
    secretKey: process.env.SECRET_KEY || "default_secret_key",
    mongoURI: process.env.MONGODB_URI
};