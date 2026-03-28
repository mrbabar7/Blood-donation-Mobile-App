const { Donor } = require("../../models/formModel");
const User = require("../../models/userMode");

const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Donor.findOneAndDelete({ userId: req.user.id });
    res.json({ success: true, message: "Donor profile deleted successfully" });
  } catch (err) {
    console.error("Delete Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { deleteProfile };
