import {
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

function ExamCard({ exam, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatType = (type) => {
    if (!type) return "Exam";

    return type
      .replace("-", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const isPast =
    exam.examDate &&
    new Date(exam.examDate) < new Date();

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* Top section */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <div className="mb-2 flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {formatType(exam.type)}
            </span>

            {exam.subject && (
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: `${
                    exam.subject.color || "#64748B"
                  }15`,
                  color:
                    exam.subject.color || "#64748B",
                }}
              >
                {exam.subject.name}
              </span>
            )}

          </div>

          <h3 className="truncate text-base font-semibold text-slate-900">
            {exam.title}
          </h3>

          {exam.subject?.code && (
            <p className="mt-1 text-xs text-slate-400">
              {exam.subject.code}
            </p>
          )}

        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <GraduationCap
            size={20}
            className="text-slate-600"
          />
        </div>

      </div>

      {/* Exam details */}

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

        {/* Date */}

        <div className="flex items-center gap-2.5">

          <CalendarDays
            size={16}
            className={
              isPast
                ? "text-red-500"
                : "text-slate-400"
            }
          />

          <span
            className={`text-sm font-medium ${
              isPast
                ? "text-red-500"
                : "text-slate-600"
            }`}
          >
            {isPast
              ? `Past · ${formatDate(exam.examDate)}`
              : formatDate(exam.examDate)}
          </span>

        </div>

        {/* Time + Duration */}

        {exam.startTime && (
          <div className="flex items-center gap-2.5 text-sm text-slate-600">

            <Clock3
              size={16}
              className="text-slate-400"
            />

            <span>
              {exam.startTime}

              {exam.duration && (
                <span className="text-slate-400">
                  {" "}
                  · {exam.duration} min
                </span>
              )}
            </span>

          </div>
        )}

        {/* Location */}

        {exam.location && (
          <div className="flex items-center gap-2.5 text-sm text-slate-600">

            <MapPin
              size={16}
              className="text-slate-400"
            />

            <span className="truncate">
              {exam.location}
            </span>

          </div>
        )}

      </div>

      {/* Marks */}

      {exam.totalMarks && (
        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
          Total Marks: {exam.totalMarks}
        </div>
      )}

      {/* Bottom actions */}

      <div className="mt-5 flex items-center justify-end gap-1 border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={() => onEdit(exam)}
          title="Edit exam"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(exam)}
          title="Delete exam"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  );
}

export default ExamCard;