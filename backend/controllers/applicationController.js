const Application = require("../models/applicationModel");

const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      projectTitle,
      description,
      innovationFields,
      ageGroup,
      municipality,
      prototypeUrl,
    } = req.body;

    // Basic validations
    if (
      !firstName || !lastName || !email || !phone ||
      !projectTitle || !description || !innovationFields ||
      !ageGroup || !municipality
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (description.length < 100) {
      return res
        .status(400)
        .json({ message: "Description must be at least 100 characters" });
    }

    // Handle uploaded documents (via Multer)
    const documents = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    }));

    if (documents.length > 5) {
      return res
        .status(400)
        .json({ message: "You can upload up to 5 documents only" });
    }

    // Create new application
    const application = new Application({
      firstName,
      lastName,
      email,
      phone,
      projectTitle,
      description,
      innovationFields: Array.isArray(innovationFields)
        ? innovationFields
        : [innovationFields],
      ageGroup,
      municipality,
      prototypeUrl,
      documents,
      status: "I Ri",
      assignedExpert: null,
      createdBy: null, // public submission
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    console.error("Error in submitApplication:", error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------- Executive: Get All Applications -----------------
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("assignedExpert", "name email")
      .populate("notes.user", "name role");

    res.json(applications);
  } catch (error) {
    console.log("Error, Executive dont get allAplications");
    res.status(500).json({ message: error.message });
  }
};

// ----------------- Get Application by ID -----------------
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("assignedExpert", "name email")
      .populate("notes.user", "name role");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Ekspert can only view assigned applications
    if (
      req.user.role === "Ekspert" &&
      (!application.assignedExpert ||
        application.assignedExpert._id.toString() !== req.user._id.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: Not assigned to this application" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- Executive: Update Status -----------------
const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  try {
    if (user.role !== "Executive") {
      return res
        .status(403)
        .json({ message: "Vetëm Ekzekutivi mund të ndryshojë statusin." });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!application)
      return res.status(404).json({ message: "Aplikimi nuk u gjet." });

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
};

// ----------------- Executive: Assign Expert -----------------
const assignExpert = async (req, res) => {
  try {
    const { expertId } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.assignedExpert = expertId;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- Ekspert: Get My Applications -----------------
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      assignedExpert: req.user._id,
    }).populate("notes.user", "name role");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- Ekspert: Add Note -----------------
const addNote = async (req, res) => {
  const { id } = req.params; // application id
  const { text, suggestedStatus } = req.body;
  const user = req.user;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Shënimi nuk mund të jetë bosh." });
  }

  try {
    const application = await Application.findById(id);
    if (!application)
      return res.status(404).json({ message: "Aplikimi nuk u gjet." });

    const note = {
      text,
      user: user._id,
      fromRole: user.role,
      createdBy: user._id,
      suggestedStatus: suggestedStatus || null,
      date: new Date(),
    };

    application.notes.push(note);
    await application.save();

    res.status(201).json({ message: "Shënimi u shtua me sukses", note });
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
};

// ----------------- Edit Note -----------------
const editNote = async (req, res) => {
  const { id: applicationId, noteId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;
  const userRole = req.user.role;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Shënimi nuk mund të jetë bosh." });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application)
      return res.status(404).json({ message: "Aplikimi nuk u gjet." });

    const note = application.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Shënimi nuk u gjet." });

    // Ekspert can only edit their own notes
    if (userRole === "Ekspert" && !note.user.equals(userId)) {
      return res.status(403).json({
        message: "Eksperti mund të ndryshojë vetëm shënimet e veta",
      });
    }

    note.text = text;
    note.date = new Date();

    await application.save();
    res.status(200).json({ message: "Shënimi u përditësua me sukses", note });
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
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
  editNote,
};
