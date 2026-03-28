const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    formType: { type: String, default: "ambulance" },
    name: { type: String, required: true, trim: true },
    orgType: { type: String, required: true },
    timing: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    category: { type: [String], required: true },
    operatingDays: { type: [String], required: true },
    website: { type: String, default: "" },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ambulance", AmbulanceSchema);
