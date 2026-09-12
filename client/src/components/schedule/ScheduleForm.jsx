import { useEffect, useState } from "react";
import { X } from "lucide-react";

function ScheduleForm({
  schedule,
  subjects,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    room: "",
    type: "lecture",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData({
        title: schedule.title || "",
        subject: schedule.subject?._id || schedule.subject || "",
        dayOfWeek: schedule.dayOfWeek || "Monday",
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || "",
        room: schedule.room || "",
        type: schedule.type || "lecture",
        description: schedule.description || "",
      });
    } else {
      setFormData({
        title: "",
        subject: "",
        dayOfWeek: "Monday",
        startTime: "",
        endTime: "",
        room: "",
        type: "lecture",
        description: "",
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {schedule
              ? "Edit Schedule"
              : "Add Schedule"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a class or academic schedule entry.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={19} />
        </button>

      </div>

      {/* Title */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Data Structures"
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">
            Select subject
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

      {/* Day + Type */}

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Day
          </label>

          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="lecture">
              Lecture
            </option>

            <option value="lab">
              Lab
            </option>

            <option value="tutorial">
              Tutorial
            </option>

            <option value="other">
              Other
            </option>
          </select>
        </div>

      </div>

      {/* Time */}

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Start Time
          </label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            End Time
          </label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

      </div>

      {/* Room */}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Room
        </label>

        <input
          type="text"
          name="room"
          value={formData.room}
          onChange={handleChange}
          placeholder="e.g. Lab 2"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Description */}

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Optional notes..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : schedule
            ? "Update Schedule"
            : "Add Schedule"}
        </button>

      </div>

    </form>
  );
}

export default ScheduleForm;