const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/auth");

/* =========================
   PUBLIC ROUTES
========================= */

/* Register user */
router.post(
  "/register",
  register
);

/* Login user */
router.post(
  "/login",
  login
);

/* =========================
   PRIVATE ROUTES
========================= */

/* Current logged-in user */
router.get(
  "/me",
  protect,
  getProfile
);

module.exports =
  router;
