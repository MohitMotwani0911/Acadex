import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  X,
} from "lucide-react";

import ScheduleCard from "../../components/schedule/ScheduleCard";
import ScheduleForm from "../../components/schedule/ScheduleForm";
import DeleteScheduleModal from "../../components/schedule/DeleteScheduleModal";

import scheduleService from "../../services/scheduleService";
import subjectService from "../../services/subjectService";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState(null);

  const [deletingSchedule, setDeletingSchedule] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [subjectFilter, setSubjectFilter] =
    useState("all");

  const [dayFilter, setDayFilter] =
    useState("all");

  // Fetch schedules and subjects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [scheduleData, subjectData] =
        await Promise.all([
          scheduleService.getSchedules(),
          subjectService.getSubjects(),
        ]);

      setSchedules(
        scheduleData.schedules || []
      );

      setSubjects(
        subjectData.subjects || []
      );
    } catch (error) {
      console.error(
        "Failed to load schedule:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load schedule."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create
  const handleCreate = async (formData) => {
    try {
      setError("");

      const data =
        await scheduleService.createSchedule(
          formData
        );

      setSchedules((prev) => [
        ...prev,
        data.schedule,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create schedule:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create schedule."
      );
    }
  };

  // Update
  const handleUpdate = async (formData) => {
    if (!editingSchedule) return;

    try {
      setError("");

      const data =
        await scheduleService.updateSchedule(
          editingSchedule._id,
          formData
        );

      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule._id ===
          editingSchedule._id
            ? data.schedule
            : schedule
        )
      );

      setEditingSchedule(null);
    } catch (error) {
      console.error(
        "Failed to update schedule:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update schedule."
      );
    }
  };

  // Open delete modal
  const handleDelete = (schedule) => {
    setDeletingSchedule(schedule);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingSchedule) return;

    try {
      setDeleting(true);
      setError("");

      await scheduleService.deleteSchedule(
        deletingSchedule._id
      );

      setSchedules((prev) =>
        prev.filter(
          (schedule) =>
            schedule._id !==
            deletingSchedule._id
        )
      );

      setDeletingSchedule(null);
    } catch (error) {
      console.error(
        "Failed to delete schedule:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete schedule."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return schedules.filter((schedule) => {
      const matchesSearch =
        !query ||
        schedule.title
          ?.toLowerCase()
          .includes(query) ||
        schedule.description
          ?.toLowerCase()
          .includes(query) ||
        schedule.room
          ?.toLowerCase()
          .includes(query) ||
        schedule.subject?.name
          ?.toLowerCase()
          .includes(query);

      const matchesSubject =
        subjectFilter === "all" ||
        schedule.subject?._id ===
          subjectFilter;

      const matchesDay =
        dayFilter === "all" ||
        schedule.dayOfWeek === dayFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDay
      );
    });
  }, [
    schedules,
    searchQuery,
    subjectFilter,
    dayFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    subjectFilter !== "all" ||
    dayFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSubjectFilter("all");
    setDayFilter("all");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Schedule
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize your classes and academic schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingSchedule(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Schedule
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* Search + Filters */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap">

          {/* Search */}

          <div className="flex flex-1 items-center rounded-lg border border-slate-200 px-3">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search schedule..."
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Subject */}

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none lg:min-w-[160px]"
          >
            <option value="all">
              All Subjects
            </option>

            {subjects.map((subject) => (
              <option
                key={subject._id}
                value={subject._id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          {/* Day */}

          <select
            value={dayFilter}
            onChange={(e) =>
              setDayFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none lg:min-w-[150px]"
          >
            <option value="all">
              All Days
            </option>

            <option value="Monday">
              Monday
            </option>

            <option value="Tuesday">
              Tuesday
            </option>

            <option value="Wednesday">
              Wednesday
            </option>

            <option value="Thursday">
              Thursday
            </option>

            <option value="Friday">
              Friday
            </option>

            <option value="Saturday">
              Saturday
            </option>

            <option value="Sunday">
              Sunday
            </option>
          </select>

          {/* Clear */}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Clear
            </button>
          )}

        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">

          <p className="text-sm text-slate-500">
            Loading schedule...
          </p>

        </div>
      )}

      {/* Empty */}

      {!loading &&
        schedules.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <CalendarDays
                size={26}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No schedule yet
            </h2>

            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
              Add your classes and academic schedule
              to keep your week organized.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Schedule
            </button>

          </div>
        )}

      {/* Filtered Empty */}

      {!loading &&
        schedules.length > 0 &&
        filteredSchedules.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">

            <Search
              size={28}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-3 font-semibold text-slate-900">
              No schedule found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

      {/* Schedule Cards */}

      {!loading &&
        filteredSchedules.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredSchedules.map(
              (schedule) => (
                <ScheduleCard
                  key={schedule._id}
                  schedule={schedule}
                  onEdit={(selectedSchedule) => {
                    setEditingSchedule(
                      selectedSchedule
                    );
                    setShowForm(false);
                  }}
                  onDelete={handleDelete}
                />
              )
            )}

          </div>
        )}

      {/* Create / Edit Modal */}

      {(showForm || editingSchedule) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <ScheduleForm
              schedule={editingSchedule}
              subjects={subjects}
              onSubmit={
                editingSchedule
                  ? handleUpdate
                  : handleCreate
              }
              onCancel={closeForm}
            />

          </div>

        </div>
      )}

      {/* Delete Modal */}

      {deletingSchedule && (
        <DeleteScheduleModal
          schedule={deletingSchedule}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeletingSchedule(null)
          }
          deleting={deleting}
        />
      )}

    </div>
  );
}

export default Schedule;