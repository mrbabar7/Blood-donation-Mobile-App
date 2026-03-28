const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" },
    );

    user.token = jwtToken;
    user
      .save()
      .then(() => {
        res.cookie("token", jwtToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
        });

        const frontendURL =
          process.env.NODE_ENV === "production"
            ? "https://pakblood.vercel.app"
            : "http://localhost:5173";

        res.redirect(`${frontendURL}/google-auth-success`);
      })
      .catch((err) => {
        console.error("Token Save Error:", err);
        res.redirect(`${frontendURL}/login?error=token_save_failed`);
      });
  },
);

module.exports = router;
