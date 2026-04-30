const User = require("../models/User");

/* =========================
   CHECK PLAN EXPIRY
========================= */
const checkPlanExpiry = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const user = await User.findById(req.user._id);

    if (!user) return next();

    /* =========================
       NO PLAN → SKIP
    ========================= */
    if (!user.premiumExpiresAt) return next();

    const now = new Date();

    /* =========================
       PLAN STILL ACTIVE
    ========================= */
    if (user.premiumExpiresAt > now) {
      return next();
    }

    /* =========================
       PLAN EXPIRED → DOWNGRADE
    ========================= */
    user.premiumPlan = "free";
    user.premiumExpiresAt = null;

    user.eliteVerified = false;

    /* Reset usage limits safely */
    user.freeApplicationsLeft = 3;

    await user.save();

    console.log(
      `⚠️ Plan expired → user downgraded: ${user.email}`
    );

    next();
  } catch (error) {
    console.error("Expiry check error:", error);
    next();
  }
};

module.exports = checkPlanExpiry;
