import { FileText, BookOpen } from "lucide-react";

const NotesAnalytics = ({ notes = {} }) => {
  const totalNotes = notes.total ?? 0;
  const subjectsCovered = notes.subjectsCovered ?? 0;
  const bySubject = notes.bySubject ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <FileText className="h-5 w-5 text-gray-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Notes Overview
          </h2>

          <p className="text-sm text-gray-500">
            See how your study material is distributed across subjects.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />

            <span className="text-xs font-medium text-gray-500">
              Total Notes
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalNotes}
          </p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />

            <span className="text-xs font-medium text-gray-500">
              Subjects Covered
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {subjectsCovered}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {totalNotes === 0 ? (
        <div className="py-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No notes available
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Upload notes to start tracking your study material.
          </p>
        </div>
      ) : (
        /* Notes by Subject */
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800">
            Notes by Subject
          </h3>

          <div className="mt-4 space-y-5">
            {bySubject.map((item) => {
              const count = item.count ?? 0;

              const percentage =
                totalNotes > 0
                  ? Math.round((count / totalNotes) * 100)
                  : 0;

              return (
                <div key={item.subjectId}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.subject}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {count}
                      </span>

                      <span className="ml-1 text-xs text-gray-500">
                        notes
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-700 transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-gray-500">
                    {percentage}% of all notes
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesAnalytics;