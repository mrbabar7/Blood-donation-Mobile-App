// const Hospital = require("../../models/hospitalModel");
// const User = require("../../models/userMode");
// const bcrypt = require("bcryptjs");

// exports.registerHospital = async (req, res) => {
//   try {
//     const email = req.user.email;
//     const {
//       name,
//       phone,
//       orgType,
//       timing,
//       category,
//       website,
//       address,
//       operatingDays,
//       whatsapp,
//     } = req.body;

//     const existingHospital = await Hospital.findOne({
//       $or: [{ email: email }, { whatsapp: whatsapp }],
//     });

//     if (existingHospital) {
//       if (existingHospital.email !== email) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "This WhatsApp number is already registered with another account.",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         isExisting: true,
//         message: "Your hospital record already exists. Loading data...",
//         data: existingHospital,
//       });
//     }

//     const newHospital = await Hospital.create({
//       name,
//       email,
//       phone,
//       orgType,
//       timing,
//       category,
//       website,
//       address,
//       operatingDays,
//       whatsapp,
//     });

//     res.status(201).json({
//       success: true,
//       isExisting: false,
//       message: "Hospital Registered Successfully",
//       data: newHospital,
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.getHospitalByEmail = async (req, res) => {
//   try {
//     const email = req.user.email;
//     const hospital = await Hospital.findOne({ email });

//     if (!hospital) {
//       return res
//         .status(200)
//         .json({ success: false, message: "No record found" });
//     }
//     res.status(200).json({ success: true, data: hospital });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.updateHospital = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedHospital = await Hospital.findOneAndUpdate(
//       { _id: id, email: req.user.email },
//       updateData,
//       { new: true, runValidators: true },
//     );

//     if (!updatedHospital) {
//       return res.status(404).json({
//         success: false,
//         message: "Hospital not found or unauthorized",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully!",
//       data: updatedHospital,
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Update Failed", error: error.message });
//   }
// };

// exports.deleteHospital = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedHospital = await Hospital.findOneAndDelete({
//       _id: id,
//       email: req.user.email,
//     });

//     if (!deletedHospital) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Hospital record not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Hospital record deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Delete operation failed",
//       error: error.message,
//     });
//   }
// };

const Hospital = require("../../models/hospitalModel");

/**
 * Register a new hospital under the current user's account
 */
exports.registerHospital = async (req, res) => {
  try {
    const email = req.user.email;
    const {
      name,
      phone,
      orgType,
      timing,
      category,
      website,
      address,
      operatingDays,
      whatsapp,
    } = req.body;

    // Check if WhatsApp number is used by ANOTHER user account
    const existingWithWhatsapp = await Hospital.findOne({ whatsapp });
    if (existingWithWhatsapp && existingWithWhatsapp.email !== email) {
      return res.status(400).json({
        success: false,
        message:
          "This WhatsApp number is already registered under a different account.",
      });
    }

    // Create a new hospital entry for this user
    const newHospital = await Hospital.create({
      name,
      email,
      phone: phone || "",
      orgType,
      timing: timing || "24/7 Service Available",
      category: Array.isArray(category) ? category : [category],
      website: website || "",
      address,
      operatingDays: Array.isArray(operatingDays)
        ? operatingDays
        : [operatingDays],
      whatsapp,
    });

    res.status(201).json({
      success: true,
      message: "Hospital registered successfully!",
      data: newHospital,
    });
  } catch (error) {
    console.error("Hospital Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while registering hospital.",
      error: error.message,
    });
  }
};

/**
 * Get ALL hospitals registered by the currently logged-in user
 */
exports.getHospitalByEmail = async (req, res) => {
  try {
    const email = req.user.email;
    const hospitals = await Hospital.find({ email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    console.error("Fetch User Hospitals Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospitals.",
      error: error.message,
    });
  }
};

/**
 * Update a specific hospital record by ID
 */
exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedHospital = await Hospital.findOneAndUpdate(
      { _id: id, email: req.user.email },
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedHospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital record not found or unauthorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital record updated successfully!",
      data: updatedHospital,
    });
  } catch (error) {
    console.error("Hospital Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed.",
      error: error.message,
    });
  }
};

/**
 * Delete a specific hospital record by ID
 */
exports.deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHospital = await Hospital.findOneAndDelete({
      _id: id,
      email: req.user.email,
    });

    if (!deletedHospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital record not found or unauthorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hospital record deleted successfully.",
    });
  } catch (error) {
    console.error("Hospital Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Delete operation failed.",
      error: error.message,
    });
  }
};
