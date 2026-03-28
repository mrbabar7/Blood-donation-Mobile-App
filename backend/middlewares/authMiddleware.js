const jwt = require("jsonwebtoken");
const userModel = require("../models/userMode");

const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No session found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    const user = await userModel.findById(decoded.id);

    if (!user || user.token !== token) {
      res.clearCookie("token");
      return res
        .status(401)
        .json({ success: false, message: "Session expired in DB" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ success: false, message: "Token Expired" });
  }
};

const optionalProtect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    const user = await userModel.findById(decoded.id);

    if (!user || user.token !== token) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { protect, optionalProtect };
