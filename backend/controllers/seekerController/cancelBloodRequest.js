const { DonationRequest, Donor } = require("../../models/formModel");
const userModel = require("../../models/userMode");
const {
  createNotification,
} = require("../donor&seekerController/Notification");

exports.cancelRequest = async (req, res) => {
  try {
    const { donorId } = req.params;
    const seekerId = req.user.id || req.user._id;

    const deletedRequest = await DonationRequest.findOneAndDelete({
      donorId,
      seekerId,
      status: "pending",
    });

    if (!deletedRequest) {
      return res.status(404).json({ message: "No pending request found" });
    }

    const seeker = await userModel.findById(seekerId);
    const donor = await Donor.findById(donorId).populate("userId");

    const io = req.app.get("socketio");

    if (donor && seeker) {
      await createNotification(
        donor.userId._id,
        `Blood Request Cancelled: ${seeker.name} has cancelled their blood request.Please wait for new Request.`,
        "/dashboard/donor-requests",
        io,
      );
    }

    res
      .status(200)
      .json({ message: "Request cancelled successfully and donor notified" });
  } catch (error) {
    console.error("Cancel Request Error:", error);
    res
      .status(500)
      .json({ message: "Failed to cancel request", error: error.message });
  }
};
