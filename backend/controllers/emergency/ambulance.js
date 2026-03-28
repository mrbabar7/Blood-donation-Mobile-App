const AmbulanceModel = require("../../models/ambulanceModel");
const User = require("../../models/userMode");
const bcrypt = require("bcryptjs");

const registerAmbulance = async (req, res) => {
  try {
    const existing = await AmbulanceModel.findOne({
      user: req.user.id,
      formType: "ambulance",
    });
    if (existing)
      return res.status(400).json({
        success: false,
        message: "Ambulance service already registered",
      });

    const newEntry = new AmbulanceModel({ ...req.body, user: req.user.id });
    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAmbulanceData = async (req, res) => {
  try {
    const data = await AmbulanceModel.findOne({
      user: req.user.id,
      formType: "ambulance",
    });
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "No service found" });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAmbulance = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await AmbulanceModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAmbulance = async (req, res) => {
  try {
    const ambulance = await AmbulanceModel.findById(req.params.id);
    if (!ambulance) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    await AmbulanceModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerAmbulance,
  getAmbulanceData,
  updateAmbulance,
  deleteAmbulance,
};
