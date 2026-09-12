import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Ban,
} from "lucide-react";

function AttendanceCard({ attendance, onClick }) {
  const percentage = Number(
    attendance?.percentage || 0
  );

  const getPercentageStyle = () => {
    if (percentage >= 75) {
      return "text-emerald-600";
    }

    if (percentage >= 60) {
      return "text-amber-600";
    }

    return "text-red-600";
  };

  const subject = attendance?.subject;

  return (
    <button
      type="button"
      onClick={() => onClick(attendance)}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <h2 className="truncate text-lg font-semibold text-slate-900">
            {subject?.name || "Unknown Subject"}
          </h2>

          {subject?.code && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {subject.code}
            </p>
          )}

        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-slate-900">
          <CalendarCheck
            size={19}
            className="text-slate-500 transition group-hover:text-white"
          />
        </div>

      </div>

      {/* Attendance Percentage */}

      <div className="mt-6 flex items-end justify-between">

        <div>
          <p className="text-xs font-medium text-slate-400">
            Attendance
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${getPercentageStyle()}`}
          >
            {percentage.toFixed(1)}%
          </p>
        </div>

        <p className="text-xs text-slate-400">
          View calendar
        </p>

      </div>

      {/* Progress Bar */}

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-800 transition-all duration-500"
          style={{
            width: `${Math.min(
              Math.max(percentage, 0),
              100
            )}%`,
          }}
        />
      </div>

      {/* Statistics */}

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">

        {/* Present */}

        <div className="text-center">

          <CheckCircle2
            size={16}
            className="mx-auto text-emerald-500"
          />

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {attendance?.present || 0}
          </p>

          <p className="text-[11px] text-slate-400">
            Present
          </p>

        </div>

        {/* Absent */}

        <div className="text-center">

          <XCircle
            size={16}
            className="mx-auto text-red-500"
          />

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {attendance?.absent || 0}
          </p>

          <p className="text-[11px] text-slate-400">
            Absent
          </p>

        </div>

        {/* Cancelled */}

        <div className="text-center">

          <Ban
            size={16}
            className="mx-auto text-amber-500"
          />

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {attendance?.cancelled || 0}
          </p>

          <p className="text-[11px] text-slate-400">
            Cancelled
          </p>

        </div>

      </div>

    </button>
  );
}

export default AttendanceCard;