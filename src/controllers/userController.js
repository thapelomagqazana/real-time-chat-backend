const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const authService = require("../services/authService");

exports.registerUser = async (req, res) => {
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

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
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }
        
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

exports.updateUser = async (req, res) => {
    try
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;

        const { username, password } = req.body;

        const user = await User.findById(userId);

        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        // Update username if provided 
        if (username)
        {
            user.username = username;
        }

        // Update password if provided
        if (password)
        {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (error)
    {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.assignRole = async (req, res) => {
    try
    {
        const {userId, role} = req.body;

        const user = await User.findById(userId);

        if (!user)
        {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: "Role assigned successfully", user });
    }
    catch (error)
    {
        console.error("Error assigning role:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};