const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  assignExpert,
  getMyApplications,
  addNote,
  editNote
} = require("../controllers/applicationController");

const { protect, authorize } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Public
router.post("/submit", upload.array("documents", 5), submitApplication);

// Ekspert-only
router.get("/my", protect, authorize("Ekspert"), getMyApplications);
router.post("/:id/add-note", protect, authorize("Ekspert"), addNote);
router.put("/:id/edit-note/:noteId", protect, authorize("Executive", "Ekspert"), editNote);

// Ekzekutiv-only
router.get("/", protect, authorize("Executive"), getAllApplications);
router.get("/:id", protect, authorize("Executive", "Ekspert"), getApplicationById);
router.put("/:id/status", protect, authorize("Executive"), updateApplicationStatus);
router.put("/:id/assign-expert", protect, authorize("Executive"), assignExpert);

module.exports = router;
