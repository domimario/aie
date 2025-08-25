const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  createExpert,
  getAllExperts
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser); // only creates Executive
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.post("/create-expert", protect, authorize("Executive"), createExpert);
router.get("/experts", protect, getAllExperts);

module.exports = router;
