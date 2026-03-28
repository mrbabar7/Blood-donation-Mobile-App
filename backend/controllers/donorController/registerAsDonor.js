const { Donor } = require("../../models/formModel");

exports.registerAsDonor = async (req, res) => {
  try {
    const userIdFromToken = req.user.id || req.user._id;
    const existingDonor = await Donor.findOne({ userId: userIdFromToken });
    if (existingDonor)
      return res.status(400).json({ message: "Already registered!" });
    const newDonor = new Donor({ ...req.body, userId: userIdFromToken });
    await newDonor.save();
    res
      .status(201)
      .json({ success: true, message: "Profile created", newDonor });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};
