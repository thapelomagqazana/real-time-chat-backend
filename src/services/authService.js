const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");

exports.generateToken = (user) => {
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey,
        {expiresIn: '1h',
    });
    return token;
};