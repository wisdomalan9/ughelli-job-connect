const Application = require("../models/Application");
const Job = require("../models/Job");

/* =========================
   APPLY TO JOB
========================= */
const applyJob = async (req, res, next) => {
  try {
    const seeker = req.user;

    const job = await Job.findById(
      req.params.jobId
    );

    if (!job) {
      res.status(404);
      throw new Error("Job not found.");
    }

    if (job.status !== "active") {
      res.status(400);
      throw new Error(
        "Job not accepting applications."
      );
    }

    if (
      job.expiresAt &&
      new Date(job.expiresAt) < new Date()
    ) {
      res.status(400);
      throw new Error(
        "Job has expired."
      );
    }

    if (
      job.applicantsCount >=
      job.maxApplicants
    ) {
      res.status(400);
      throw new Error(
        "Application limit reached."
      );
    }

    const exists =
      await Application.findOne({
        jobId: job._id,
        seekerId: seeker._id,
      });

    if (exists) {
      res.status(400);
      throw new Error(
        "You already applied."
      );
    }

    if (
      seeker.premiumPlan === "free" &&
      seeker.freeApplicationsLeft <= 0
    ) {
      res.status(403);
      throw new Error(
        "Free applications exhausted."
      );
    }

    const {
      applicationLetter,
      shortMessage,
      cvFile,
    } = req.body;

    const application =
      await Application.create({
        jobId: job._id,
        seekerId: seeker._id,
        employerId: job.employerId,
        applicationLetter:
          applicationLetter || "",
        shortMessage:
          shortMessage || "",
        cvFile: cvFile || "",
      });

    if (
      seeker.premiumPlan === "free"
    ) {
      seeker.freeApplicationsLeft -= 1;
      await seeker.save();
    }

    job.applicantsCount += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message:
        "Application submitted.",
      freeApplicationsLeft:
        seeker.freeApplicationsLeft,
      application,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SEEKER MY APPLICATIONS
========================= */
const myApplications =
  async (req, res, next) => {
    try {
      const apps =
        await Application.find({
          seekerId: req.user._id,
        })
          .populate(
            "jobId",
            "title company location salary status"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        count: apps.length,
        applications: apps,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================
   EMPLOYER APPLICANTS
========================= */
const getApplicants =
  async (req, res, next) => {
    try {
      const apps =
        await Application.find({
          employerId:
            req.user._id,
        })
          .populate(
            "seekerId",
            "fullName email phone premiumPlan"
          )
          .populate(
            "jobId",
            "title company"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        count: apps.length,
        applications: apps,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================
   UPDATE STATUS
========================= */
const updateStatus =
  async (req, res, next) => {
    try {
      const allowed = [
        "reviewing",
        "shortlisted",
        "hired",
        "rejected",
      ];

      if (
        !allowed.includes(
          req.body.status
        )
      ) {
        res.status(400);
        throw new Error(
          "Invalid status."
        );
      }

      const app =
        await Application.findOne({
          _id: req.params.id,
          employerId:
            req.user._id,
        });

      if (!app) {
        res.status(404);
        throw new Error(
          "Application not found."
        );
      }

      app.status =
        req.body.status;

      if (
        req.body.employerNote
      ) {
        app.employerNote =
          req.body.employerNote;
      }

      if (
        req.body.status ===
        "rejected"
      ) {
        app.rejectionReason =
          req.body.reason ||
          "Not selected";
      }

      await app.save();

      res.json({
        success: true,
        message:
          "Application updated.",
        application: app,
      });
    } catch (error) {
      next(error);
    }
  };

/* =========================
   INTERVIEW INVITE
========================= */
const inviteInterview =
  async (req, res, next) => {
    try {
      const {
        interviewDate,
        interviewLocation,
        interviewNote,
      } = req.body;

      if (
        !interviewDate ||
        !interviewLocation
      ) {
        res.status(400);
        throw new Error(
          "Date and location required."
        );
      }

      const app =
        await Application.findOne({
          _id: req.params.id,
          employerId:
            req.user._id,
        });

      if (!app) {
        res.status(404);
        throw new Error(
          "Application not found."
        );
      }

      app.status =
        "interview";
      app.interviewDate =
        interviewDate;
      app.interviewLocation =
        interviewLocation;
      app.interviewNote =
        interviewNote || "";

      await app.save();

      res.json({
        success: true,
        message:
          "Interview invite sent.",
        application: app,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  applyJob,
  myApplications,
  getApplicants,
  updateStatus,
  inviteInterview,
};
