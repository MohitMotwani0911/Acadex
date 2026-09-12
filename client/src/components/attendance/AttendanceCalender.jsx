import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Minus,
  CalendarDays,
} from "lucide-react";
import { useMemo, useState } from "react";

function AttendanceCalendar({
  subject,
  records = [],
  onDateClick,
  onClose,
}) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

  const [selectedDate, setSelectedDate] =
    useState(null);

  /*
   * Convert attendance records into a map:
   *
   * {
   *   "2026-08-21": "present",
   *   "2026-08-22": "absent",
   *   "2026-08-23": "cancelled"
   * }
   */
  const attendanceMap = useMemo(() => {
    const map = {};

    records.forEach((record) => {
      if (!record.date) return;

      const date = new Date(record.date);

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(
          2,
          "0"
        ),
        String(date.getDate()).padStart(
          2,
          "0"
        ),
      ].join("-");

      map[key] = record.status;
    });

    return map;
  }, [records]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName =
    currentMonth.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  /*
   * First day of month.
   *
   * JS:
   * Sunday = 0
   * Monday = 1
   * ...
   */
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  // Empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  const formatDateKey = (day) => {
    return [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");
  };

  const isToday = (day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) {
      return false;
    }

    return (
      selectedDate ===
      formatDateKey(day)
    );
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const dateKey = formatDateKey(day);

    setSelectedDate(dateKey);

    if (onDateClick) {
      onDateClick({
        date: dateKey,
        status:
          attendanceMap[dateKey] || null,
      });
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );

    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );

    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(
      [
        today.getFullYear(),
        String(
          today.getMonth() + 1
        ).padStart(2, "0"),
        String(today.getDate()).padStart(
          2,
          "0"
        ),
      ].join("-")
    );
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "present":
        return {
          container:
            "bg-emerald-50 border-emerald-200 text-emerald-700",
          icon: "text-emerald-600",
        };

      case "absent":
        return {
          container:
            "bg-red-50 border-red-200 text-red-700",
          icon: "text-red-600",
        };

      case "cancelled":
        return {
          container:
            "bg-amber-50 border-amber-200 text-amber-700",
          icon: "text-amber-600",
        };

      default:
        return {
          container:
            "bg-white border-slate-200 text-slate-700",
          icon: "text-slate-400",
        };
    }
  };

  const renderStatusIcon = (status) => {
    if (status === "present") {
      return <Check size={14} />;
    }

    if (status === "absent") {
      return <X size={14} />;
    }

    if (status === "cancelled") {
      return <Minus size={14} />;
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <CalendarDays
              size={20}
              className="text-slate-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              {subject?.name ||
                "Attendance Calendar"}
            </h2>

            {subject?.code && (
              <p className="text-xs text-slate-400">
                {subject.code}
              </p>
            )}
          </div>

        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            title="Close calendar"
          >
            <X size={18} />
          </button>
        )}

      </div>

      {/* Calendar controls */}

      <div className="flex items-center justify-between px-5 py-4">

        <button
          type="button"
          onClick={goToPreviousMonth}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          title="Previous month"
        >
          <ChevronLeft size={19} />
        </button>

        <div className="flex items-center gap-3">

          <h3 className="text-base font-semibold text-slate-900">
            {monthName}
          </h3>

          <button
            type="button"
            onClick={goToToday}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Today
          </button>

        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          title="Next month"
        >
          <ChevronRight size={19} />
        </button>

      </div>

      {/* Weekdays */}

      <div className="grid grid-cols-7 border-y border-slate-100 bg-slate-50">

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-slate-400"
          >
            {day}
          </div>
        ))}

      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 gap-px bg-slate-100">

        {calendarDays.map(
          (day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[72px] bg-white"
                />
              );
            }

            const dateKey =
              formatDateKey(day);

            const status =
              attendanceMap[dateKey];

            const statusStyles =
              getStatusStyles(status);

            const todayDate =
              isToday(day);

            const selected =
              isSelected(day);

            return (
              <button
                type="button"
                key={dateKey}
                onClick={() =>
                  handleDateClick(day)
                }
                className={`relative min-h-[72px] bg-white p-2 text-left transition hover:bg-slate-50 ${
                  selected
                    ? "ring-2 ring-inset ring-slate-900"
                    : ""
                }`}
              >

                {/* Date */}

                <div className="flex items-start justify-between">

                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                      todayDate
                        ? "bg-slate-900 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {day}
                  </span>

                  {/* Status icon */}

                  {status && (
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${statusStyles.container} ${statusStyles.icon}`}
                    >
                      {renderStatusIcon(
                        status
                      )}
                    </span>
                  )}

                </div>

                {/* Status label */}

                {status && (
                  <div
                    className={`mt-2 hidden rounded-md border px-1.5 py-1 text-[10px] font-medium sm:block ${statusStyles.container}`}
                  >
                    {status ===
                      "present" &&
                      "Present"}

                    {status ===
                      "absent" &&
                      "Absent"}

                    {status ===
                      "cancelled" &&
                      "Cancelled"}
                  </div>
                )}

              </button>
            );
          }
        )}

      </div>

      {/* Legend */}

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 px-5 py-4">

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={13} />
          </span>
          Present
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600">
            <X size={13} />
          </span>
          Absent
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Minus size={13} />
          </span>
          Cancelled
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-6 w-6 rounded-full bg-slate-900" />
          Today
        </div>

      </div>

    </div>
  );
}

export default AttendanceCalendar;