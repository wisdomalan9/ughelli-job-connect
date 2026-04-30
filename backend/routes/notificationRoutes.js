const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

const {
  protect,
} = require("../middleware/auth");

/* =========================
   GET MY NOTIFICATIONS
========================= */
router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          userId: req.user._id,
        })
          .sort({ createdAt: -1 })
          .limit(50);

      res.json({
        success: true,
        count: notifications.length,
        notifications,
      });
    } catch (error) {
      console.error(
        "GET NOTIFICATIONS ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch notifications.",
      });
    }
  }
);

/* =========================
   UNREAD COUNT
========================= */
router.get(
  "/unread/count",
  protect,
  async (req, res) => {
    try {
      const count =
        await Notification.countDocuments({
          userId: req.user._id,
          isRead: false,
        });

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      console.error(
        "UNREAD COUNT ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get unread count.",
      });
    }
  }
);

/* =========================
   MARK ONE AS READ
========================= */
router.put(
  "/:id/read",
  protect,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user._id,
          },
          {
            isRead: true,
          },
          { new: true }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Notification marked as read.",
        notification,
      });
    } catch (error) {
      console.error(
        "MARK READ ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notification.",
      });
    }
  }
);

/* =========================
   MARK ALL AS READ
========================= */
router.put(
  "/read-all",
  protect,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          userId: req.user._id,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read.",
      });
    } catch (error) {
      console.error(
        "READ ALL ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notifications.",
      });
    }
  }
);

module.exports = router;
