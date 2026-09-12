const Note = require("../models/Note");
const Subject = require("../models/Subject");
const fs = require("fs");
const path = require("path");

// Upload a note
const uploadNote = async (req, res) => {
  try {
    const { topic, subject } = req.body;

    // Validate required fields
    if (!topic || !subject) {
      // If a file was uploaded but validation failed,
      // remove it so we don't leave unused files.
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Topic and subject are required.",
      });
    }

    // Make sure a PDF was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required.",
      });
    }

    // Make sure subject belongs to current user
    const existingSubject = await Subject.findOne({
      _id: subject,
      user: req.userId,
    });

    if (!existingSubject) {
      // Remove uploaded file if subject is invalid
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    // Create note record
    const note = await Note.create({
      topic,
      subject,
      fileName: req.file.originalname,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      user: req.userId,
    });

    // Populate subject information
    const populatedNote = await Note.findById(
      note._id
    ).populate(
      "subject",
      "name code color"
    );

    res.status(201).json({
      message: "Note uploaded successfully.",
      note: populatedNote,
    });
  } catch (error) {
    console.error("Upload note error:", error);

    // Remove uploaded file if database operation fails
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (fileError) {
        console.error(
          "Failed to remove uploaded file:",
          fileError
        );
      }
    }

    res.status(500).json({
      message: "Failed to upload note.",
      error: error.message,
    });
  }
};

// Get all notes for current user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.userId,
    })
      .populate(
        "subject",
        "name code color"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error(
      "Get notes error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch notes.",
      error: error.message,
    });
  }
};

// Get notes for a particular subject
const getSubjectNotes = async (
  req,
  res
) => {
  try {
    const { subjectId } = req.params;

    // Verify subject ownership
    const subject = await Subject.findOne({
      _id: subjectId,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    const notes = await Note.find({
      user: req.userId,
      subject: subjectId,
    })
      .populate(
        "subject",
        "name code color"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      subject,
      notes,
    });
  } catch (error) {
    console.error(
      "Get subject notes error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch subject notes.",
      error: error.message,
    });
  }
};

// Get a single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate(
      "subject",
      "name code color"
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    res.status(200).json({
      note,
    });
  } catch (error) {
    console.error(
      "Get note error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch note.",
      error: error.message,
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    // Build the actual file path
    const fileName = path.basename(
      note.fileUrl
    );

    const filePath = path.join(
      __dirname,
      "../uploads/notes",
      fileName
    );

    // Delete physical PDF
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await Note.findByIdAndDelete(
      note._id
    );

    res.status(200).json({
      message:
        "Note deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete note error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete note.",
      error: error.message,
    });
  }
};

module.exports = {
  uploadNote,
  getNotes,
  getSubjectNotes,
  getNote,
  deleteNote,
}; 