const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header('Authorization');

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);

    // Find the user in the database based on the decoded user ID
    // const user = await User.findById(decoded.sub);

    // Check if the user exists
    // if (!user) {
    //   return res.status(401).json({ error: 'Unauthorized - Invalid user' });
    // }

    // Attach the user object to the request for further use
    req.userId = decoded.userId;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;