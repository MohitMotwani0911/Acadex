import {
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";

function NoteCard({ note, onDelete }) {
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(
      1
    )} MB`;
  };

  const fileUrl = note.fileUrl
    ? note.fileUrl.startsWith("http")
      ? note.fileUrl
      : `http://localhost:5001${note.fileUrl}`
    : null;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* Top */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-start gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <FileText
              size={21}
              className="text-red-500"
            />
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-sm font-semibold text-slate-900">
              {note.topic}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {note.fileName}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() => onDelete(note)}
          title="Delete note"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>

      </div>

      {/* Subject */}

      {note.subject && (
        <div className="mt-4">

          <span
            className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              backgroundColor: `${
                note.subject.color || "#64748B"
              }15`,
              color:
                note.subject.color || "#64748B",
            }}
          >
            {note.subject.name}
          </span>

        </div>
      )}

      {/* File information */}

      <div className="mt-4 border-t border-slate-100 pt-4">

        <div className="flex items-center justify-between text-xs text-slate-500">

          <span>
            {formatFileSize(note.fileSize)}
          </span>

          <span>
            {formatDate(note.createdAt)}
          </span>

        </div>

      </div>

      {/* Open PDF */}

      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          <ExternalLink size={15} />
          Open PDF
        </a>
      )}

    </div>
  );
}

export default NoteCard;