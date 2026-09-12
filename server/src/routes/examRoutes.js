const express = require("express");

const {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createExam);

router.get("/", getExams);

router.get("/:id", getExam);

router.put("/:id", updateExam);

router.delete("/:id", deleteExam);

module.exports = router;