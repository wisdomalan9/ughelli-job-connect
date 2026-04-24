const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   REQUIRE LOGIN
========================= */
const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User not found.",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message:
          "Account suspended.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
};

/* =========================
   ROLE GUARD FACTORY
========================= */
const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized.",
      });
    }

    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access forbidden.",
      });
    }

    next();
  };

/* Specific helpers */
const adminOnly =
  allowRoles("admin");

const employerOnly =
  allowRoles("employer");

const seekerOnly =
  allowRoles("seeker");

module.exports = {
  protect,
  allowRoles,
  adminOnly,
  employerOnly,
  seekerOnly,
};
