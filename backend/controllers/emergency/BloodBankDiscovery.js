// const BloodBank = require("../../models/bankModel");

// const getBloodBanks = async (req, res) => {
//   try {
//     const banks = await BloodBank.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       count: banks.length,
//       data: banks,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Server Error: Data fetch nahi ho saka",
//       error: err.message,
//     });
//   }
// };

// module.exports = { getBloodBanks };

const BloodBank = require("../../models/bankModel");

const getBloodBanks = async (req, res) => {
  try {
    const banks = await BloodBank.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banks.length,
      data: banks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch blood bank directory data.",
      error: err.message,
    });
  }
};

module.exports = { getBloodBanks };
