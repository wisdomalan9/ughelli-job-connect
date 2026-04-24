const express = require("express");
const router = express.Router();

const {
  dashboard,
  listUsers,
  toggleSuspend,
  verifyUser,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/auth");

/* All admin routes protected */
router.use(
  protect,
  adminOnly
);

/* =========================
   DASHBOARD
========================= */
router.get(
  "/dashboard",
  dashboard
);

/* =========================
   USERS
========================= */

/* View all users */
router.get(
  "/users",
  listUsers
);

/* Suspend / Unsuspend */
router.put(
  "/users/:id/suspend",
  toggleSuspend
);

/* Verify user */
router.put(
  "/users/:id/verify",
  verifyUser
);

module.exports =
  router;
