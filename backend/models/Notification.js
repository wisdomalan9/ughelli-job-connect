const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    /* =========================
       OWNER
    ========================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* =========================
       CONTENT
    ========================= */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    /* =========================
       TYPE SYSTEM (IMPORTANT)
    ========================= */
    type: {
      type: String,
      enum: [
        "payment",
        "application",
        "system",
        "job",
        "admin",
      ],
      default: "system",
      index: true,
    },

    /* =========================
       STATUS
    ========================= */
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =========================
       OPTIONAL LINKING
    ========================= */
    link: {
      type: String,
      default: "",
    },

    /* =========================
       METADATA (FUTURE SAFE)
    ========================= */
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES (IMPORTANT FOR SCALE)
========================= */

// Fast user notification lookup
notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

// Unread count optimization
notificationSchema.index({
  userId: 1,
  isRead: 1,
});

// Type filtering
notificationSchema.index({
  type: 1,
  createdAt: -1,
});

/* =========================
   AUTO CLEANUP (OPTIONAL FUTURE)
========================= */
// You can later enable TTL cleanup like:
// notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
