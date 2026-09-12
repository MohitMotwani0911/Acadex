const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const examRoutes = require("./routes/examRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const noteRoutes = require("./routes/noteRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.get("/", (req, res) => {
  res.json({
    message: "Acadex API is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Acadex server running on port ${PORT}`);
  });
};

startServer();