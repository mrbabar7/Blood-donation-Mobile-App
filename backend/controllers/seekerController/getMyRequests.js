const { DonationRequest } = require("../../models/formModel");

exports.getMyRequests = async (req, res) => {
  try {
    const seekerId = req.user.id || req.user._id;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    await DonationRequest.updateMany(
      {
        seekerId,
        status: "pending",
        createdAt: { $lt: oneWeekAgo },
      },
      { status: "rejected" },
    );

    const requests = await DonationRequest.find({ seekerId })
      .populate(
        "donorId",
        "fullName bloodType district province mobileNumber profilePicture",
      )
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};
