const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Payment = require("../models/Payment");

/* =========================
   DASHBOARD STATS
========================= */
const dashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployers = await User.countDocuments({ role: "employer" });
    const totalSeekers = await User.countDocuments({ role: "seeker" });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });

    const totalApplications = await Application.countDocuments();

    const pendingPayments = await Payment.countDocuments({
      status: "pending",
    });

    const approved = await Payment.find({ status: "approved" });

    const revenue = approved.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalEmployers,
        totalSeekers,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingPayments,
        revenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   LIST USERS
========================= */
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SUSPEND / UNSUSPEND
========================= */
const toggleSuspend = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    /* Prevent admin suspending self */
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot suspend yourself.");
    }

    user.isSuspended = !user.isSuspended;

    user.suspensionReason = user.isSuspended
      ? req.body.reason || "Suspended by admin"
      : "";

    await user.save();

    res.json({
      success: true,
      message: user.isSuspended
        ? "User suspended."
        : "User restored.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   VERIFY / UNVERIFY USER
========================= */
const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    user.isVerified = !user.isVerified;

    await user.save();

    res.json({
      success: true,
      message: user.isVerified
        ? "User verified."
        : "Verification removed.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   MAKE ADMIN
========================= */
const makeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (user.role === "admin") {
      return res.json({
        success: true,
        message: "User is already admin.",
      });
    }

    user.role = "admin";

    await user.save();

    res.json({
      success: true,
      message: "User promoted to admin.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  listUsers,
  toggleSuspend,
  verifyUser,
  makeAdmin,
};
