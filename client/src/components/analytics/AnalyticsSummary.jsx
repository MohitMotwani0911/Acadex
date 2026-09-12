import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Percent,
} from "lucide-react";

const AnalyticsSummary = ({ summary }) => {
  const cards = [
    {
      title: "Total Subjects",
      value: summary?.totalSubjects ?? 0,
      description: "Active subjects",
      icon: BookOpen,
    },
    {
      title: "Overall Attendance",
      value: `${summary?.attendancePercentage ?? 0}%`,
      description: "Across all subjects",
      icon: Percent,
    },
    {
      title: "Task Completion",
      value: `${summary?.taskCompletionPercentage ?? 0}%`,
      description: "Tasks completed",
      icon: CheckCircle2,
    },
    {
      title: "Upcoming Exams",
      value: summary?.upcomingExams ?? 0,
      description: "Exams coming up",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {card.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsSummary;