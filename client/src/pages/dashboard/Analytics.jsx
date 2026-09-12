import { useEffect, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";

import analyticsService from "../../services/analyticsService";

import AnalyticsSummary from "../../components/analytics/AnalyticsSummary";
import AttendanceAnalytics from "../../components/analytics/AttendanceAnalytics";
import TaskAnalytics from "../../components/analytics/TaskAnalytics";
import ProductivityAnalytics from "../../components/analytics/ProductivityAnalytics";
import SubjectPerformance from "../../components/analytics/SubjectPerformance";
import NotesAnalytics from "../../components/analytics/NotesAnalytics";
import AttentionRequired from "../../components/analytics/AttentionRequired";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await analyticsService.getAnalyticsOverview();

      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <BarChart3 className="h-6 w-6 text-gray-500" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Unable to load analytics
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const {
    summary,
    attendanceBySubject,
    taskStatus,
    taskPriority,
    productivity,
    subjectPerformance,
    notes,
    attentionRequired,
  } = analytics;

  return (
    <div className="space-y-6 px-6 pt-4">
      {/* Header */}
     <div className="px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your academic performance and productivity.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <AnalyticsSummary summary={summary} />

      {/* Attention Required */}
      <AttentionRequired
        attentionRequired={attentionRequired}
      />

      {/* Attendance */}
      <AttendanceAnalytics
        attendanceBySubject={attendanceBySubject}
      />

      {/* Tasks */}
      <TaskAnalytics
        taskStatus={taskStatus}
        taskPriority={taskPriority}
      />

      {/* Productivity */}
      <ProductivityAnalytics
        productivity={productivity}
      />

      {/* Subject Performance */}
      <SubjectPerformance
        subjectPerformance={subjectPerformance}
      />

      {/* Notes */}
      <NotesAnalytics notes={notes} />
    </div>
  );
};

export default Analytics;