import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  X,
} from "lucide-react";

import TaskCard from "../../components/tasks/TaskCard";
import TaskForm from "../../components/tasks/TaskForm";
import DeleteTaskModal from "../../components/tasks/DeleteTaskModal";

import taskService from "../../services/taskService";
import subjectService from "../../services/subjectService";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] =
    useState(null);

  const [deletingTask, setDeletingTask] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  // NEW: Subject filter
  const [subjectFilter, setSubjectFilter] =
    useState("all");

  // Fetch tasks and subjects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [taskData, subjectData] =
        await Promise.all([
          taskService.getTasks(),
          subjectService.getSubjects(),
        ]);

      setTasks(taskData.tasks || []);
      setSubjects(subjectData.subjects || []);
    } catch (error) {
      console.error(
        "Failed to load tasks:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load tasks."
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
        await taskService.createTask(formData);

      setTasks((prev) => [
        data.task,
        ...prev,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create task."
      );
    }
  };

  // Update
  const handleUpdate = async (formData) => {
    if (!editingTask) return;

    try {
      setError("");

      const data =
        await taskService.updateTask(
          editingTask._id,
          formData
        );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === editingTask._id
            ? data.task
            : task
        )
      );

      setEditingTask(null);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update task."
      );
    }
  };

  // Quick status change
const handleStatusChange = async (
  task,
  newStatus
) => {
  try {
    setError("");

    const data =
      await taskService.updateTask(
        task._id,
        {
          title: task.title,
          description: task.description,
          subject: task.subject?._id,
          dueDate: task.dueDate,
          priority: task.priority,
          status: newStatus,
        }
      );

    setTasks((prev) =>
      prev.map((currentTask) =>
        currentTask._id === task._id
          ? data.task
          : currentTask
      )
    );
  } catch (error) {
    console.error(
      "Failed to update task status:",
      error
    );

    setError(
      error.response?.data?.message ||
        "Unable to update task status."
    );
  }
};

  // Open delete modal
  const handleDelete = (task) => {
    setDeletingTask(task);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingTask) return;

    try {
      setDeleting(true);
      setError("");

      await taskService.deleteTask(
        deletingTask._id
      );

      setTasks((prev) =>
        prev.filter(
          (task) =>
            task._id !== deletingTask._id
        )
      );

      setDeletingTask(null);
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete task."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title
          ?.toLowerCase()
          .includes(query) ||
        task.description
          ?.toLowerCase()
          .includes(query) ||
        task.subject?.name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      // NEW: Match selected subject
      const matchesSubject =
        subjectFilter === "all" ||
        task.subject?._id === subjectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesSubject
      );
    });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    subjectFilter,
  ]);

  // NEW: Check whether any filter is active
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    subjectFilter !== "all";

  // NEW: Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSubjectFilter("all");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage assignments, deadlines and academic work.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Task
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
              placeholder="Search tasks..."
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none lg:min-w-[150px]"
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          {/* Subject */}

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none lg:min-w-[150px]"
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

          {/* Priority */}

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none lg:min-w-[150px]"
          >
            <option value="all">
              All Priorities
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>

          {/* Clear Filters */}

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
            Loading tasks...
          </p>

        </div>
      )}

      {/* Empty */}

      {!loading && tasks.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <CheckSquare
              size={26}
              className="text-slate-500"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No tasks yet
          </h2>

          <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
            Create your first task to start managing
            your academic workload.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={17} />
            Add Task
          </button>

        </div>
      )}

      {/* Filtered Empty */}

      {!loading &&
        tasks.length > 0 &&
        filteredTasks.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">

            <Search
              size={28}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-3 font-semibold text-slate-900">
              No tasks found
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

      {/* Task Grid */}

      {!loading &&
        filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(selectedTask) => {
                  setEditingTask(selectedTask);
      setShowForm(false);
    }}
    onDelete={handleDelete}
    onStatusChange={handleStatusChange}
  />
))}
            

          </div>
        )}

      {/* Create / Edit Modal */}

      {(showForm || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <TaskForm
              task={editingTask}
              subjects={subjects}
              onSubmit={
                editingTask
                  ? handleUpdate
                  : handleCreate
              }
              onCancel={closeForm}
            />

          </div>

        </div>
      )}

      {/* Delete Modal */}

      {deletingTask && (
        <DeleteTaskModal
          task={deletingTask}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeletingTask(null)
          }
          deleting={deleting}
        />
      )}

    </div>
  );
}

export default Tasks;