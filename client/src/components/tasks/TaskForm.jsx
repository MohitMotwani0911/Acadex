import { useEffect, useState } from "react";
import { X } from "lucide-react";

const defaultForm = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  priority: "medium",
  status: "pending",
};

function TaskForm({
  task,
  subjects,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] =
    useState(defaultForm);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        subject:
          task.subject?._id ||
          task.subject ||
          "",
        dueDate: task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split("T")[0]
          : "",
        priority: task.priority || "medium",
        status: task.status || "pending",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.subject ||
      !formData.dueDate
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description:
          formData.description.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6"
    >

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {task ? "Edit Task" : "Create Task"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {task
              ? "Update your task details."
              : "Add an assignment or academic task."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>

      </div>

      {/* Title */}

      <div className="mb-4">

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Task Title
        </label>

        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Complete DBMS assignment"
          required
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Subject */}

      <div className="mb-4">

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Subject
        </label>

        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">
            Select a subject
          </option>

          {subjects.map((subject) => (
            <option
              key={subject._id}
              value={subject._id}
            >
              {subject.name}
              {subject.code
                ? ` (${subject.code})`
                : ""}
            </option>
          ))}

        </select>

      </div>

      {/* Description */}

      <div className="mb-4">

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Description
          <span className="ml-1 text-xs font-normal text-slate-400">
            (Optional)
          </span>
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Add details about this task..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Date */}

      <div className="mb-4">

        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Due Date
        </label>

        <input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Priority + Status */}

      <div className="mb-6 grid grid-cols-2 gap-4">

        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>
          </select>

        </div>

        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
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

        </div>

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : task
              ? "Save Changes"
              : "Create Task"}
        </button>

      </div>

    </form>
  );
}

export default TaskForm;