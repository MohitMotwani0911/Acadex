import {
  AlertTriangle,
  X,
  Trash2,
} from "lucide-react";

function DeleteSubjectModal({
  subject,
  onConfirm,
  onCancel,
  deleting,
}) {
  if (!subject) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

          <h2 className="text-base font-semibold text-slate-900">
            Delete Subject
          </h2>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>

        </div>

        {/* Content */}

        <div className="px-6 py-6">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle
                size={21}
                className="text-red-500"
              />
            </div>

            <div>

              <h3 className="font-medium text-slate-900">
                Delete "{subject.name}"?
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                This subject will be permanently removed.
                Any academic data associated with it may
                also be affected.
              </p>

            </div>

          </div>

        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />

            {deleting
              ? "Deleting..."
              : "Delete Subject"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteSubjectModal;