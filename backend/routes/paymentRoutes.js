const express = require("express");
const router = express.Router();

/* =========================
   CONTROLLERS
========================= */
const {
  createPayment,
  myPayments,
  allPayments,
  approvePayment,
  rejectPayment,
  paymentStats,
} = require("../controllers/paymentController");

/* =========================
   MIDDLEWARE
========================= */
const {
  protect,
  adminOnly,
} = require("../middleware/auth");

const {
  upload,
  handleUploadError,
} = require("../middleware/upload");

/* =========================
   USER ROUTES
========================= */

/* Submit payment (WITH RECEIPT UPLOAD) */
router.post(
  "/",
  protect,
  upload.single("receipt"),
  handleUploadError,
  createPayment
);

/* My payment history */
router.get(
  "/my/list",
  protect,
  myPayments
);

/* =========================
   ADMIN ROUTES
========================= */

/* Finance stats */
router.get(
  "/admin/stats",
  protect,
  adminOnly,
  paymentStats
);

/* All payments */
router.get(
  "/admin/list",
  protect,
  adminOnly,
  allPayments
);

/* Approve payment */
router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approvePayment
);

/* Reject payment */
router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectPayment
);

module.exports = router;
