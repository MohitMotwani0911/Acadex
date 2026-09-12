const Subject = require("../models/Subject");
const Task = require("../models/Task");
const Exam = require("../models/Exam");
const Attendance = require("../models/Attendance");
const Note = require("../models/Note");

const getAnalyticsOverview = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch all user data in parallel
    const [subjects, tasks, exams, attendanceRecords, notes] =
      await Promise.all([
        Subject.find({ user: userId }),
        Task.find({ createdBy: userId }),
        Exam.find({ createdBy: userId }),
        Attendance.find({ user: userId }).populate("subject", "name code"),
        Note.find({ user: userId }).populate("subject", "name code"),
      ]);

    const totalSubjects = subjects.length;

    // Attendance
    let totalPresent = 0;
    let totalAbsent = 0;

attendanceRecords.forEach((record) => {
  if (record.status === "present") {
    totalPresent++;
  }

  if (record.status === "absent") {
    totalAbsent++;
  }
});

const totalClasses = totalPresent + totalAbsent;

const attendancePercentage =
  totalClasses > 0
    ? Number(((totalPresent / totalClasses) * 100).toFixed(1))
    : 0;

    // Tasks
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const taskCompletionPercentage =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // Upcoming exams
    const now = new Date();

    const upcomingExams = exams.filter((exam) => {
      return exam.examDate && new Date(exam.examDate) >= now;
    }).length;

    /* =====================================================
       2. ATTENDANCE BY SUBJECT
    ===================================================== */

    /* =====================================================
   2. ATTENDANCE BY SUBJECT
===================================================== */

const attendanceBySubject = subjects.map((subject) => {
  const subjectId = subject._id.toString();

  const subjectRecords = attendanceRecords.filter((record) => {
    if (!record.subject) return false;

    const recordSubjectId = record.subject._id
      ? record.subject._id.toString()
      : record.subject.toString();

    return recordSubjectId === subjectId;
  });

  const present = subjectRecords.filter(
    (record) => record.status === "present"
  ).length;

  const absent = subjectRecords.filter(
    (record) => record.status === "absent"
  ).length;

  const cancelled = subjectRecords.filter(
    (record) => record.status === "cancelled"
  ).length;

  const classesHeld = present + absent;

  const percentage =
    classesHeld > 0
      ? Number(((present / classesHeld) * 100).toFixed(1))
      : 0;

  return {
    subjectId: subject._id,
    subject: subject.name,
    code: subject.code,
    present,
    absent,
    cancelled,
    classesHeld,
    percentage,
  };
});
    const taskStatus = {
      completed: tasks.filter(
        (task) => task.status === "completed"
      ).length,

      inProgress: tasks.filter(
        (task) => task.status === "in-progress"
      ).length,

      pending: tasks.filter(
        (task) => task.status === "pending"
      ).length,
    };


    const taskPriority = {
      high: tasks.filter(
        (task) => task.priority === "high"
      ).length,

      medium: tasks.filter(
        (task) => task.priority === "medium"
      ).length,

      low: tasks.filter(
        (task) => task.priority === "low"
      ).length,
    };



    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      return (
        new Date(task.dueDate) < now &&
        task.status !== "completed"
      );
    }).length;

    const pendingTasks = tasks.filter(
      (task) => task.status === "pending"
    ).length;

    const subjectPerformance = subjects.map((subject) => {
      const subjectTasks = tasks.filter(
        (task) =>
          task.subject &&
          task.subject.toString() === subject._id.toString()
      );

      const subjectNotes = notes.filter(
        (note) =>
          note.subject &&
          note.subject._id.toString() === subject._id.toString()
      );

      const subjectAttendance = attendanceBySubject.find(
        (item) =>
          item.subjectId.toString() === subject._id.toString()
      );

      const subjectExams = exams.filter(
        (exam) =>
          exam.subject &&
          exam.subject.toString() === subject._id.toString() &&
          exam.examDate &&
          new Date(exam.examDate) >= now
      );

      return {
        subjectId: subject._id,
        subject: subject.name,
        code: subject.code,

        attendance: subjectAttendance
          ? subjectAttendance.percentage
          : 0,

        totalTasks: subjectTasks.length,

        completedTasks: subjectTasks.filter(
          (task) => task.status === "completed"
        ).length,

        pendingTasks: subjectTasks.filter(
          (task) => task.status === "pending"
        ).length,

        notes: subjectNotes.length,

        upcomingExams: subjectExams.length,
      };
    });


    const notesBySubject = subjects.map((subject) => {
      const count = notes.filter(
        (note) =>
          note.subject &&
          note.subject._id.toString() === subject._id.toString()
      ).length;

      return {
        subjectId: subject._id,
        subject: subject.name,
        count,
      };
    });

    const subjectsWithNotes = notesBySubject.filter(
      (item) => item.count > 0
    ).length;

    const notesAnalytics = {
      total: notes.length,
      subjectsCovered: subjectsWithNotes,
      bySubject: notesBySubject,
    };

    const attentionRequired = [];

    // Low attendance
    attendanceBySubject.forEach((item) => {
      if (item.classesHeld > 0 && item.percentage < 75) {
        attentionRequired.push({
          type: "attendance",
          severity: "high",
          subject: item.subject,
          message: `${item.subject} attendance is below 75% (${item.percentage}%).`,
        });
      }
    });

    // Overdue tasks
    if (overdueTasks > 0) {
      attentionRequired.push({
        type: "tasks",
        severity: "high",
        message: `You have ${overdueTasks} overdue task${
          overdueTasks > 1 ? "s" : ""
        }.`,
      });
    }

    // Large number of pending tasks
    if (pendingTasks >= 5) {
      attentionRequired.push({
        type: "pending",
        severity: "medium",
        message: `You have ${pendingTasks} pending tasks.`,
      });
    }

    // Upcoming exams within 3 days
    const upcomingSoonExams = exams.filter((exam) => {
      if (!exam.examDate) return false;

      const examDate = new Date(exam.examDate);
      const difference =
        examDate.getTime() - now.getTime();

      const days = difference / (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 3;
    });

    upcomingSoonExams.forEach((exam) => {
      attentionRequired.push({
        type: "exam",
        severity: "high",
        message: `Exam "${exam.title}" is coming up soon.`,
      });
    });

    // Subjects without notes
    notesBySubject.forEach((item) => {
      if (item.count === 0) {
        attentionRequired.push({
          type: "notes",
          severity: "low",
          subject: item.subject,
          message: `${item.subject} has no notes yet.`,
        });
      }
    });


    res.status(200).json({
      success: true,

      summary: {
        totalSubjects,
        attendancePercentage,
        taskCompletionPercentage,
        upcomingExams,
      },

      attendanceBySubject,

      taskStatus,

      taskPriority,

      productivity: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },

      subjectPerformance,

      notes: notesAnalytics,

      attentionRequired,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalyticsOverview,
};