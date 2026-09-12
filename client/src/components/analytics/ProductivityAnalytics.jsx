import {
  CheckCircle2,
  Clock3,
  ListTodo,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const ProductivityAnalytics = ({ productivity = {} }) => {
  const totalTasks = productivity.totalTasks ?? 0;
  const completedTasks = productivity.completedTasks ?? 0;
  const pendingTasks = productivity.pendingTasks ?? 0;
  const overdueTasks = productivity.overdueTasks ?? 0;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const statistics = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: Clock3,
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <TrendingUp className="h-5 w-5 text-gray-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Productivity & Workload
          </h2>

          <p className="text-sm text-gray-500">
            Understand your current task workload and progress.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />

                <span className="text-xs font-medium text-gray-500">
                  {item.label}
                </span>
              </div>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Completion Progress */}
      {totalTasks === 0 ? (
        <div className="mt-6 rounded-lg bg-gray-50 py-8 text-center">
          <ListTodo className="mx-auto h-9 w-9 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No productivity data available
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Create some tasks to start tracking your productivity.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Overall Completion
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>

            <span className="text-lg font-bold text-gray-900">
              {completionPercentage}%
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-700 transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityAnalytics;