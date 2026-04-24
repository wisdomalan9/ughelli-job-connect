const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: [
        "admin",
        "employer",
        "seeker",
      ],
      default: "seeker",
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    businessName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    freeApplicationsLeft: {
      type: Number,
      default: 3,
    },

    premiumPlan: {
      type: String,
      enum: [
        "free",
        "plus",
        "premium",
      ],
      default: "free",
      index: true,
    },

    premiumExpiresAt: {
      type: Date,
      default: null,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    employerBadge: {
      type: String,
      default:
        "New Employer",
    },

    jobsPostedCount: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isSuspended: {
      type: Boolean,
      default: false,
      index: true,
    },

    suspensionReason: {
      type: String,
      default: "",
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */

/* admin users list */
userSchema.index({
  createdAt: -1,
});

/* role filter */
userSchema.index({
  role: 1,
  createdAt: -1,
});

/* verified employers */
userSchema.index({
  role: 1,
  isVerified: 1,
});

/* account moderation */
userSchema.index({
  isSuspended: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    "User",
    userSchema
  );
