import {
  CheckCircle2,
  Clock3,
  ListTodo,
  AlertCircle,
} from "lucide-react";

const TaskAnalytics = ({
  taskStatus = {},
  taskPriority = {},
}) => {
  const completed = taskStatus.completed ?? 0;
  const inProgress = taskStatus.inProgress ?? 0;
  const pending = taskStatus.pending ?? 0;

  const high = taskPriority.high ?? 0;
  const medium = taskPriority.medium ?? 0;
  const low = taskPriority.low ?? 0;

  const totalStatusTasks = completed + inProgress + pending;
  const totalPriorityTasks = high + medium + low;

  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  const statusItems = [
    {
      label: "Completed",
      value: completed,
      percentage: getPercentage(completed, totalStatusTasks),
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: inProgress,
      percentage: getPercentage(inProgress, totalStatusTasks),
      icon: Clock3,
    },
    {
      label: "Pending",
      value: pending,
      percentage: getPercentage(pending, totalStatusTasks),
      icon: ListTodo,
    },
  ];

  const priorityItems = [
    {
      label: "High",
      value: high,
      percentage: getPercentage(high, totalPriorityTasks),
    },
    {
      label: "Medium",
      value: medium,
      percentage: getPercentage(medium, totalPriorityTasks),
    },
    {
      label: "Low",
      value: low,
      percentage: getPercentage(low, totalPriorityTasks),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Task Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <CheckCircle2 className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Task Status
            </h2>

            <p className="text-sm text-gray-500">
              Track your task completion progress.
            </p>
          </div>
        </div>

        {totalStatusTasks === 0 ? (
          <div className="py-10 text-center">
            <ListTodo className="mx-auto h-10 w-10 text-gray-400" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No task data available
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Create tasks to see your productivity analytics.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {statusItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-500" />

                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-700 transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-gray-500">
                    {item.percentage}%
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Priority */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
            <AlertCircle className="h-5 w-5 text-gray-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Task Priority
            </h2>

            <p className="text-sm text-gray-500">
              Understand your current workload.
            </p>
          </div>
        </div>

        {totalPriorityTasks === 0 ? (
          <div className="py-10 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No priority data available
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Add tasks with priorities to see the breakdown.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {priorityItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-700 transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-xs text-gray-500">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAnalytics;