const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    salary: {
      type: String,
      default: "Negotiable",
    },

    jobType: {
      type: String,
      default: "full-time",
    },

    experienceLevel: {
      type: String,
      default: "none",
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    applicationRequirement: {
      type: String,
      default: "any",
    },

    maxApplicants: {
      type: Number,
      default: 100,
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },

    pricePaid: {
      type: Number,
      default: 2000,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    featuredUntil: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      default: "active",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    expiresAt: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setDate(
          d.getDate() + 14
        );
        return d;
      },
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   COMPOUND INDEXES
========================= */

/* public jobs listing */
jobSchema.index({
  status: 1,
  isFeatured: -1,
  createdAt: -1,
});

/* employer dashboard */
jobSchema.index({
  employerId: 1,
  createdAt: -1,
});

/* text search */
jobSchema.index({
  title: "text",
  company: "text",
  category: "text",
  location: "text",
});

module.exports =
  mongoose.model(
    "Job",
    jobSchema
  );
