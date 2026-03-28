const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodType: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
    livesSaved: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    lastDonationDate: { type: Date, default: null },
    nextAvailableDate: { type: Date, default: null },
  },
  { timestamps: true },
);

const requestSchema = new mongoose.Schema(
  {
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    requestedBloodType: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    expireAt: { type: Date, default: null },
  },
  { timestamps: true },
);
requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const Donor = mongoose.model("Donor", donorSchema);
const DonationRequest = mongoose.model("DonationRequest", requestSchema);

module.exports = { Donor, DonationRequest };
