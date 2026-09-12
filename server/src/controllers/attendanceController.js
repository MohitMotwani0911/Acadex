const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");

// Create or update attendance for a subject/date
const markAttendance = async (req, res) => {
  try {
    const { subject, date, status } = req.body;

    if (!subject || !date || !status) {
      return res.status(400).json({
        message:
          "Subject, date and status are required.",
      });
    }

    // Make sure status is valid
    if (
      !["present", "absent", "cancelled"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be present, absent or cancelled.",
      });
    }

    // Make sure subject belongs to current user
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

    // Normalize date to the beginning of the day
    const attendanceDate = new Date(date);

    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }

    attendanceDate.setHours(0, 0, 0, 0);

    // Create or update existing record
    const attendance =
      await Attendance.findOneAndUpdate(
        {
          user: req.userId,
          subject,
          date: attendanceDate,
        },
        {
          user: req.userId,
          subject,
          date: attendanceDate,
          status,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      ).populate(
        "subject",
        "name code color"
      );

    res.status(200).json({
      message:
        "Attendance marked successfully.",
      attendance,
    });
  } catch (error) {
    console.error(
      "Mark attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to mark attendance.",
      error: error.message,
    });
  }
};

// Get attendance for a particular subject
const getSubjectAttendance = async (
  req,
  res
) => {
  try {
    const { subjectId } = req.params;

    // Verify subject ownership
    const subject =
      await Subject.findOne({
        _id: subjectId,
        user: req.userId,
      });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    const attendance =
      await Attendance.find({
        user: req.userId,
        subject: subjectId,
      }).sort({ date: 1 });

    res.status(200).json({
      subject,
      attendance,
    });
  } catch (error) {
    console.error(
      "Get subject attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch subject attendance.",
      error: error.message,
    });
  }
};

// Get attendance summary for all subjects
const getAttendanceSummary = async (
  req,
  res
) => {
  try {
    const subjects =
      await Subject.find({
        user: req.userId,
      }).sort({ name: 1 });

    const attendance =
      await Attendance.find({
        user: req.userId,
      });

    const summary = subjects.map((subject) => {
      const subjectAttendance =
        attendance.filter(
          (record) =>
            record.subject.toString() ===
            subject._id.toString()
        );

      const present =
        subjectAttendance.filter(
          (record) =>
            record.status === "present"
        ).length;

      const absent =
        subjectAttendance.filter(
          (record) =>
            record.status === "absent"
        ).length;

      const cancelled =
        subjectAttendance.filter(
          (record) =>
            record.status === "cancelled"
        ).length;

      const classesHeld =
        present + absent;

      const percentage =
        classesHeld > 0
          ? Number(
              (
                (present / classesHeld) *
                100
              ).toFixed(1)
            )
          : 0;

      return {
        subject,
        present,
        absent,
        cancelled,
        classesHeld,
        percentage,
      };
    });

    res.status(200).json({
      summary,
    });
  } catch (error) {
    console.error(
      "Get attendance summary error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch attendance summary.",
      error: error.message,
    });
  }
};

// Get a single attendance record
const getAttendance = async (req, res) => {
  try {
    const attendance =
      await Attendance.findOne({
        _id: req.params.id,
        user: req.userId,
      }).populate(
        "subject",
        "name code color"
      );

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found.",
      });
    }

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    console.error(
      "Get attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch attendance.",
      error: error.message,
    });
  }
};

// Delete attendance record
const deleteAttendance = async (
  req,
  res
) => {
  try {
    const attendance =
      await Attendance.findOneAndDelete({
        _id: req.params.id,
        user: req.userId,
      });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found.",
      });
    }

    res.status(200).json({
      message:
        "Attendance record deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete attendance error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete attendance.",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getSubjectAttendance,
  getAttendanceSummary,
  getAttendance,
  deleteAttendance,
};