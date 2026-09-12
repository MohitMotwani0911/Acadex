import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  X,
} from "lucide-react";

function ExamForm({
  exam = null,
  subjects = [],
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    type: "final",
    examDate: "",
    startTime: "",
    duration: "",
    totalMarks: "",
    location: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || "",
        subject:
          exam.subject?._id ||
          exam.subject ||
          "",
        type: exam.type || "final",
        examDate: exam.examDate
          ? new Date(exam.examDate)
              .toISOString()
              .split("T")[0]
          : "",
        startTime: exam.startTime || "",
        duration: exam.duration || "",
        totalMarks: exam.totalMarks || "",
        location: exam.location || "",
        notes: exam.notes || "",
      });
    }
  }, [exam]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Exam name is required.");
      return;
    }

    if (!formData.subject) {
      setError("Please select a subject.");
      return;
    }

    if (!formData.examDate) {
      setError("Exam date is required.");
      return;
    }

    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }

    if (!formData.duration) {
      setError("Duration is required.");
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...formData,
        duration: Number(formData.duration),
        totalMarks: formData.totalMarks
          ? Number(formData.totalMarks)
          : undefined,
      });
    } catch (error) {
      console.error(
        "Exam form submission error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save exam."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <GraduationCap
              size={21}
              className="text-slate-700"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {exam ? "Edit Exam" : "Add Exam"}
            </h2>

            <p className="text-xs text-slate-500">
              {exam
                ? "Update exam details"
                : "Add an upcoming examination"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={19} />
        </button>
      </div>

      {/* Form body */}

      <div className="space-y-5 px-6 py-6">

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Exam Name */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Exam Name
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Data Structures Mid-Term"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Subject + Type */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Subject
            </label>

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Exam Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="quiz">Quiz</option>
              <option value="midterm">Mid-Term</option>
              <option value="final">Final</option>
              <option value="practical">Practical</option>
              <option value="viva">Viva</option>
              <option value="other">Other</option>
            </select>
          </div>

        </div>

        {/* Date + Time */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <CalendarDays size={15} />
              Exam Date
            </label>

            <input
              type="date"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Clock3 size={15} />
              Start Time
            </label>

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

        </div>

        {/* Duration + Marks */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Duration (minutes)
            </label>

            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 120"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Total Marks
            </label>

            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 100"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

        </div>

        {/* Location */}

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <MapPin size={15} />
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Room 204, Block A"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Notes */}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional information..."
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50"
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
            : exam
            ? "Update Exam"
            : "Create Exam"}
        </button>

      </div>
    </form>
  );
}

export default ExamForm;