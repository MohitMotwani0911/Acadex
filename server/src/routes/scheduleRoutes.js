const express = require("express");

const {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create schedule entry
router.post("/", protect, createSchedule);

// Get all schedule entries
router.get("/", protect, getSchedules);

// Get single schedule entry
router.get("/:id", protect, getSchedule);

// Update schedule entry
router.put("/:id", protect, updateSchedule);

// Delete schedule entry
router.delete("/:id", protect, deleteSchedule);

module.exports = router;