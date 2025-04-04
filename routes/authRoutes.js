const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("../models/Users.js");
const { isLoggedIn } = require("../controller/authController.js");
const dotenv = require("dotenv").config();
const { promisify } = require("util");
const cookieParser = require("cookie-parser");
const router = express.Router();
app.use(cookieParser());

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      return res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create user." });
    }
  } catch (err) {
    console.error("Registration error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT secret missing",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    
    res
  .cookie('token', jwtToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'None', 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
  .json({ message: 'Login successful' });

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// LOGOUT ROUTE
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
});

//CreateUser

// AUTHENTICATED USER ROUTE
router.get("/", isLoggedIn, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
