import {
  CheckCircle2,
  XCircle,
  Ban,
  X,
} from "lucide-react";

function AttendanceMarkModal({
  subject,
  date,
  currentStatus,
  onSelect,
  onClose,
  saving = false,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const options = [
    {
      value: "present",
      label: "Present",
      description:
        "I attended this class.",
      icon: CheckCircle2,
      container:
        "border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100",
      iconStyle:
        "bg-emerald-100 text-emerald-600",
      textStyle: "text-emerald-700",
    },
    {
      value: "absent",
      label: "Absent",
      description:
        "I did not attend this class.",
      icon: XCircle,
      container:
        "border-red-200 bg-red-50 hover:border-red-400 hover:bg-red-100",
      iconStyle:
        "bg-red-100 text-red-600",
      textStyle: "text-red-700",
    },
    {
      value: "cancelled",
      label: "Class Cancelled",
      description:
        "The class did not take place.",
      icon: Ban,
      container:
        "border-amber-200 bg-amber-50 hover:border-amber-400 hover:bg-amber-100",
      iconStyle:
        "bg-amber-100 text-amber-600",
      textStyle: "text-amber-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Mark Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {subject?.name || "Subject"}
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {formatDate(date)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>

        </div>

        {/* Options */}

        <div className="space-y-3 p-6">

          {options.map((option) => {
            const Icon = option.icon;

            const isSelected =
              currentStatus === option.value;

            return (
              <button
                type="button"
                key={option.value}
                disabled={saving}
                onClick={() =>
                  onSelect(option.value)
                }
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  option.container
                } ${
                  isSelected
                    ? "ring-2 ring-slate-900 ring-offset-1"
                    : ""
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${option.iconStyle}`}
                >
                  <Icon size={22} />
                </div>

                <div className="min-w-0">

                  <p
                    className={`text-sm font-semibold ${option.textStyle}`}
                  >
                    {option.label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {option.description}
                  </p>

                </div>

              </button>
            );
          })}

        </div>

        {/* Saving */}

        {saving && (
          <div className="border-t border-slate-100 px-6 py-4 text-center text-xs font-medium text-slate-500">
            Saving attendance...
          </div>
        )}

      </div>

    </div>
  );
}

export default AttendanceMarkModal;