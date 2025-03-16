// External modules --
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Local module used --
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Route - accesed only logged-in users --
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user });
});

// User Signup - Registration --
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input --
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists --
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password Hashing --
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user --
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT Token --
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token, userId: user._id });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login --
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input --
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists --
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Account not exists, signup first" });
    }

    // Compare password --
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token --
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;