const express = require("express");
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware for user registration
const validateRegister = [
    body("username").trim().isLength({ min:3 }).withMessage("Username must be at least 3 characters long"),
    // body("email").isEmail().withMessage('Invalid email address'),
    body("password").isLength({ min:8 }).withMessage("Password must be at least 8 characters long"),

];

router.put("/update", validateRegister, authMiddleware,userController.updateUser);
router.patch("/assign-role", userController.assignRole);

module.exports = router;