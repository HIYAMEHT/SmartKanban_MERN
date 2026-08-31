const apiError = require("../../../utils/apiError");
const { NOT_FOUND } = require("../../../utils/httpStatus");
const User = require("../models/user.model");
const Project = require("../project/models/project.model");
const Task = require("../task/models/task.model");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

// Get workload of all members in a project
const getProjectWorkload = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw apiError(NOT_FOUND , "Project not found");
  }

  const membersWorkload = [];

  for (const memberId of project.members) {
    const member = await User.findById(memberId);

    if (!member) continue;

    const activeTasks = await Task.find({
      project: projectId,
      assignee: memberId,
      status: { $in: ACTIVE_STATUSES },
    });

    const activeHours = activeTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    const activeTasksCount = activeTasks.length;

    const overloaded = activeHours > member.capacityHours;

    membersWorkload.push({
      member,
      activeTasksCount,
      activeHours,
      overloaded,
      tasks: activeTasks,
    });
  }

  const unassignedTasks = await Task.find({
    project: projectId,
    assignee: null,
    status: { $in: ACTIVE_STATUSES },
  });

  return {
    project: {
      _id: project._id,
      name: project.name,
      description: project.description,
    },
    membersWorkload,
    unassignedTasks,
    unassignedTasksCount: unassignedTasks.length,
  };
};

// Get workload of a specific member
const getMemberWorkload = async (userId) => {
  const member = await User.findById(userId);

  if (!member) {
   throw apiError(NOT_FOUND , "Assignee not found");
  }

  const activeTasks = await Task.find({
    assignee: userId,
    status: { $in: ACTIVE_STATUSES },
  }).populate("project", "name");

  const activeHours = activeTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  const overloaded = activeHours > member.capacityHours;

  return {
    member,
    activeTasksCount: activeTasks.length,
    activeHours,
    overloaded,
    tasks: activeTasks,
  };
};

// Get all overloaded members
const getOverloadedMembers = async () => {
  const users = await User.find();

  const overloadedMembers = [];

  for (const member of users) {
    const activeTasks = await Task.find({
      assignee: member._id,
      status: { $in: ACTIVE_STATUSES },
    });

    const activeHours = activeTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    if (activeHours > member.capacityHours) {
      overloadedMembers.push({
        member,
        activeHours,
        capacityHours: member.capacityHours,
        overloadDelta: activeHours - member.capacityHours,
        activeTasksCount: activeTasks.length,
      });
    }
  }

  return overloadedMembers;
};

module.exports = {
  getProjectWorkload,
  getMemberWorkload,
  getOverloadedMembers,
};