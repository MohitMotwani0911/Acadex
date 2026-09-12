const Schedule = require("../models/Schedule");
const Subject = require("../models/Subject");

// Create schedule entry
const createSchedule = async (req, res) => {
  try {
    const {
      title,
      subject,
      dayOfWeek,
      startTime,
      endTime,
      room,
      type,
      description,
    } = req.body;

    if (
      !title ||
      !subject ||
      !dayOfWeek ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "Title, subject, day, start time and end time are required.",
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

    const schedule = await Schedule.create({
      title,
      subject,
      dayOfWeek,
      startTime,
      endTime,
      room,
      type,
      description,
      user: req.userId,
    });

    const populatedSchedule =
      await Schedule.findById(
        schedule._id
      ).populate(
        "subject",
        "name code color"
      );

    res.status(201).json({
      message:
        "Schedule created successfully.",
      schedule: populatedSchedule,
    });
  } catch (error) {
    console.error(
      "Create schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create schedule.",
      error: error.message,
    });
  }
};

// Get all schedule entries
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      user: req.userId,
    })
      .populate(
        "subject",
        "name code color"
      )
      .sort({
        dayOfWeek: 1,
        startTime: 1,
      });

    res.status(200).json({
      schedules,
    });
  } catch (error) {
    console.error(
      "Get schedules error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch schedules.",
      error: error.message,
    });
  }
};

// Get single schedule entry
const getSchedule = async (req, res) => {
  try {
    const schedule =
      await Schedule.findOne({
        _id: req.params.id,
        user: req.userId,
      }).populate(
        "subject",
        "name code color"
      );

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    res.status(200).json({
      schedule,
    });
  } catch (error) {
    console.error(
      "Get schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch schedule.",
      error: error.message,
    });
  }
};

// Update schedule entry
const updateSchedule = async (req, res) => {
  try {
    const {
      title,
      subject,
      dayOfWeek,
      startTime,
      endTime,
      room,
      type,
      description,
    } = req.body;

    const schedule =
      await Schedule.findOne({
        _id: req.params.id,
        user: req.userId,
      });

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    // If subject is being changed,
    // verify that it belongs to current user
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

      schedule.subject = subject;
    }

    if (title !== undefined) {
      schedule.title = title;
    }

    if (dayOfWeek !== undefined) {
      schedule.dayOfWeek = dayOfWeek;
    }

    if (startTime !== undefined) {
      schedule.startTime = startTime;
    }

    if (endTime !== undefined) {
      schedule.endTime = endTime;
    }

    if (room !== undefined) {
      schedule.room = room;
    }

    if (type !== undefined) {
      schedule.type = type;
    }

    if (description !== undefined) {
      schedule.description =
        description;
    }

    await schedule.save();

    const updatedSchedule =
      await Schedule.findById(
        schedule._id
      ).populate(
        "subject",
        "name code color"
      );

    res.status(200).json({
      message:
        "Schedule updated successfully.",
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error(
      "Update schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update schedule.",
      error: error.message,
    });
  }
};

// Delete schedule entry
const deleteSchedule = async (req, res) => {
  try {
    const schedule =
      await Schedule.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      });

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    res.status(200).json({
      message:
        "Schedule deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete schedule error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete schedule.",
      error: error.message,
    });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};