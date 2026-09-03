const apiError = require("../../../utils/apiError");
const { NOT_FOUND } = require("../../../utils/httpStatus");
// const User = require("../auth/auth.model");
// const Project = require("../project/project.model");
const Task = require("../../task/task.model");
// const TimeLog = require("../../timeTracking/timeTracking.model");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

const getDeadlinePrediction = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate("assignee")
    .populate("project");

  if (!task) {
   throw apiError(NOT_FOUND , "Task not found");
  }

  // Task is already completed
  if (task.status === "Completed") {
    return {
      taskId: task._id,
      status: "Completed",
      message: "Task is already completed",
      deadline: task.deadline,
      completedAt: task.completedAt,
    };
  }

  // Task has no assignee
  if (!task.assignee) {
    return {
      taskId: task._id,
      status: "Unassigned",
      message: "Task is not assigned to any member",
      deadline: task.deadline,
      estimatedHours: task.estimatedHours,
    };
  }

  const member = task.assignee;

  // Get all active tasks assigned to this member
  const memberActiveTasks = await Task.find({
    assignee: member._id,
    status: { $in: ACTIVE_STATUSES },
  });

  // Calculate total current workload
  const totalWorkloadHours = memberActiveTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  const capacityHours = member.capacityHours || (member.availability?.hoursPerDay ? member.availability.hoursPerDay * 5 : 40);

  // Daily working capacity
  const dailyHours = member.availability?.hoursPerDay || (capacityHours / 5) || 8;

  // Estimate number of working days needed
  const daysNeeded = totalWorkloadHours / dailyHours;

  // Convert working days to approximate calendar days
  const calendarDaysNeeded = Math.ceil(daysNeeded * 1.4);

  // Calculate predicted completion date
  const predictedCompletionDate = new Date();

  predictedCompletionDate.setDate(
    predictedCompletionDate.getDate() + calendarDaysNeeded
  );

  const deadlineDate = new Date(task.deadline);

  const isAtRisk = predictedCompletionDate > deadlineDate;

  let delayDays = 0;

  if (isAtRisk) {
    delayDays = Math.ceil(
      (predictedCompletionDate - deadlineDate) /
        (1000 * 60 * 60 * 24)
    );
  }

  return {
    taskId: task._id,
    taskTitle: task.title,
    assigneeName: member.name,
    status: isAtRisk ? "At Risk" : "On Track",
    deadline: task.deadline,
    predictedCompletionDate,
    daysNeeded: parseFloat(daysNeeded.toFixed(1)),
    calendarDaysNeeded,
    delayDays,
    totalWorkloadHours,
    assigneeCapacity: capacityHours,
  };
};

module.exports = {
  getDeadlinePrediction,
};