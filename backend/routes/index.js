const express = require("express");
const router = express.Router();

/* =========================
   MODULE ROUTES
========================= */
const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const paymentRoutes = require("./paymentRoutes");
const adminRoutes = require("./adminRoutes");

/* =========================
   HEALTH CHECK
========================= */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Ughelli Job Connect API Running",
    version: "1.0.0",
  });
});

/* =========================
   ROUTE MOUNTS
========================= */
router.use(
  "/auth",
  authRoutes
);

router.use(
  "/jobs",
  jobRoutes
);

router.use(
  "/applications",
  applicationRoutes
);

router.use(
  "/payments",
  paymentRoutes
);

router.use(
  "/admin",
  adminRoutes
);

/* =========================
   UNKNOWN API ROUTE
========================= */
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "API route not found.",
  });
});

module.exports =
  router;
