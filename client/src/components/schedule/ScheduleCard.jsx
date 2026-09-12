import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}) {
  const typeStyles = {
    lecture: "bg-blue-50 text-blue-600",
    lab: "bg-purple-50 text-purple-600",
    tutorial: "bg-amber-50 text-amber-600",
    other: "bg-slate-100 text-slate-600",
  };

  const formatType = (type) => {
    if (!type) return "Other";

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

      {/* Top */}

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          {/* Type */}

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              typeStyles[schedule.type] ||
              typeStyles.other
            }`}
          >
            {formatType(schedule.type)}
          </span>

          {/* Title */}

          <h3 className="mt-3 truncate text-base font-semibold text-slate-900">
            {schedule.title}
          </h3>

          {/* Subject */}

          {schedule.subject && (
            <span
              className="mt-1 inline-block text-sm font-medium"
              style={{
                color:
                  schedule.subject.color ||
                  "#64748B",
              }}
            >
              {schedule.subject.name}

              {schedule.subject.code && (
                <span className="ml-1 text-xs text-slate-400">
                  ({schedule.subject.code})
                </span>
              )}
            </span>
          )}

        </div>

      </div>

      {/* Details */}

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">

        {/* Day */}

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays
            size={16}
            className="shrink-0 text-slate-400"
          />

          <span>
            {schedule.dayOfWeek}
          </span>
        </div>

        {/* Time */}

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock3
            size={16}
            className="shrink-0 text-slate-400"
          />

          <span>
            {schedule.startTime} –{" "}
            {schedule.endTime}
          </span>
        </div>

        {/* Room */}

        {schedule.room && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin
              size={16}
              className="shrink-0 text-slate-400"
            />

            <span>
              {schedule.room}
            </span>
          </div>
        )}

      </div>

      {/* Description */}

      {schedule.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-5 text-slate-500">
          {schedule.description}
        </p>
      )}

      {/* Bottom actions */}

      <div className="mt-5 flex items-center justify-end gap-1 border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={() => onEdit(schedule)}
          title="Edit schedule"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(schedule)}
          title="Delete schedule"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>

      </div>

    </div>
  );
}

export default ScheduleCard;