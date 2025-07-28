const Application = require('../models/applicationModel');

const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      projectTitle,
      description,
      innovationFields,
      ageGroup,
      municipality,
      documents,
      prototypeUrl,
    } = req.body;

    // Basic validations
    if (
      !fullName || !email || !phone || !projectTitle || !description ||
      !innovationFields || !ageGroup || !municipality
    ) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (description.length < 100) {
      return res.status(400).json({ message: 'Description must be at least 100 characters' });
    }

    if (documents && documents.length > 5) {
      return res.status(400).json({ message: 'You can upload up to 5 documents only' });
    }

    // Create application, no user attached since public submit
    const application = new Application({
      fullName,
      email,
      phone,
      projectTitle,
      description,
      innovationFields,
      ageGroup,
      municipality,
      documents,
      prototypeUrl,
      status: 'I Ri',
      createdBy: null, // public submission
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Private route: Executive 
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('assignedExpert', 'name email')
      .populate('notes.user', 'name role');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Private route: Get application by ID
// Ekspert can only get assigned applications, Executive can get all
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('assignedExpert', 'name email')
      .populate('notes.user', 'name role');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (
      req.user.role === 'Ekspert' &&
      (!application.assignedExpert || application.assignedExpert._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Access denied: Not assigned to this application' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Private route: Executive - Update status
const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
  
    try {
      if (user.role !== 'Executive') {
        return res.status(403).json({ message: 'Vetëm Ekzekutivi mund të ndryshojë statusin.' });
      }
  
      const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
      if (!application) return res.status(404).json({ message: 'Aplikimi nuk u gjet.' });
  
      res.json(application);
    } catch (err) {
      res.status(500).json({ message: 'Gabim serveri.' });
    }
  };

// Private route: Executive - Assign expert to application
const assignExpert = async (req, res) => {
  try {
    const { expertId } = req.body;
    const application = await Application.findById(req.params.id);
    

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.assignedExpert = expertId;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Private route: Ekspert - Get applications assigned to logged-in ekspert
const getMyApplications = async (req, res) => {
    try {
      console.log('Logged-in Ekspert ID (req.user._id):', req.user._id);
  
      const apps = await Application.find({
        assignedExpert: req.user._id
      }).populate('notes.user', 'name role');
  
      console.log('Number of applications found:', apps.length);
  
      res.json(apps);
    } catch (error) {
      console.error('Error in getMyApplications:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Private route: Ekspert - Add or update notes on assigned application
const addNote = async (req, res) => {
    const { id } = req.params;
    const { text, suggestedStatus } = req.body;  // we add suggestedStatus as optional
    const user = req.user;
  
    try {
      const application = await Application.findById(id);
      if (!application) return res.status(404).json({ message: 'Aplikimi nuk u gjet.' });
  
      const note = {
        text,
        user: user._id,
        fromRole: user.role,
        createdBy: user._id,
        suggestedStatus: suggestedStatus || null,
        date: new Date()
      };
  
      application.notes.push(note);
      await application.save();
  
      res.status(200).json(application.notes);
    } catch (err) {
      console.error('Gabim në addNote:', err);
      res.status(500).json({ message: 'Gabim serveri.' });
    }
  };
  

  const editNote = async (req, res) => {
    const { applicationId, noteId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
  
    try {
      const application = await Application.findById(applicationId);
      if (!application) return res.status(404).json({ message: 'Application not found' });
  
      const note = application.notes.id(noteId);
      if (!note) return res.status(404).json({ message: 'Note not found' });
  
      // Kontrolli i aksesit
      if (userRole === 'Ekspert' && !note.user.equals(userId)) {
        return res.status(403).json({ message: 'Eksperti mund të ndryshojë vetëm shënimet që ka krijuar vetë' });
      }
  
      // Update
      note.text = text;
      note.date = new Date();
  
      await application.save();
      res.status(200).json({ message: 'Nota u përditësua me sukses', note });
    } catch (error) {
      console.error('Gabim në editNote:', error);
      res.status(500).json({ message: 'Gabim në server' });
    }
  };

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  assignExpert,
  getMyApplications,
  addNote,
  editNote
};
