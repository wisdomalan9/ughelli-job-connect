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
      return res.status(400).json({
        success: false,
        message: "Type and amount required.",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
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
    console.error("CREATE PAYMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment.",
    });
  }
};

/* =========================
   MY PAYMENTS
========================= */
const myPayments = async (req, res) => {
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
    console.error("MY PAYMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
    });
  }
};

/* =========================
   ALL PAYMENTS (ADMIN)
========================= */
const allPayments = async (req, res) => {
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
    console.error("ALL PAYMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
    });
  }
};

/* =========================
   APPROVE PAYMENT (FINAL)
========================= */
const approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (payment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Already approved.",
      });
    }

    if (payment.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected payment cannot be approved.",
      });
    }

    /* =========================
       UPDATE PAYMENT
    ========================= */
    payment.status = "approved";
    payment.approvedBy = req.user._id;
    payment.approvedAt = new Date();
    payment.isRevenueCounted = true;

    await payment.save();

    /* =========================
       UPDATE USER (SAFE + FINAL)
    ========================= */
    const user = await User.findById(payment.userId);

    if (user) {
      const rawPlan =
        (payment.planName || payment.type || "").toLowerCase();

      let plan = null;
      let duration = 30;
      let isElite = false;

      if (rawPlan.includes("plus")) {
        plan = "plus";
      }

      if (rawPlan.includes("premium")) {
        plan = "premium";
      }

      if (rawPlan.includes("elite")) {
        plan = "premium"; // IMPORTANT: elite uses premium plan
        duration = 60;
        isElite = true;
      }

      if (plan) {
        const now = new Date();
        const expiry = new Date(
          now.getTime() + duration * 24 * 60 * 60 * 1000
        );

        user.premiumPlan = plan;
        user.premiumExpiresAt = expiry;

        // SAFE increment
        user.freeApplicationsLeft =
          (user.freeApplicationsLeft || 0) +
          (plan === "plus" ? 10 : 25);

        if (isElite) {
          user.eliteVerified = true;
        }

        await user.save();
      }
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
    console.error("APPROVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve payment.",
    });
  }
};

/* =========================
   REJECT PAYMENT
========================= */
const rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (payment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Approved payment cannot be rejected.",
      });
    }

    payment.status = "rejected";
    payment.rejectionReason = req.body.reason || "Rejected";

    await payment.save();

    res.json({
      success: true,
      message: "Payment rejected.",
    });
  } catch (error) {
    console.error("REJECT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject payment.",
    });
  }
};

/* =========================
   PAYMENT STATS
========================= */
const paymentStats = async (req, res) => {
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
    console.error("STATS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load stats.",
    });
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
