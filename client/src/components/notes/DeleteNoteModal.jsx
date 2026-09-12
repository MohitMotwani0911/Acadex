import { AlertTriangle, X } from "lucide-react";

function DeleteNoteModal({
  note,
  onConfirm,
  onCancel,
  deleting = false,
}) {
  if (!note) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle
                size={20}
                className="text-red-500"
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Delete Note
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>

        </div>

        {/* Message */}

        <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3">

          <p className="text-sm text-slate-600">
            Are you sure you want to delete
            <span className="font-semibold text-slate-900">
              {" "}
              "{note.topic}"
            </span>
            ?
          </p>

          {note.fileName && (
            <p className="mt-1 truncate text-xs text-slate-400">
              {note.fileName}
            </p>
          )}

        </div>

        {/* Buttons */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting
              ? "Deleting..."
              : "Delete Note"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteNoteModal;