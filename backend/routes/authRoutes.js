const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/auth");

/* PUBLIC ROUTES */

router.post("/register", register);
router.post("/login", login);

/* PRIVATE ROUTES */

router.get("/me", protect, getProfile);

/* Update profile */
router.put("/update-profile", protect, updateProfile);

module.exports = router;
