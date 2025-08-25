const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Public registration – only Executives
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Force role = Executive
  const role = "Executive";

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    message: "Executive account created successfully",
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Get profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

// Executive creates Ekspert
const createExpert = asyncHandler(async (req, res) => {
  if (req.user.role !== "Executive") {
    res.status(403);
    throw new Error("Access denied. Only Executives can create Experts.");
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "Ekspert", // force role
  });

  res.status(201).json({
    message: "Ekspert account created successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
  
});

const getAllExperts = asyncHandler(async (req, res) => {
  if (req.user.role !== "Executive") {
    res.status(403);
    throw new Error("Access denied. Only Executives can see Experts.");
  }
  const experts = await User.find({ role: "Ekspert" }).select("name email _id");
  res.json(experts);
});


module.exports = { registerUser, loginUser, getProfile, createExpert, getAllExperts };
