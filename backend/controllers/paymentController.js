const Payment = require("../models/Payment");
const User = require("../models/User");
const Job = require("../models/Job");

/* =========================
   CREATE PAYMENT
========================= */
const createPayment = async (req, res, next) => {
  try {
    const {
      type,
      amount,
      planName,
      reference,
      payerName,
      payerPhone,
      note,
      jobId,
    } = req.body;

    if (!type || !amount) {
      res.status(400);
      throw new Error("Type and amount required.");
    }

    if (Number(amount) <= 0) {
      res.status(400);
      throw new Error("Invalid amount.");
    }

    const payment = await Payment.create({
      userId: req.user._id,
      type,
      amount: Number(amount),
      planName: planName || "",
      reference: reference || "",
      payerName: payerName || "",
      payerPhone: payerPhone || "",
      note: note || "",
      jobId: jobId || null,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment submitted for review.",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   MY PAYMENTS
========================= */
const myPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   ALL PAYMENTS (ADMIN)
========================= */
const allPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "fullName email role premiumPlan")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   APPROVE PAYMENT
========================= */
const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error("Payment not found.");
    }

    if (payment.status === "approved") {
      res.status(400);
      throw new Error("Already approved.");
    }

    if (payment.status === "rejected") {
      res.status(400);
      throw new Error("Rejected payment cannot be approved.");
    }

    payment.status = "approved";
    payment.approvedBy = req.user._id;
    payment.approvedAt = new Date();
    payment.isRevenueCounted = true;

    await payment.save();

    const user = await User.findById(payment.userId);

    /* =========================
       PREMIUM LOGIC (UPDATED)
    ========================= */
    if (user && payment.type.startsWith("premium")) {
      let plan = "free";
      let duration = 30;

      if (payment.type === "premium_plus") {
        plan = "plus";
      }

      if (payment.type === "premium_pro") {
        plan = "premium";
      }

      if (payment.type === "premium_elite") {
        plan = "elite";
        duration = 60;
      }

      const now = new Date();
      const expiry = new Date(
        now.getTime() + duration * 24 * 60 * 60 * 1000
      );

      user.premiumPlan = plan;
      user.premiumExpiresAt = expiry;

      await user.save();
    }

    /* =========================
       JOB LOGIC
    ========================= */
    if (payment.type === "job_post" && payment.jobId) {
      await Job.findByIdAndUpdate(payment.jobId, {
        status: "active",
      });
    }

    if (payment.type === "featured_job" && payment.jobId) {
      const until = new Date();
      until.setDate(until.getDate() + 7);

      await Job.findByIdAndUpdate(payment.jobId, {
        isFeatured: true,
        featuredUntil: until,
      });
    }

    res.json({
      success: true,
      message: "Payment approved and user upgraded.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   REJECT PAYMENT
========================= */
const rejectPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error("Payment not found.");
    }

    if (payment.status === "approved") {
      res.status(400);
      throw new Error("Approved payment cannot be rejected.");
    }

    payment.status = "rejected";
    payment.rejectionReason = req.body.reason || "Rejected";

    await payment.save();

    res.json({
      success: true,
      message: "Payment rejected.",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   PAYMENT STATS
========================= */
const paymentStats = async (req, res, next) => {
  try {
    const approved = await Payment.find({ status: "approved" });

    const pending = await Payment.countDocuments({
      status: "pending",
    });

    const rejected = await Payment.countDocuments({
      status: "rejected",
    });

    const revenue = approved.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    res.json({
      success: true,
      stats: {
        revenue,
        approved: approved.length,
        pending,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  myPayments,
  allPayments,
  approvePayment,
  rejectPayment,
  paymentStats,
};
