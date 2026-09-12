import { useState } from "react";
import {
  Upload,
  FileText,
  X,
} from "lucide-react";

function NoteUploadForm({
  subjects,
  onSubmit,
  onCancel,
  uploading = false,
}) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!subject) {
      setError("Please select a subject.");
      return;
    }

    if (!topic.trim()) {
      setError("Please enter a topic name.");
      return;
    }

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();

    formData.append("subject", subject);
    formData.append("topic", topic.trim());
    formData.append("file", file);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(
        "Failed to upload note:",
        error
      );
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
          <h2 className="text-lg font-semibold text-slate-900">
            Upload Note
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload a PDF and organize it by subject and topic.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={18} />
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Subject */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Subject
        </label>

        <select
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value)
          }
          disabled={uploading}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 disabled:bg-slate-50"
        >
          <option value="">
            Select a subject
          </option>

          {subjects.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
              {item.code
                ? ` (${item.code})`
                : ""}
            </option>
          ))}
        </select>

      </div>

      {/* Topic */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Topic
        </label>

        <input
          type="text"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          placeholder="e.g. Normalization"
          disabled={uploading}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:bg-slate-50"
        />

      </div>

      {/* PDF Upload */}

      <div className="mb-6">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          PDF File
        </label>

        <label
          htmlFor="note-file"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition ${
            file
              ? "border-slate-300 bg-slate-50"
              : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
          } ${
            uploading
              ? "pointer-events-none opacity-60"
              : ""
          }`}
        >

          {file ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FileText
                  size={23}
                  className="text-red-500"
                />
              </div>

              <p className="mt-3 max-w-full truncate text-sm font-medium text-slate-700">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(
                  2
                )}{" "}
                MB
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Click to choose another PDF
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Upload
                  size={22}
                  className="text-slate-500"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                Click to upload a PDF
              </p>

              <p className="mt-1 text-xs text-slate-400">
                PDF files only
              </p>
            </>
          )}

        </label>

        <input
          id="note-file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={17} />

          {uploading
            ? "Uploading..."
            : "Upload Note"}
        </button>

      </div>

    </form>
  );
}

export default NoteUploadForm;