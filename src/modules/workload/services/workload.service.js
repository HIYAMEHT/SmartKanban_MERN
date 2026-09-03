const apiError = require("../../../utils/apiError");
const { NOT_FOUND } = require("../../../utils/httpStatus");
const User = require("../../user/user.model");
 const Project = require("../../project/project.model");
const Task = require("../../task/task.model");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

const getCap = (m) => m.capacityHours || (m.availability?.hoursPerDay ? m.availability.hoursPerDay * 5 : 40);

// Get workload of all members in a project
const getProjectWorkload = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw apiError(NOT_FOUND , "Project not found");
  }

  const membersWorkload = [];

  for (const projectMember of project.members) {
    const member = await User.findById(projectMember.user).select("-password -refreshToken -refreshTokenExpiresAt");

    if (!member) continue;

    const activeTasks = await Task.find({
      project: projectId,
      assignee: projectMember.user,
      status: { $in: ACTIVE_STATUSES },
    });

    const activeHours = activeTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    const activeTasksCount = activeTasks.length;
    const capacityHours = getCap(member);
    const overloaded = activeHours > capacityHours;

    membersWorkload.push({
      member,
      activeTasksCount,
      activeHours,
      capacityHours,
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

  const capacityHours = getCap(member);
  const overloaded = activeHours > capacityHours;

  return {
    member,
    activeTasksCount: activeTasks.length,
    activeHours,
    capacityHours,
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

    const capacityHours = getCap(member);

    if (activeHours > capacityHours) {
      overloadedMembers.push({
        member,
        activeHours,
        capacityHours,
        overloadDelta: activeHours - capacityHours,
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