const NGO = require("../../models/ngoModel");
const User = require("../../models/userMode");
const bcrypt = require("bcryptjs");

exports.registerNGO = async (req, res) => {
  try {
    const email = req.user.email;
    const existing = await NGO.findOne({
      $or: [{ email: email }, { whatsapp: req.body.whatsapp }],
    });
    if (existing)
      return res
        .status(200)
        .json({ success: true, isExisting: true, data: existing });

    const newNGO = await NGO.create({ ...req.body, email });
    res.status(201).json({
      success: true,
      message: "NGO Registered Successfully",
      data: newNGO,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNGOByEmail = async (req, res) => {
  try {
    const data = await NGO.findOne({ email: req.user.email });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateNGO = async (req, res) => {
  try {
    const updated = await NGO.findOneAndUpdate(
      { _id: req.params.id, email: req.user.email },
      req.body,
      { new: true },
    );
    res
      .status(200)
      .json({ success: true, message: "NGO Profile Updated!", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteNGO = async (req, res) => {
  try {
    const deletedNGO = await NGO.findOneAndDelete({
      _id: req.params.id,
      email: req.user.email,
    });

    if (!deletedNGO) {
      return res.status(404).json({
        success: false,
        message: "NGO record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "NGO record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
