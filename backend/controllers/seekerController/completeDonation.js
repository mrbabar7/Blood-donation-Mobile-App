const { DonationRequest, Donor } = require("../../models/formModel");
const { createNotification } = require("../notificationController");

exports.completeDonation = async (req, res) => {
  try {
    const seekerId = req.user.id || req.user._id;
    const { requestId, rating = 5 } = req.body;

    const request = await DonationRequest.findById(requestId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found." });
    }

    if (request.seekerId.toString() !== seekerId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action." });
    }

    const donor = await Donor.findById(request.donorId).populate("userId");
    if (!donor) {
      return res
        .status(404)
        .json({ success: false, message: "Donor not found." });
    }

    // 1. Calculate recovery dates (90-day break)
    const today = new Date();
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + 90);

    donor.isAvailable = false;
    donor.lastDonationDate = today;
    donor.nextAvailableDate = nextDate;

    // 2. Recalculate average rating
    const numericRating = Math.min(5, Math.max(1, Number(rating)));
    const oldTotal = donor.totalRatings || 0;
    const oldRating = donor.rating || 0;
    const newTotalRatings = oldTotal + 1;
    const newAverageRating =
      (oldRating * oldTotal + numericRating) / newTotalRatings;

    donor.livesSaved = (donor.livesSaved || 0) + 1;
    donor.rating = parseFloat(newAverageRating.toFixed(2));
    donor.totalRatings = newTotalRatings;
    await donor.save();

    // 3. Mark request as completed & rated
    request.status = "completed";
    request.isRated = true;
    request.rating = numericRating;
    request.completedAt = today;
    await request.save();

    // 4. Notify Donor
    if (donor.userId) {
      await createNotification({
        userId: donor.userId._id,
        message: `Donation Complete! You were rated ${numericRating} ⭐. Thank you for saving a life!`,
        link: "/dashboard",
        data: { screen: "DonorDashboard" },
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Donation completed! Donor rated and put on 90-day recovery status.",
      request,
    });
  } catch (error) {
    console.error("Complete Donation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
