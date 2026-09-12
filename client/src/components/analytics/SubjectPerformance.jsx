import { BookOpen, FileText, ClipboardList, CalendarDays } from "lucide-react";

const SubjectPerformance = ({ subjectPerformance = [] }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <BookOpen className="h-5 w-5 text-gray-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Subject Performance
          </h2>

          <p className="text-sm text-gray-500">
            Get an overview of your progress in each subject.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {subjectPerformance.length === 0 ? (
        <div className="py-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No subjects available
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Create subjects to start tracking your academic performance.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Subject
                </th>

                <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Attendance
                </th>

                <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tasks
                </th>

                <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notes
                </th>

                <th className="pb-3 pl-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Exams
                </th>
              </tr>
            </thead>

            <tbody>
              {subjectPerformance.map((subject) => {
                const attendance = subject.attendance ?? 0;
                const totalTasks = subject.totalTasks ?? 0;
                const completedTasks = subject.completedTasks ?? 0;
                const pendingTasks = subject.pendingTasks ?? 0;
                const notes = subject.notes ?? 0;
                const upcomingExams = subject.upcomingExams ?? 0;

                return (
                  <tr
                    key={subject.subjectId}
                    className="border-b border-gray-50 last:border-0"
                  >
                    {/* Subject */}
                    <td className="py-4 pr-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {subject.subject}
                        </p>

                        {subject.code && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {subject.code}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="px-4 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {attendance}%
                          </span>
                        </div>

                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-700"
                            style={{
                              width: `${Math.min(attendance, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Tasks */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-gray-400" />

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {completedTasks}/{totalTasks}
                          </p>

                          <p className="text-xs text-gray-500">
                            {pendingTasks} pending
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />

                        <span className="text-sm font-medium text-gray-800">
                          {notes}
                        </span>
                      </div>
                    </td>

                    {/* Exams */}
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />

                        <span className="text-sm font-medium text-gray-800">
                          {upcomingExams}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectPerformance;