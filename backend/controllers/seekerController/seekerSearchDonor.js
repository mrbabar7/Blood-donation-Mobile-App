const { Donor, DonationRequest } = require("../../models/formModel");

exports.searchDonors = async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { bloodType, district } = req.query;
    const today = new Date();

    let query = {
      userId: { $ne: currentUserId },
      $or: [{ nextAvailableDate: { $gt: today } }, { isAvailable: true }],
    };

    if (bloodType) query.bloodType = bloodType;
    if (district) query.district = district;

    const donors = await Donor.find(query);

    const donorsWithStatus = await Promise.all(
      donors.map(async (donor) => {
        const request = await DonationRequest.findOne({
          seekerId: currentUserId,
          donorId: donor._id,
        });

        let finalAvailability = donor.isAvailable;
        let daysRemaining = 0;

        if (donor.nextAvailableDate) {
          const nextDate = new Date(donor.nextAvailableDate);
          if (nextDate > today) {
            finalAvailability = false;
            const diffTime = nextDate - today;
            daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          } else if (donor.isAvailable === false && nextDate <= today) {
            finalAvailability = false;
          }
        }

        return {
          ...donor.toObject(),
          isAvailable: finalAvailability,
          daysRemaining: daysRemaining,
          requestStatus: request ? request.status : null,
          requestId: request ? request._id : null,
          mobileNumber:
            request && request.status === "accepted"
              ? donor.mobileNumber
              : null,
        };
      }),
    );

    res.status(200).json(donorsWithStatus);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};
