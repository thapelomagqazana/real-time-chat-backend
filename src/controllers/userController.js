const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authService = require("../services/authService");

exports.registerUser = async (req, res) => {
    try
    {
        const { username, password } = req.body;

        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });  
    }
    catch (error)
    {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.loginUser = async (req, res) => {
    try
    {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user)
        {
           return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
        {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = authService.generateToken(user);

        res.status(200).json({ token });
    }
    catch (error)
    {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};