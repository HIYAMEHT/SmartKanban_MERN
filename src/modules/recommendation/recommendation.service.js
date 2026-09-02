
const User = require("../user/user.model");
const Project = require("../project/project.model");
const Task = require("../task/task.model");

const {
  NOT_FOUND,
  FORBIDDEN,
} = require("../../utils/httpStatus");

const apiError = require("../../utils/apiError");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

// GET /recommend/task/:taskId
const getTaskRecommendations = async (taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw apiError(NOT_FOUND, "Task not found");
  }

  const project = await Project.findById(task.project);

  if (!project) {
    throw apiError(NOT_FOUND, "Project not found");
  }

  const recommendations = [];

  // Evaluate every member of the project
  for (const projectMember of project.members) {
    const member = await User.findById(projectMember.user);

    if (!member) continue;

    // Get member's active tasks
    const activeTasks = await Task.find({
      assignee: member._id,
      status: { $in: ACTIVE_STATUSES },
    });

    const activeHours = activeTasks.reduce(
      (sum, activeTask) =>
        sum + (activeTask.estimatedHours || 0),
      0
    );

    const capacityHours = member.capacityHours || 0;

    const remainingCapacity =
      capacityHours - activeHours;

    const taskHours = task.estimatedHours || 0;

    const newTotalHours =
      activeHours + taskHours;

    const willOverload =
      capacityHours > 0
        ? newTotalHours > capacityHours
        : true;

    // -------------------------
    // Skill matching
    // -------------------------

    const requiredSkills = task.skillsRequired || [];

    const matchedSkills = requiredSkills.filter((skill) =>
      (member.skills || []).some(
        (memberSkill) =>
          memberSkill.toLowerCase() ===
          skill.toLowerCase()
      )
    );

    const skillMatchCount = matchedSkills.length;

    const skillMatchPercentage =
      requiredSkills.length > 0
        ? Math.round(
            (skillMatchCount / requiredSkills.length) * 100
          )
        : 100;

    // -------------------------
    // Recommendation score (0-100)
    // -------------------------

    let score = 0;

    // Skills = 50 points
    score += skillMatchPercentage * 0.5;

    // Capacity = 35 points
    if (!willOverload && capacityHours > 0) {
      const capacityRatio =
        Math.max(0, remainingCapacity) / capacityHours;

      score += Math.round(capacityRatio * 35);
    } else if (willOverload) {
      score -= 30;
    }

    // Workload balancing = 15 points
    if (activeHours === 0) {
      score += 15;
    } else if (
      capacityHours > 0 &&
      activeHours < capacityHours
    ) {
      score += 7;
    }

    // Always keep score between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    // -------------------------
    // Suitability
    // -------------------------

    let suitability = "Good Option";
    let comment = "";

    if (
      requiredSkills.length > 0 &&
      skillMatchCount === 0
    ) {
      suitability = "Not Ideal";

      comment =
        "Lacks required skills, but has available capacity.";
    } else if (willOverload) {
      suitability = "Risk of Overload";

      const overloadHours =
        newTotalHours - capacityHours;

      comment =
        `Has required skills (${matchedSkills.join(
          ", "
        )}), but this task will overload them by ${overloadHours}h.`;
    } else if (
      skillMatchCount === requiredSkills.length &&
      remainingCapacity >= taskHours
    ) {
      suitability = "Perfect Match";

      comment =
        `Has all required skills (${matchedSkills.join(
          ", "
        )}) and ${remainingCapacity}h available capacity.`;
    } else {
      comment =
        `Matches skills (${matchedSkills.join(
          ", "
        )}) with ${remainingCapacity}h available capacity.`;
    }

    recommendations.push({
      member: {
        _id: member._id,
        name: member.name,
        email: member.email,
        role: member.role,
        skills: member.skills,
        capacityHours: member.capacityHours,
      },

      skillMatchCount,
      matchedSkills,
      totalSkillsRequired: requiredSkills.length,
      skillMatchPercentage,

      activeHours,
      remainingCapacity,
      willOverload,

      score,
      suitability,
      comment,
    });
  }

  // Highest score first
  recommendations.sort(
    (a, b) => b.score - a.score
  );

  return {
    task: {
      _id: task._id,
      title: task.title,
      estimatedHours: task.estimatedHours,
      skillsRequired: task.skillsRequired,
      deadline: task.deadline,
      assignee: task.assignee,
    },

    recommendations,
  };
};


// POST /recommend/assign-task
const assignTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw apiError(NOT_FOUND, "Task not found");
  }

  if (!userId) {
    throw apiError(NOT_FOUND, "UserId is required");
  }

  const member = await User.findById(userId);

  if (!member) {
    throw apiError(NOT_FOUND, "Assignee not found");
  }

  // Find task's project
  const project = await Project.findById(task.project);

  if (!project) {
    throw apiError(NOT_FOUND, "Project not found");
  }

  // Check whether user belongs to project
  const isProjectMember = project.members.some(
    (projectMember) =>
      projectMember.user.toString() ===
      member._id.toString()
  );

  if (!isProjectMember) {
    throw apiError(
      FORBIDDEN,
      "User is not a member of this project"
    );
  }

  // Calculate current workload
  const activeTasks = await Task.find({
    assignee: member._id,
    status: { $in: ACTIVE_STATUSES },
    _id: { $ne: task._id },
  });

  const activeHours = activeTasks.reduce(
    (sum, activeTask) =>
      sum + (activeTask.estimatedHours || 0),
    0
  );

  const taskHours = task.estimatedHours || 0;

  const capacityHours = member.capacityHours || 0;

  const newTotalHours =
    activeHours + taskHours;

  const willOverload =
    capacityHours > 0
      ? newTotalHours > capacityHours
      : true;

  // Assign task
  task.assignee = member._id;

  await task.save();

  return {
    overloaded: willOverload,

    message: willOverload
      ? `Task assigned successfully. Warning: ${member.name} will be overloaded by ${
          newTotalHours - capacityHours
        } hours.`
      : `Task assigned successfully to ${member.name}.`,

    task,
  };
};


module.exports = {
  getTaskRecommendations,
  assignTask,
};

