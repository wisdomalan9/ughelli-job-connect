const express = require("express");
const router = express.Router();

const {
  applyJob,
  myApplications,
  getApplicants,
  updateStatus,
  inviteInterview,
} = require("../controllers/applicationController");

const {
  protect,
  seekerOnly,
  employerOnly,
} = require("../middleware/auth");

/* =========================
   SEEKER ROUTES
========================= */

/* Apply to a job */
router.post(
  "/apply/:jobId",
  protect,
  seekerOnly,
  applyJob
);

/* My applications */
router.get(
  "/my/list",
  protect,
  seekerOnly,
  myApplications
);

/* =========================
   EMPLOYER ROUTES
========================= */

/* All applicants for this employer */
router.get(
  "/employer/list",
  protect,
  employerOnly,
  getApplicants
);

/* Update applicant status */
router.put(
  "/:id/status",
  protect,
  employerOnly,
  updateStatus
);

/* Invite interview */
router.put(
  "/:id/interview",
  protect,
  employerOnly,
  inviteInterview
);

module.exports =
  router;
