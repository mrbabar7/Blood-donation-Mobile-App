const mongoose = require("mongoose");

const NGOSchema = new mongoose.Schema({
  name: { type: String, required: [true, "NGO name is required"], trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  orgType: {
    type: String,
    required: true,
    enum: ["Registered NGO", "Trust", "Foundation", "Volunteer Group"],
  },
  timing: { type: String, required: true },
  operatingDays: { type: [String], required: true },
  whatsapp: { type: String, required: true },
  category: { type: [String], required: true },
  website: { type: String, default: "" },
  address: { type: String, required: true },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NGO", NGOSchema);
