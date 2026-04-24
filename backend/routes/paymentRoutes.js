const express = require("express");
const router = express.Router();

const {
  createPayment,
  myPayments,
  allPayments,
  approvePayment,
  rejectPayment,
  paymentStats,
} = require("../controllers/paymentController");

const {
  protect,
  adminOnly,
} = require("../middleware/auth");

/* =========================
   USER ROUTES
========================= */

/* Submit payment */
router.post(
  "/",
  protect,
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

module.exports =
  router;
