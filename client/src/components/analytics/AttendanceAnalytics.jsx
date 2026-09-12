import { CalendarCheck2 } from "lucide-react";

const AttendanceAnalytics = ({ attendanceBySubject = [] }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <CalendarCheck2 className="h-5 w-5 text-gray-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance by Subject
          </h2>

          <p className="text-sm text-gray-500">
            Monitor your attendance across all subjects.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {attendanceBySubject.length === 0 ? (
        <div className="py-10 text-center">
          <CalendarCheck2 className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No attendance data available
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Mark attendance to see your subject-wise analytics.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {attendanceBySubject.map((item) => {
            const percentage = item.percentage ?? 0;

            return (
              <div key={item.subjectId}>
                {/* Subject information */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.subject}
                    </h3>

                    {item.code && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.code}
                      </p>
                    )}
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>

                {/* Statistics */}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                  <span>
                    Present:{" "}
                    <span className="font-medium text-gray-700">
                      {item.present ?? 0}
                    </span>
                  </span>

                  <span>
                    Absent:{" "}
                    <span className="font-medium text-gray-700">
                      {item.absent ?? 0}
                    </span>
                  </span>

                  <span>
                    Cancelled:{" "}
                    <span className="font-medium text-gray-700">
                      {item.cancelled ?? 0}
                    </span>
                  </span>

                  <span>
                    Classes Held:{" "}
                    <span className="font-medium text-gray-700">
                      {item.classesHeld ?? 0}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceAnalytics;