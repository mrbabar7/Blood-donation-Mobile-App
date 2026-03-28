const { DonationRequest } = require("../../models/formModel");

const checkActiveDonation = async (req, res) => {
  try {
    const activeRequest = await DonationRequest.findOne({
      donorId: req.user._id,
      status: "accepted",
    });

    if (activeRequest) {
      return res.status(200).json({ hasActive: true });
    }

    res.status(200).json({ hasActive: false });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { checkActiveDonation };
