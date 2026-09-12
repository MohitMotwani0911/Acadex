import { AlertTriangle, X } from "lucide-react";

function DeleteScheduleModal({
  schedule,
  onConfirm,
  onCancel,
  deleting,
}) {
  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

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
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Schedule
              </h2>

              <p className="text-sm text-slate-500">
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
            <X size={18} />
          </button>

        </div>

        {/* Message */}

        <div className="mt-5 rounded-lg bg-slate-50 p-4">

          <p className="text-sm text-slate-600">
            Are you sure you want to delete:
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {schedule.title}
          </p>

          {schedule.subject?.name && (
            <p className="mt-1 text-xs text-slate-500">
              {schedule.subject.name}
              {schedule.subject.code
                ? ` (${schedule.subject.code})`
                : ""}
            </p>
          )}

        </div>

        {/* Actions */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting
              ? "Deleting..."
              : "Delete Schedule"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default DeleteScheduleModal;