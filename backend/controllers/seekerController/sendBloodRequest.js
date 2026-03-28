const { DonationRequest, Donor } = require("../../models/formModel");
const userModel = require("../../models/userMode");
const { sendingEmail } = require("../../email-sender/emailService");
const {
  requestTemplate,
} = require("../../email-sender/donorRequestEmailTemplate");
const {
  createNotification,
} = require("../donor&seekerController/Notification");

require("dotenv").config();

const BACKEND_SERVER = process.env.BACKEND_SERVER;

exports.sendBloodRequest = async (req, res) => {
  try {
    const seekerId = req.user.id || req.user._id;
    const { donorId } = req.params;
    const { requestedBloodType } = req.body;

    const existing = await DonationRequest.findOne({
      seekerId,
      donorId,
      status: "pending",
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Already requested" });

    const donor = await Donor.findById(donorId).populate("userId");
    const seeker = await userModel.findById(seekerId);

    if (!donor)
      return res
        .status(404)
        .json({ success: false, message: "Donor not found" });

    const newRequest = new DonationRequest({
      seekerId,
      donorId,
      requestedBloodType,
      status: "pending",
    });
    const savedRequest = await newRequest.save();

    const io = req.app.get("socketio");

    await createNotification(
      donor.userId._id,
      `Urgent Blood Requirement! ${seeker.name} is in critical need.Plese accept this Request`,
      "/dashboard/donor-requests",
      io,
    );

    const baseUrl = `${BACKEND_SERVER}/api/donors/respond-email`;
    const acceptLink = `${baseUrl}/${savedRequest._id}/accept`;
    const rejectLink = `${baseUrl}/${savedRequest._id}/reject`;

    const subject = `🩸 Urgent: Blood Request from ${seeker.name}`;
    const emailHtml = requestTemplate
      .replace("{donorName}", donor.fullName)
      .replace("{seekerName}", seeker.name)
      .replace("{bloodType}", requestedBloodType)
      .replace("{location}", `${donor.district}, ${donor.province}`)
      .replace("{acceptLink}", acceptLink)
      .replace("{rejectLink}", rejectLink);

    await sendingEmail(donor.userId.email, subject, emailHtml);

    res.status(200).json({
      success: true,
      message: "Request sent! Donor notified via Dashboard & Email.",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Send Request Error:", error);
    res.status(500).json({ success: false, message: "Request failed" });
  }
};
