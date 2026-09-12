const express = require("express");

const {
  uploadNote,
  getNotes,
  getSubjectNotes,
  getNote,
  deleteNote,
} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadNote");

const router = express.Router();

// Upload a PDF note
router.post(
  "/",
  protect,
  upload.single("file"),
  uploadNote
);

// Get all notes
router.get(
  "/",
  protect,
  getNotes
);

// Get notes for a particular subject
router.get(
  "/subject/:subjectId",
  protect,
  getSubjectNotes
);

// Get a single note
router.get(
  "/:id",
  protect,
  getNote
);

// Delete a note
router.delete(
  "/:id",
  protect,
  deleteNote
);

module.exports = router;