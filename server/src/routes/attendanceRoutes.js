const express = require("express");

const {
  markAttendance,
  getSubjectAttendance,
  getAttendanceSummary,
  getAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All attendance routes require authentication
router.use(protect);

// Create or update attendance
router.post("/", markAttendance);

// Get attendance summary for all subjects
router.get("/summary", getAttendanceSummary);

// Get attendance for a particular subject
router.get(
  "/subject/:subjectId",
  getSubjectAttendance
);

// Get a single attendance record
router.get("/:id", getAttendance);

// Delete attendance record
router.delete("/:id", deleteAttendance);

module.exports = router;