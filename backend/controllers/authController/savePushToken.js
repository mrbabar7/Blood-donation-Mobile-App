// controllers/authController/savePushToken.js
const jwt = require("jsonwebtoken");
const userModel = require("../../models/userMode");

const savePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    // Support token from Headers or Cookies
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    if (!pushToken) {
      return res
        .status(400)
        .json({ success: false, message: "pushToken is required" });
    }

    await userModel.findByIdAndUpdate(decoded.id, { pushToken });

    return res.status(200).json({
      success: true,
      message: "Push token updated successfully",
    });
  } catch (err) {
    console.error("Save Push Token Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to save push token" });
  }
};

module.exports = savePushToken;
