const Exam = require("../models/Exam");
const Subject = require("../models/Subject");

// Create exam
const createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      examDate,
      startTime,
      duration,
      room,
      totalMarks,
      status,
      notes,
    } = req.body;

    if (
      !title ||
      !subject ||
      !examDate ||
      !startTime ||
      !duration
    ) {
      return res.status(400).json({
        message:
          "Title, subject, exam date, start time and duration are required.",
      });
    }

    // Verify subject belongs to current user
    const existingSubject =
      await Subject.findOne({
        _id: subject,
        user: req.userId,
      });

    if (!existingSubject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    const exam = await Exam.create({
      title,
      subject,
      examDate,
      startTime,
      duration,
      room,
      totalMarks,
      status,
      notes,
      createdBy: req.userId,
    });

    const populatedExam =
      await Exam.findById(exam._id).populate(
        "subject",
        "name code color"
      );

    res.status(201).json({
      message: "Exam created successfully.",
      exam: populatedExam,
    });
  } catch (error) {
    console.error("Create exam error:", error);

    res.status(500).json({
      message: "Failed to create exam.",
      error: error.message,
    });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({
      createdBy: req.userId,
    })
      .populate("subject", "name code color")
      .sort({
        examDate: 1,
        startTime: 1,
      });

    res.status(200).json({
      exams,
    });
  } catch (error) {
    console.error("Get exams error:", error);

    res.status(500).json({
      message: "Failed to fetch exams.",
      error: error.message,
    });
  }
};

// Get single exam
const getExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    }).populate(
      "subject",
      "name code color"
    );

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      exam,
    });
  } catch (error) {
    console.error("Get exam error:", error);

    res.status(500).json({
      message: "Failed to fetch exam.",
      error: error.message,
    });
  }
};

// Update exam
const updateExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      examDate,
      startTime,
      duration,
      room,
      totalMarks,
      status,
      notes,
    } = req.body;

    const exam = await Exam.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    // Verify new subject ownership
    if (subject) {
      const existingSubject =
        await Subject.findOne({
          _id: subject,
          user: req.userId,
        });

      if (!existingSubject) {
        return res.status(404).json({
          message: "Subject not found.",
        });
      }

      exam.subject = subject;
    }

    if (title !== undefined) {
      exam.title = title;
    }

    if (examDate !== undefined) {
      exam.examDate = examDate;
    }

    if (startTime !== undefined) {
      exam.startTime = startTime;
    }

    if (duration !== undefined) {
      exam.duration = duration;
    }

    if (room !== undefined) {
      exam.room = room;
    }

    if (totalMarks !== undefined) {
      exam.totalMarks = totalMarks;
    }

    if (status !== undefined) {
      exam.status = status;
    }

    if (notes !== undefined) {
      exam.notes = notes;
    }

    await exam.save();

    const updatedExam =
      await Exam.findById(exam._id).populate(
        "subject",
        "name code color"
      );

    res.status(200).json({
      message: "Exam updated successfully.",
      exam: updatedExam,
    });
  } catch (error) {
    console.error("Update exam error:", error);

    res.status(500).json({
      message: "Failed to update exam.",
      error: error.message,
    });
  }
};

// Delete exam
const deleteExam = async (req, res) => {
  try {
    const exam =
      await Exam.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.userId,
      });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    res.status(200).json({
      message: "Exam deleted successfully.",
    });
  } catch (error) {
    console.error("Delete exam error:", error);

    res.status(500).json({
      message: "Failed to delete exam.",
      error: error.message,
    });
  }
};

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
};