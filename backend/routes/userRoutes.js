// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  createExpert,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private
router.get("/profile", protect, getProfile);
router.post("/create-expert", protect, createExpert); // protected route

module.exports = router;
