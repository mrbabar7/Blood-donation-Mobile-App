// const BloodBankModel = require("../../models/bankModel");
// const User = require("../../models/userMode");
// const bcrypt = require("bcryptjs");

// const registerBank = async (req, res) => {
//   try {
//     const {
//       name,
//       orgType,
//       timing,
//       phone,
//       whatsapp,
//       category,
//       operatingDays,
//       website,
//       address,
//       formType,
//     } = req.body;

//     const existing = await BloodBankModel.findOne({
//       user: req.user.id,
//       formType,
//     });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: `You have already registered as a ${formType}`,
//       });
//     }

//     const newEntry = new BloodBankModel({
//       user: req.user.id,
//       name,
//       orgType,
//       timing,
//       phone,
//       whatsapp,
//       category,
//       operatingDays,
//       website,
//       address,
//       formType,
//     });

//     await newEntry.save();
//     res.status(201).json({ success: true, data: newEntry });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getBankByEmail = async (req, res) => {
//   try {
//     const type = req.query.type || "bloodbank";

//     const data = await BloodBankModel.findOne({
//       user: req.user.id,
//       formType: type,
//     });

//     if (!data)
//       return res
//         .status(404)
//         .json({ success: false, message: "Record not found" });
//     res.json({ success: true, data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateBank = async (req, res) => {
//   try {
//     const updated = await BloodBankModel.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true },
//     );
//     res.json({ success: true, data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const deleteBank = async (req, res) => {
//   try {
//     await BloodBankModel.findByIdAndDelete(req.params.id);

//     res.json({ success: true, message: "Deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { registerBank, getBankByEmail, updateBank, deleteBank };

const BloodBankModel = require("../../models/bankModel");

// Register a new Blood Bank facility
const registerBank = async (req, res) => {
  try {
    const {
      name,
      orgType,
      timing,
      phone,
      whatsapp,
      category,
      operatingDays,
      website,
      address,
      formType = "bloodbank",
    } = req.body;

    const newEntry = new BloodBankModel({
      user: req.user.id,
      name,
      orgType,
      timing,
      phone,
      whatsapp,
      category,
      operatingDays,
      website,
      address,
      formType,
    });

    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all blood bank facilities registered by the authenticated user
const getBankByEmail = async (req, res) => {
  try {
    const type = req.query.type || "bloodbank";

    const data = await BloodBankModel.find({
      user: req.user.id,
      formType: type,
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a specific blood bank facility owned by the user
const updateBank = async (req, res) => {
  try {
    const updated = await BloodBankModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Blood bank record not found or unauthorized.",
      });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a specific blood bank facility owned by the user
const deleteBank = async (req, res) => {
  try {
    const deleted = await BloodBankModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Blood bank record not found or unauthorized.",
      });
    }

    res.json({ success: true, message: "Blood bank deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerBank, getBankByEmail, updateBank, deleteBank };
