// const Hospital = require("../../models/hospitalModel");

// const getHospitals = async (req, res) => {
//   try {
//     const hospitals = await Hospital.find();
//     res.json({ success: true, data: hospitals });
//   } catch (err) {
//     console.error("Error fetching hospitals:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// module.exports = { getHospitals };

const Hospital = require("../../models/hospitalModel");

/**
 * Fetch all hospitals for public browsing/discovery
 */
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getHospitals };
