import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import subjectService from "../../services/subjectService";
import taskService from "../../services/taskService";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [subjectResponse, taskResponse] =
          await Promise.all([
            subjectService.getSubjects(),
            taskService.getTasks(),
          ]);

        setSubjects(subjectResponse.subjects || []);
        setTasks(taskResponse.tasks || []);
      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /*
   * Dashboard statistics
   */
  const statistics = useMemo(() => {
    const pending = tasks.filter(
      (task) => task.status !== "completed"
    );

    const completed = tasks.filter(
      (task) => task.status === "completed"
    );

    const now = new Date();

    const dueSoon = pending.filter((task) => {
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);

      const difference =
        dueDate.getTime() - now.getTime();

      const days =
        difference / (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 7;
    });

    return {
      subjects: subjects.length,
      pending: pending.length,
      dueSoon: dueSoon.length,
      completed: completed.length,
    };
  }, [subjects, tasks]);

  /*
   * Upcoming tasks
   */
  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter(
        (task) =>
          task.status !== "completed" &&
          task.dueDate
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )
      .slice(0, 5);
  }, [tasks]);

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading your academic overview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      {/* Header */}

      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          {getGreeting()}
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {user?.name || "Student"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's your academic overview.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Subjects"
          value={statistics.subjects}
          icon={BookOpen}
        />

        <StatCard
          title="Pending Tasks"
          value={statistics.pending}
          icon={Clock3}
        />

        <StatCard
          title="Due This Week"
          value={statistics.dueSoon}
          icon={AlertCircle}
        />

        <StatCard
          title="Completed Tasks"
          value={statistics.completed}
          icon={CheckCircle2}
        />

      </div>

      {/* Main grid */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Upcoming Tasks */}

        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>
              <h2 className="font-semibold text-slate-900">
                Upcoming Tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your nearest academic deadlines
              </p>
            </div>

            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              View all
              <ArrowRight size={14} />
            </button>

          </div>

          {upcomingTasks.length === 0 ? (
            <div className="px-6 py-14 text-center">

              <CheckCircle2
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-600">
                You're all caught up.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No upcoming tasks.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-800">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.subject?.name ||
                        "No subject"}
                    </p>

                  </div>

                  <div className="flex shrink-0 items-center gap-3">

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-600"
                          : task.priority === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {formatDate(task.dueDate)}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Subjects */}

        <div className="rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>
              <h2 className="font-semibold text-slate-900">
                Your Subjects
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current academic subjects
              </p>
            </div>

            <button
              onClick={() => navigate("/subjects")}
              className="text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              View all
            </button>

          </div>

          {subjects.length === 0 ? (
            <div className="px-6 py-14 text-center">

              <BookOpen
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No subjects added yet.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {subjects.slice(0, 6).map((subject) => (
                <div
                  key={subject._id}
                  className="flex items-center gap-3 px-6 py-4"
                >

                  <div
                    className="h-9 w-9 shrink-0 rounded-lg"
                    style={{
                      backgroundColor:
                        subject.color ||
                        "#4F46E5",
                    }}
                  />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-800">
                      {subject.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {subject.code ||
                        "No course code"}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/*
 * Statistics card
 */

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={19}
            className="text-slate-600"
          />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;