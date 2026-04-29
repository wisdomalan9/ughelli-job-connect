const express = require("express");
const router = express.Router();

const {
  dashboard,
  listUsers,
  toggleSuspend,
  verifyUser,
  makeAdmin,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/auth");

/* Protect all admin routes */
router.use(protect, adminOnly);

/* =========================
   DASHBOARD
========================= */
router.get("/dashboard", dashboard);

/* =========================
   USERS
========================= */
router.get("/users", listUsers);

router.put("/users/:id/suspend", toggleSuspend);

router.put("/users/:id/verify", verifyUser);

router.put("/users/:id/make-admin", makeAdmin);

module.exports = router;
