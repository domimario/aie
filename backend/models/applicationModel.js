const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    projectTitle: { type: String, required: true },
    description: { type: String, required: true, minlength: 100 },

    innovationFields: {
      type: [String],
      required: true,
      enum: [
        "Fusha e Arsimit, Sportit dhe Politikës së Jashtme",
        "Fusha e Buqësisë, Veterinarisë dhe Zhvillim Rural",
        "Fusha e Drejtësisë dhe Sigurisë",
        "Fusha e Financave Publike",
        "Fusha e Infrastrukturës dhe Energjisë",
        "Fusha e Shëndetësisë dhe mbrojtja sociale",
        "Fusha e Turizmit dhe Mjedisit",
        "Fusha e Zhvillimit Ekonomik, Kulturor, Inovacion",
        "Fusha nën Përgjegjesinë e Kryeministrit",
      ],
    },

    ageGroup: {
      type: String,
      required: true,
      enum: ["Nxënës (15-18)", "Studentë (19-24)", "Profesionistë (25-29)"],
    },

    municipality: { type: String, required: true },

    documents: {
      type: [String], // URLs for uploaded documents (max 5)
      validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
    },

    prototypeUrl: { type: String, required: false },

    status: {
      type: String,
      enum: [
        "I Ri",
        "Në Progres",
        "Në Mentorim",
        "Në Prezantim",
        "Në Implementim",
        "Zbatuar",
      ],
      default: "I Ri",
    },

    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    notes: [
      {
        text: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        fromRole: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        suggestedStatus: {
          type: String,
          enum: [
            "Në Progres",
            "Në Mentorim",
            "Në Prezantim",
            "Në Implementim",
            "Zbatuar",
          ],
          default: null,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null if public (not logged in) submission
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("Application", applicationSchema);
