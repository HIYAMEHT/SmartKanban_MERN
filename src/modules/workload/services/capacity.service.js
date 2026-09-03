const User = require("../../user/user.model");
// const Project = require("../project/project.model");
const Task = require("../../task/task.model");
const TimeLog = require("../../timeTracking/timeTracking.model");
const apiError = require("../../../utils/apiError");
const { NOT_FOUND } = require("../../../utils/httpStatus");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

const getMemberCapacity = async (userId) => {
  const member = await User.findById(userId);

  if (!member) {
   throw apiError(NOT_FOUND , "assignee not found");
  }

  // Current active workload
  const activeTasks = await Task.find({
    assignee: userId,
    status: { $in: ACTIVE_STATUSES },
  });

  const currentLoadHours = activeTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  // Completed tasks
  const completedTasks = await Task.find({
    assignee: userId,
    status: "Completed",
  });

  const completedTasksCount = completedTasks.length;

  // Actual working time from TimeLog
  const timeLogs = await TimeLog.find({
    user: userId,
  });

  const totalActualSeconds = timeLogs.reduce(
    (sum, timeLog) => sum + (timeLog.durationSeconds || 0),
    0
  );

  const totalActualHours = totalActualSeconds / 3600;

  // Total estimated hours of completed tasks
  const totalEstimatedHours = completedTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  let averageActualHours = 0;
  let averageEstimatedHours = 0;
  let velocityRatio = 1.0;

  if (completedTasksCount > 0) {
    averageActualHours = parseFloat(
      (totalActualHours / completedTasksCount).toFixed(1)
    );

    averageEstimatedHours = parseFloat(
      (totalEstimatedHours / completedTasksCount).toFixed(1)
    );

    if (totalEstimatedHours > 0) {
      velocityRatio = parseFloat(
        (totalActualHours / totalEstimatedHours).toFixed(2)
      );
    }
  }

  const capacityHours = member.capacityHours || (member.availability?.hoursPerDay ? member.availability.hoursPerDay * 5 : 40);

  const loadPercentage =
    capacityHours > 0
      ? parseFloat(
          ((currentLoadHours / capacityHours) * 100).toFixed(1)
        )
      : 0;

  return {
    member,
    capacityHours,
    currentLoadHours,
    loadPercentage,
    completedTasksCount,
    totalActualHours: parseFloat(totalActualHours.toFixed(1)),
    averageActualHours,
    averageEstimatedHours,
    velocityRatio,
    status:
      currentLoadHours > capacityHours
        ? "Overloaded"
        : "Optimal",
  };
};

module.exports = {
  getMemberCapacity,
};