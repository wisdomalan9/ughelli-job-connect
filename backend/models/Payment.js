const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
      index: true,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    /* =========================
       PAYMENT TYPE
    ========================= */
    type: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    planName: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================
       FINANCIAL
    ========================= */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    method: {
      type: String,
      default: "bank_transfer",
    },

    reference: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================
       RECEIPT (IMPORTANT)
    ========================= */
    receiptImage: {
      type: String,
      default: "",
    },

    /* =========================
       PAYER DETAILS
    ========================= */
    payerName: {
      type: String,
      default: "",
      trim: true,
    },

    payerPhone: {
      type: String,
      default: "",
      trim: true,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },

    /* =========================
       STATUS
    ========================= */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    /* =========================
       ADMIN ACTION
    ========================= */
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    isRevenueCounted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES (PERFORMANCE)
========================= */

/* user history */
paymentSchema.index({
  userId: 1,
  createdAt: -1,
});

/* admin queue */
paymentSchema.index({
  status: 1,
  createdAt: -1,
});

/* revenue reporting */
paymentSchema.index({
  status: 1,
  amount: 1,
});

/* type analytics */
paymentSchema.index({
  type: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Payment", paymentSchema);
