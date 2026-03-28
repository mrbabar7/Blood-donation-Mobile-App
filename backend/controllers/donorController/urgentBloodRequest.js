const { Donor, DonationRequest } = require("../../models/formModel");

exports.urgentBloodRequest = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const donor = await Donor.findOne({ userId });

    if (!donor)
      return res.status(404).json({ message: "Donor profile not found" });

    const requests = await DonationRequest.find({
      donorId: donor._id,
      status: "pending",
    }).populate("seekerId", "name address");

    const requestsWithDetails = await Promise.all(
      requests.map(async (reqItem) => {
        const seekerDonorProfile = await Donor.findOne({
          userId: reqItem.seekerId?._id,
        }).select("fullName district");

        const itemObj = reqItem.toObject();

        return {
          ...itemObj,
          seekerId: {
            fullName:
              seekerDonorProfile?.fullName ||
              reqItem.seekerId?.name ||
              "Blood Seeker",
            district:
              seekerDonorProfile?.district ||
              reqItem.seekerId?.address ||
              "Location Not Set",
          },
        };
      }),
    );

    res.status(200).json(requestsWithDetails);
  } catch (error) {
    console.error("Donor Request Error:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
};
