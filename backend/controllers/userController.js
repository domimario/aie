const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');


//generate token
const generateToken = (id) => {
  token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  console.log(token);
  return token;
  
};

//regist new user

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).json({ message: "User already Exists" });

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// authenticate user
const loginUser = async (req, res) => {
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
    res.status(401).json({ message: "Invalid email or pasword" });
  }
};

//get user profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};


//Create an Expert user (Only Executive)
const createExpert = asyncHandler(async (req, res) => {
    // Check if user is Executive
    if (req.user.role !== 'Executive') {
      res.status(403);
      throw new Error('Access denied. Only Executives can create experts.');
    }
  
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }
  
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    // Create user with role "Expert"
    const user = await User.create({
      name,
      email,
      password,
      role: 'Expert',
    });
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

module.exports = { registerUser, loginUser, getProfile , createExpert};
