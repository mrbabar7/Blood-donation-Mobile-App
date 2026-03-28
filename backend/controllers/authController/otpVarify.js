const { sendingEmail } = require("../../email-sender/emailService");
const {
  useTemplate,
} = require("../../email-sender/otpVerificationEmailTemplate");
const userModel = require("../../models/userMode");
const jwt = require("jsonwebtoken");

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, _id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "12h" },
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully!",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verify Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during verification" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const subject = "🩸 BloodDonation – New Verification Code";
    const htmlContent = useTemplate
      .replace("{name}", user.name)
      .replace("{verificationCode}", newOtp);

    await sendingEmail(email, subject, htmlContent);

    res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (err) {
    console.error("Resend Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during resend" });
  }
};

module.exports = { verifyOTP, resendOTP };
