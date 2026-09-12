import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
} from "lucide-react";

const AttentionRequired = ({ attentionRequired = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case "lowAttendance":
        return CalendarDays;

      case "overdueTasks":
      case "pendingTasks":
        return ClipboardList;

      case "upcomingExam":
        return CalendarDays;

      case "noNotes":
        return FileText;

      default:
        return AlertTriangle;
    }
  };

  if (attentionRequired.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <CheckCircle2 className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Attention Required
            </h2>
            <p className="text-sm text-gray-500">
              Important things that may need your attention.
            </p>
          </div>
        </div>

        <div className="py-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            You're all caught up
          </p>

          <p className="mt-1 text-xs text-gray-500">
            No urgent academic issues detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <AlertTriangle className="h-5 w-5 text-gray-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Attention Required
          </h2>

          <p className="text-sm text-gray-500">
            Important things that may need your attention.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {attentionRequired.map((item, index) => {
          const Icon = getIcon(item.type);

          return (
            <div
              key={`${item.type}-${item.subjectId || item.examId || index}`}
              className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                <Icon className="h-4 w-4 text-gray-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.title || "Attention Required"}
                  </h3>

                  {item.count !== undefined && (
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                      {item.count}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-600">
                  {item.message || item.description}
                </p>

                {item.subject && (
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Subject: {item.subject}
                  </p>
                )}

                {item.daysLeft !== undefined && (
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    {item.daysLeft === 0
                      ? "Today"
                      : `${item.daysLeft} day${
                          item.daysLeft === 1 ? "" : "s"
                        } left`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttentionRequired;