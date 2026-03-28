const { DonationRequest, Donor } = require("../../models/formModel");

exports.completeDonation = async (req, res) => {
  try {
    const { requestId, rating } = req.body;

    const request = await DonationRequest.findById(requestId);
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });

    const donor = await Donor.findById(request.donorId);
    if (!donor)
      return res
        .status(404)
        .json({ success: false, message: "Donor not found." });

    const today = new Date();
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + 90);

    donor.isAvailable = false;
    donor.lastDonationDate = today;
    donor.nextAvailableDate = nextDate;

    const oldTotal = donor.totalRatings || 0;
    const oldRating = donor.rating || 0;
    const newTotalRatings = oldTotal + 1;
    const newAverageRating =
      (oldRating * oldTotal + Number(rating)) / newTotalRatings;

    donor.livesSaved = (donor.livesSaved || 0) + 1;
    donor.rating = newAverageRating;
    donor.totalRatings = newTotalRatings;

    await donor.save();

    request.status = "completed";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Hero status updated! Donor is now on a 90-day recovery break.",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
