const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  assignExpert,
  getMyApplications,
  addNote,
  editNote
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public (no auth)
router.post('/submit', submitApplication);

// Ekspert-only
router.get('/my', protect, authorize('Ekspert'), getMyApplications);
router.post('/:id/notes', protect, authorize('Ekspert'), addNote);

// Ekzekutiv-only
router.get('/', protect, authorize('Executive'), getAllApplications);
router.get('/:id', protect, authorize('Executive', 'Ekspert'), getApplicationById);
router.put('/:id/status', protect, authorize('Executive'), updateApplicationStatus);
router.put('/:id/assign-expert', protect, authorize('Executive'), assignExpert);

router.put( '/edit-note/:applicationId/:noteId',protect, authorize('Executive', 'Ekspert'), editNote );
  
module.exports = router;
