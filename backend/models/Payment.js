const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
      index: true,
    },

    applicationId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    type: {
      type: String,
      required: true,
      index: true,
    },

    planName: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "NGN",
    },

    method: {
      type: String,
      default:
        "bank_transfer",
    },

    reference: {
      type: String,
      default: "",
    },

    receiptImage: {
      type: String,
      default: "",
    },

    payerName: {
      type: String,
      default: "",
    },

    payerPhone: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "pending",
      index: true,
    },

    approvedBy: {
      type:
        mongoose.Schema.Types.ObjectId,
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
   INDEXES
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

module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );
