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

    // 1. User existence check
    if (!user) {
      return res
        .status(403)
        .json({ success: false, field: "email", message: "Email not found" });
    }

    // 2. Google User check
    if (!user.password && user.googleId) {
      return res.status(401).json({
        success: false,
        field: "email",
        message: "Please use 'Continue with Google' to log in.",
        isGoogleUser: true,
      });
    }

    // 3. Verification check (Sending OTP)
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
        "🩸 BloodDonation – Verify Your Account",
        htmlContent,
      );

      return res.status(401).json({
        success: false,
        message: "Email not verified. OTP sent.",
        notVerified: true,
      });
    }

    // 4. Password check
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        success: false,
        field: "password",
        message: "Invalid Password",
      });
    }

    // 5. JWT Generation
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" },
    );

    // Optional: Save token to DB if you track active sessions
    user.token = jwtToken;
    await user.save();

    /* 6. COOKIE (Optional for mobile, but kept for compatibility)
       Since this is a dedicated mobile backend, cookies won't be used 
       by Expo, but keeping them doesn't hurt.
    */
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 7. RESPONSE (Crucial for Mobile)
    // We send the 'token' directly so Expo can save it via SecureStore
    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      token: jwtToken, // <--- EXPO NEEDS THIS
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
