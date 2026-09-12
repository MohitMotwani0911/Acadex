import { AlertTriangle, X } from "lucide-react";

function DeleteExamModal({
  exam,
  onConfirm,
  onCancel,
  deleting,
}) {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle
                size={20}
                className="text-red-500"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Exam
              </h2>

              <p className="text-xs text-slate-500">
                This action cannot be undone.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>

        </div>

        {/* Content */}

        <div className="px-6 py-6">

          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {exam.title}
            </span>
            ?
          </p>

          {exam.subject?.name && (
            <p className="mt-2 text-xs text-slate-400">
              {exam.subject.name}
            </p>
          )}

        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Exam"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteExamModal;