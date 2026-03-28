const { Donor, DonationRequest } = require("../../models/formModel");

exports.getDonorDetailsForSeeker = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.donorId);
    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
