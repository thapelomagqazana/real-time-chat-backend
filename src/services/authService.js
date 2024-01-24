const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");

exports.generateToken = (user) => {
    const token = jwt.sign({ sub: user._id }, secretKey, { expiresIn: "1h" });
    return token;
};