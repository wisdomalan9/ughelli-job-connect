const mongoose = require("mongoose");

const applicationSchema =
  new mongoose.Schema(
    {
      jobId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true,
      },

      seekerId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      employerId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      applicationLetter: {
        type: String,
        default: "",
      },

      cvFile: {
        type: String,
        default: "",
      },

      shortMessage: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        default:
          "submitted",
        index: true,
      },

      interviewDate: {
        type: Date,
        default: null,
      },

      interviewLocation: {
        type: String,
        default: "",
      },

      interviewNote: {
        type: String,
        default: "",
      },

      employerNote: {
        type: String,
        default: "",
      },

      rejectionReason: {
        type: String,
        default: "",
      },

      attendedInterview: {
        type: Boolean,
        default: false,
      },

      markedNoShow: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

/* =========================
   UNIQUE DUPLICATE BLOCK
========================= */
applicationSchema.index(
  {
    jobId: 1,
    seekerId: 1,
  },
  {
    unique: true,
  }
);

/* seeker dashboard */
applicationSchema.index({
  seekerId: 1,
  createdAt: -1,
});

/* employer dashboard */
applicationSchema.index({
  employerId: 1,
  createdAt: -1,
});

/* status filtering */
applicationSchema.index({
  employerId: 1,
  status: 1,
});

module.exports =
  mongoose.model(
    "Application",
    applicationSchema
  );
