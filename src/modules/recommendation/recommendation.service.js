const User = require("../models/user.model");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const { NOT_FOUND, CONFLICT, FORBIDDEN } = require("../../utils/httpStatus");
const apiError = require("../../utils/apiError");

const ACTIVE_STATUSES = ["To Do", "In Progress", "Review"];

// GET /recommendations/task/:taskId
const getTaskRecommendations = async (taskId) => {
  const task = await Task.findById(taskId).populate("project");

  if (!task) {
    throw apiError(NOT_FOUND , "Task not found");
  }

  const project = await Project.findById(task.project._id);

  if (!project) {
     throw apiError(NOT_FOUND , "Project not found");
  }

  const recommendations = [];

  // Evaluate each member of the project
  for (const memberId of project.members) {
    const member = await User.findById(memberId);

    if (!member) continue;

    // Get active tasks of the member
    const activeTasks = await Task.find({
      assignee: member._id,
      status: { $in: ACTIVE_STATUSES },
    });

    const activeHours = activeTasks.reduce(
      (sum, task) => sum + (task.estimatedHours || 0),
      0
    );

    const remainingCapacity =
      member.capacityHours - activeHours;

    const willOverload =
      activeHours + (task.estimatedHours || 0) >
      member.capacityHours;

    // Skill matching
    const requiredSkills = task.skillsRequired || [];

    const matchedSkills = requiredSkills.filter((skill) =>
      (member.skills || []).some(
        (memberSkill) =>
          memberSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const skillMatchCount = matchedSkills.length;

    const skillMatchPercentage =
      requiredSkills.length > 0
        ? Math.round(
            (skillMatchCount / requiredSkills.length) * 100
          )
        : 100;

    // Recommendation score
    let score = 50;

    // Skill match: maximum +50
    score += skillMatchPercentage / 2;

    // Capacity / overload
    if (willOverload) {
      score -= 40;
    } else if (member.capacityHours > 0) {
      const capacityRatio =
        remainingCapacity / member.capacityHours;

      score += Math.round(capacityRatio * 20);
    }

    // Workload balancing
    if (activeHours === 0) {
      score += 15;
    }

    // Suitability
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
        activeHours +
        (task.estimatedHours || 0) -
        member.capacityHours;

      comment =
        `Has required skills (${matchedSkills.join(
          ", "
        )}), but this task will overload them by ${overloadHours}h.`;
    } else if (
      skillMatchCount === requiredSkills.length &&
      remainingCapacity >= (task.estimatedHours || 0)
    ) {
      suitability = "Perfect Match";

      comment =
        `Has all required skills (${matchedSkills.join(
          ", "
        )}) and ample remaining capacity (${remainingCapacity}h available).`;
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


// POST /recommendations/assign-task
const assignTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
     throw apiError(NOT_FOUND , "Task not found");
  }

 
 if (!userId) {
   throw apiError(NOT_FOUND , "UserId is required");
}

  const member = await User.findById(userId);

  if (!member) {
     throw apiError(NOT_FOUND , "Assignee not found");
  }

  // Check project
  const project = await Project.findById(task.project);

  if (!project) {
     throw apiError(NOT_FOUND , "Project not found");
  }

  // IMPORTANT:
  // Do not automatically add the user to the project.
  // The user should already be a project member.
  const isProjectMember = project.members.some(
    (memberId) =>
      memberId.toString() === member._id.toString()
  );

  if (!isProjectMember) {
   throw apiError(FORBIDDEN , "User is not a member of this project");
  }

  // Calculate current workload
  const activeTasks = await Task.find({
    assignee: member._id,
    status: { $in: ACTIVE_STATUSES },
    _id: { $ne: task._id },
  });

  const activeHours = activeTasks.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  const newTotalHours =
    activeHours + (task.estimatedHours || 0);

  const willOverload =
    newTotalHours > member.capacityHours;

  // Assign task
  task.assignee = member._id;

  await task.save();

  return {
    success: true,
    overloaded: willOverload,
    message: willOverload
      ? `Task assigned successfully. Warning: ${member.name} will be overloaded by ${
          newTotalHours - member.capacityHours
        } hours.`
      : `Task assigned successfully to ${member.name}.`,
    task,
  };
};


module.exports = {
  getTaskRecommendations,
  assignTask,
};