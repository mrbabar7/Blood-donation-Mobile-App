const { Donor, DonationRequest } = require("../../models/formModel");

const bell = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.json({ isDonor: false, count: 0, hasPendingRequests: false });
    }

    const requestCount = await DonationRequest.countDocuments({
      donorId: donor._id,
      status: "pending",
    });

    res.json({
      isDonor: true,
      count: requestCount,
      emailAlerts: donor.emailAlerts,
      appNotifications: donor.appNotifications,
      isAvailable: donor.isAvailable,
    });
  } catch (err) {
    console.error("Error in Bell Controller:", err);
    res.status(500).json({ isDonor: false, count: 0 });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { field, value } = req.body;
    const updatedDonor = await Donor.findOneAndUpdate(
      { userId: req.user.id },
      { [field]: value },
      { new: true },
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor record not found" });
    }

    res.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    console.error("Update Settings Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { bell, updateSettings };
