import { useEffect, useState } from "react";
import { X } from "lucide-react";

const defaultForm = {
  name: "",
  code: "",
  description: "",
  color: "#4F46E5",
};

function SubjectForm({
  subject,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] =
    useState(defaultForm);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || "",
        code: subject.code || "",
        description: subject.description || "",
        color:
          subject.color || "#4F46E5",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        code: formData.code.trim(),
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
            {subject
              ? "Edit Subject"
              : "Add Subject"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {subject
              ? "Update your subject details."
              : "Add a new subject to your academic workspace."}
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

      {/* Subject Name */}

      <div className="mb-4">

        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Subject Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Database Management Systems"
          required
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Code */}

      <div className="mb-4">

        <label
          htmlFor="code"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Subject Code
          <span className="ml-1 text-xs font-normal text-slate-400">
            (Optional)
          </span>
        </label>

        <input
          id="code"
          name="code"
          type="text"
          value={formData.code}
          onChange={handleChange}
          placeholder="e.g. IT-302"
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm uppercase outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Description */}

      <div className="mb-4">

        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Description
          <span className="ml-1 text-xs font-normal text-slate-400">
            (Optional)
          </span>
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of this subject..."
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />

      </div>

      {/* Color */}

      <div className="mb-6">

        <label
          htmlFor="color"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Subject Color
        </label>

        <div className="flex items-center gap-3">

          <input
            id="color"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            className="h-10 w-14 cursor-pointer rounded border border-slate-200"
          />

          <span className="text-sm text-slate-500">
            {formData.color}
          </span>

        </div>

      </div>

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : subject
              ? "Save Changes"
              : "Create Subject"}
        </button>

      </div>

    </form>
  );
}

export default SubjectForm;