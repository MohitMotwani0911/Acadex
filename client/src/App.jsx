import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Attendance from "./pages/dashboard/Attendance";

import Subjects from "./pages/dashboard/Subjects";
import Tasks from "./pages/dashboard/Tasks";
import Exams from "./pages/dashboard/Exams";
import Schedule from "./pages/dashboard/Schedule";
import Notes from "./pages/dashboard/Notes";
import Analytics from "./pages/dashboard/Analytics";
import AIAssistant from "./pages/dashboard/AIAssistant";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/subjects" element={<Subjects />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
            <Route path="/dashboard/schedule" element={<Schedule />} />
            <Route path="/dashboard/attendance" element={<Attendance />} />
            <Route path="/dashboard/exams" element={<Exams />} />
            <Route path="/dashboard/notes" element={<Notes />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/ai" element={<AIAssistant />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;