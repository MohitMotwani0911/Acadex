const Subject = require("../models/Subject");

// Create subject
const createSubject = async (req, res) => {
  try {
    const { name, code, description, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const subject = await Subject.create({
      name: name.trim(),
      code,
      description,
      color,
      user: req.userId,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error("Create subject error:", error);

    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

// Get single subject
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      subject,
    });
  } catch (error) {
    console.error("Get subject error:", error);

    res.status(500).json({
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

// Update subject
const updateSubject = async (req, res) => {
  try {
    const { name, code, description, color } = req.body;

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    if (name !== undefined) {
      subject.name = name.trim();
    }

    if (code !== undefined) {
      subject.code = code;
    }

    if (description !== undefined) {
      subject.description = description;
    }

    if (color !== undefined) {
      subject.color = color;
    }

    await subject.save();

    res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error("Update subject error:", error);

    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

// Delete subject
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};