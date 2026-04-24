const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJob,
  myJobs,
  updateStatus,
  renewJob,
} = require("../controllers/jobController");

const {
  protect,
  employerOnly,
} = require("../middleware/auth");

/* =========================
   PUBLIC ROUTES
========================= */

/* All active jobs */
router.get(
  "/",
  getJobs
);

/* Single job details */
router.get(
  "/:id",
  getJob
);

/* =========================
   EMPLOYER ROUTES
========================= */

/* Create vacancy */
router.post(
  "/",
  protect,
  employerOnly,
  createJob
);

/* My posted jobs */
router.get(
  "/my/list",
  protect,
  employerOnly,
  myJobs
);

/* Update status:
   active / paused / closed
*/
router.put(
  "/:id/status",
  protect,
  employerOnly,
  updateStatus
);

/* Renew listing */
router.put(
  "/:id/renew",
  protect,
  employerOnly,
  renewJob
);

module.exports =
  router;
