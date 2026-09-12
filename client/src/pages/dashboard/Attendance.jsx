import { useEffect, useState } from "react";
import { CalendarCheck, ClipboardCheck, RefreshCw, X } from "lucide-react";

import AttendanceCard from "../../components/attendance/AttendanceCard";
import AttendanceCalendar from "../../components/attendance/AttendanceCalender";
import AttendanceMarkModal from "../../components/attendance/AttendanceMarkModal";

import attendanceService from "../../services/attendanceService";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [subjectRecords, setSubjectRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);

  const fetchAttendanceSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await attendanceService.getAttendanceSummary();
      setAttendance(data.summary || []);
    } catch (err) {
      console.error("Failed to load attendance:", err);

      setError(
        err.response?.data?.message || "Unable to load attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectRecords = async (subjectId) => {
    try {
      const data = await attendanceService.getSubjectAttendance(subjectId);

      const records = data.attendance || [];

      setSubjectRecords((prev) => ({
        ...prev,
        [subjectId]: records,
      }));

      return records;
    } catch (err) {
      console.error("Failed to load subject attendance:", err);

      setError(
        err.response?.data?.message || "Unable to load subject attendance."
      );

      return [];
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
  }, []);

  const handleSubjectClick = async (item) => {
    const subject = item?.subject;

    if (!subject?._id) return;

    setSelectedSubject(subject);
    setSelectedDate(null);
    setShowMarkModal(false);

    await fetchSubjectRecords(subject._id);
  };

  const handleCloseCalendar = () => {
    setSelectedSubject(null);
    setSelectedDate(null);
    setShowMarkModal(false);
  };

  const handleDateClick = ({ date }) => {
    setSelectedDate(date);
    setShowMarkModal(true);
  };

  const handleCloseMarkModal = () => {
    if (saving) return;

    setShowMarkModal(false);
    setSelectedDate(null);
  };

  const getCurrentStatus = () => {
    if (!selectedSubject || !selectedDate) {
      return null;
    }

    const records = subjectRecords[selectedSubject._id] || [];
    const record = records.find(
      (item) => item.date?.slice(0, 10) === selectedDate
    );

    return record?.status || null;
  };

  const handleMarkAttendance = async (status) => {
    if (!selectedSubject || !selectedDate) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await attendanceService.markAttendance({
        subject: selectedSubject._id,
        date: selectedDate,
        status,
      });

      await fetchSubjectRecords(selectedSubject._id);
      await fetchAttendanceSummary();

      setShowMarkModal(false);
      setSelectedDate(null);
    } catch (err) {
      console.error("Failed to mark attendance:", err);

      setError(
        err.response?.data?.message || "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your attendance subject by subject.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAttendanceSummary}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <p className="text-sm text-slate-500">Loading attendance...</p>
        </div>
      )}

      {!loading && attendance.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <CalendarCheck size={27} className="text-slate-500" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No attendance records
          </h2>

          <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
            Attendance records will appear here once you mark attendance for your
            subjects.
          </p>
        </div>
      )}

      {!loading && attendance.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {attendance.map((item) => (
            <AttendanceCard
              key={item.subject?._id || item.subject}
              attendance={item}
              onClick={() => handleSubjectClick(item)}
            />
          ))}
        </div>
      )}

      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <AttendanceCalendar
              subject={selectedSubject}
              records={subjectRecords[selectedSubject._id] || []}
              onDateClick={handleDateClick}
              onClose={handleCloseCalendar}
            />
          </div>
        </div>
      )}

      {showMarkModal && selectedSubject && selectedDate && (
        <AttendanceMarkModal
          subject={selectedSubject}
          date={selectedDate}
          currentStatus={getCurrentStatus()}
          onSelect={handleMarkAttendance}
          onClose={handleCloseMarkModal}
          saving={saving}
        />
      )}

      {!loading && attendance.length === 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          <ClipboardCheck size={16} className="text-slate-400" />
          Add subjects to begin tracking attendance.
        </div>
      )}
    </div>
  );
}

export default Attendance;