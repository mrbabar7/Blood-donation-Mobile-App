const bcrypt = require("bcrypt");
const userModel = require("../../models/userMode");
const { sendingEmail } = require("../../email-sender/emailService");
const {
  useTemplate,
} = require("../../email-sender/otpVerificationEmailTemplate");

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Signup data is:", name, email, password);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "User already exists",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password is required and must be at least 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    const subject = "🩸 BloodDonation  – Verify Your Account";
    const htmlContent = useTemplate
      .replace("{name}", name)
      .replace("{verificationCode}", otp);

    await sendingEmail(email, subject, htmlContent);

    res.status(200).json({
      success: true,
      message: "Signup Successfully! Please check your email for OTP.",
      email: email,
    });
  } catch (err) {
    console.error("SignUp Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};

module.exports = signUp;
