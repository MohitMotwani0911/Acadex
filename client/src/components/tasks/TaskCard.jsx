import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const priorityStyles = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  const statusStyles = {
    pending: "bg-slate-100 text-slate-600",
    "in-progress": "bg-blue-50 text-blue-600",
    completed: "bg-emerald-50 text-emerald-600",
  };

  const formatStatus = (status) => {
    if (status === "in-progress") return "In Progress";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const isOverdue =
    task.status !== "completed" &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  const isCompleted =
    task.status === "completed";

  const handleStatusChange = () => {
    if (!onStatusChange) return;

    const newStatus = isCompleted
      ? "pending"
      : "completed";

    onStatusChange(task, newStatus);
  };

  return (
    <div
      className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isCompleted ? "opacity-80" : ""
      }`}
    >

      {/* Top row */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <div className="mb-2 flex flex-wrap items-center gap-2">

            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                priorityStyles[task.priority] ||
                priorityStyles.medium
              }`}
            >
              {task.priority || "medium"}
            </span>

            {task.subject && (
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: `${
                    task.subject.color || "#64748B"
                  }15`,
                  color:
                    task.subject.color || "#64748B",
                }}
              >
                {task.subject.name}
              </span>
            )}

          </div>

          <h3
            className={`truncate text-base font-semibold ${
              isCompleted
                ? "text-slate-500 line-through"
                : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

        </div>

      </div>

      {/* Description */}

      <p className="mt-3 min-h-[42px] text-sm leading-5 text-slate-500">
        {task.description ||
          "No description added."}
      </p>

      {/* Due date */}

      <div className="mt-4 flex items-center gap-2">

        <CalendarDays
          size={16}
          className={
            isOverdue
              ? "text-red-500"
              : "text-slate-400"
          }
        />

        <span
          className={`text-xs font-medium ${
            isOverdue
              ? "text-red-500"
              : "text-slate-500"
          }`}
        >
          {isOverdue
            ? `Overdue · ${formatDate(task.dueDate)}`
            : `Due ${formatDate(task.dueDate)}`}
        </span>

      </div>

      {/* Bottom */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={handleStatusChange}
          title={
            isCompleted
              ? "Mark as pending"
              : "Mark as completed"
          }
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
            statusStyles[task.status] ||
            statusStyles.pending
          } hover:opacity-80`}
        >
          {isCompleted ? (
            <CheckCircle2 size={14} />
          ) : (
            <Clock3 size={14} />
          )}

          {formatStatus(
            task.status || "pending"
          )}
        </button>

        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit task"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task)}
            title="Delete task"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default TaskCard;