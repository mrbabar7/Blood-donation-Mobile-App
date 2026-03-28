const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  formType: {
    type: String,
    default: "Hospital",
  },
  name: {
    type: String,
    required: [true, "Hospital name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  orgType: {
    type: String,
    required: true,
    enum: ["Private / Trust", "Government", "Semi-Government"],
  },
  timing: {
    type: String,
    required: true,
  },
  operatingDays: {
    type: [String],
    required: [true, "Operating days are required"],
  },
  phone: {
    type: String,
    required: false,
    default: "",
  },
  whatsapp: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  website: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hospital", HospitalSchema);
