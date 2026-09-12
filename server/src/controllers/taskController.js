const Task = require("../models/Task");
const Subject = require("../models/Subject");

// Create task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      dueDate,
      priority,
      status,
    } = req.body;

    if (!title || !subject || !dueDate) {
      return res.status(400).json({
        message:
          "Title, subject and due date are required.",
      });
    }

    // Make sure subject belongs to current user
    const existingSubject = await Subject.findOne({
      _id: subject,
      user: req.userId,
    });

    if (!existingSubject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    const task = await Task.create({
      title,
      description,
      subject,
      dueDate,
      priority,
      status,
      createdBy: req.userId,
    });

    const populatedTask = await Task.findById(
      task._id
    ).populate("subject", "name code color");

    res.status(201).json({
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Failed to create task.",
      error: error.message,
    });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.userId,
    })
      .populate("subject", "name code color")
      .sort({ dueDate: 1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks.",
      error: error.message,
    });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    }).populate("subject", "name code color");

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Failed to fetch task.",
      error: error.message,
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      dueDate,
      priority,
      status,
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    // If subject is being changed, verify ownership
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

      task.subject = subject;
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (status !== undefined) {
      task.status = status;
    }

    await task.save();

    const updatedTask = await Task.findById(
      task._id
    ).populate("subject", "name code color");

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task.",
      error: error.message,
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Failed to delete task.",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};