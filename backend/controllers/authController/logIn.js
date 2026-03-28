const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/userMode");
const { sendingEmail } = require("../../email-sender/emailService");
const {
  useTemplate,
} = require("../../email-sender/otpVerificationEmailTemplate");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ success: false, field: "email", message: "Email not found" });
    }

    if (!user.password && user.googleId) {
      return res.status(401).json({
        success: false,
        field: "email",
        message: "Please use 'Continue with Google' to log in.",
        isGoogleUser: true,
      });
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      const htmlContent = useTemplate
        .replace("{name}", user.name)
        .replace("{verificationCode}", otp);
      await sendingEmail(
        user.email,
        "🩸 BloodDonation  – Verify Your Account",
        htmlContent,
      );

      return res.status(401).json({
        success: false,
        message: "Email not verified. OTP sent.",
        notVerified: true,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        success: false,
        field: "password",
        message: "Invalid Password",
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" },
    );

    user.token = jwtToken;
    await user.save();

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = login;
