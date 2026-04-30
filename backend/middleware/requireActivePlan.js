const User = require("../models/User");

/* =========================
   REQUIRE ACTIVE PLAN
========================= */
const requireActivePlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    /* =========================
       FREE USERS (LIMITED ACCESS)
    ========================= */
    if (user.premiumPlan === "free") {
      if (user.freeApplicationsLeft <= 0) {
        return res.status(403).json({
          success: false,
          message:
            "You have reached your free limit. Upgrade to continue applying.",
        });
      }

      return next();
    }

    /* =========================
       PREMIUM USERS
    ========================= */
    if (user.premiumExpiresAt) {
      const now = new Date();

      if (user.premiumExpiresAt < now) {
        return res.status(403).json({
          success: false,
          message:
            "Your plan has expired. Please upgrade to continue.",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Plan check error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = requireActivePlan;
