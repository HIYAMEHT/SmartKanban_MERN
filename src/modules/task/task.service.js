const mongoose = require("mongoose");

const Task = require("./task.model");

const Project = require("../project/projectModel");
const User = require("../auth/userModel");

const { badRequest, notFound } = require("../../utils/apiError");

// 1. Create Task
const createTaskService = async (payload) => {
  const {
    title,
    description,
    project,
    assignee,
    status,
    priority,
    estimatedHours,
    skillsRequired,
    deadline,
  } = payload;

  // Check project ID
  if (!mongoose.Types.ObjectId.isValid(project)) {
    throw badRequest("Invalid project ID");
  }

  // Check project exists
  const projectExists = await Project.findById(project);

  if (!projectExists) {
    throw notFound("Project not found");
  }

  // Check assignee if provided
  if (assignee) {
    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      throw badRequest("Invalid assignee ID");
    }

    const userExists = await User.findById(assignee);

    if (!userExists) {
      throw notFound("Assignee user not found");
    }
  }

  const task = await Task.create({
    title,
    description,
    project,
    assignee: assignee || null,
    status,
    priority,
    estimatedHours,
    skillsRequired,
    deadline,
  });

  return task;
};

// 2. Get all tasks of a project
const getProjectTasksService = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw badRequest("Invalid project ID");
  }

  const projectExists = await Project.findById(projectId);

  if (!projectExists) {
    throw notFound("Project not found");
  }

  const tasks = await Task.find({
    project: projectId,
  })
    .populate("assignee", "name email")
    .populate("project", "name")
    .sort({ createdAt: -1 });

  return tasks;
};

// 3. Get single task
const getSingleTaskService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId)
    .populate("assignee", "name email")
    .populate("project", "name");

  if (!task) {
    throw notFound("Task not found");
  }

  return task;
};

// 4. Update task
const updateTaskService = async (taskId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  // Don't allow project to be changed accidentally
  delete payload.project;

  // If changing assignee
  if (payload.assignee) {
    if (!mongoose.Types.ObjectId.isValid(payload.assignee)) {
      throw badRequest("Invalid assignee ID");
    }

    const userExists = await User.findById(payload.assignee);

    if (!userExists) {
      throw notFound("Assignee user not found");
    }
  }

  Object.assign(task, payload);

  await task.save();

  return task;
};

// 5. Update task status
const updateTaskStatusService = async (taskId, status) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const allowedStatus = ["To Do", "In Progress", "Review", "Completed"];

  if (!allowedStatus.includes(status)) {
    throw badRequest("Invalid task status");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  task.status = status;

  await task.save();

  return task;
};

// 6. Assign task
const assignTaskService = async (taskId, assignee) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  if (!mongoose.Types.ObjectId.isValid(assignee)) {
    throw badRequest("Invalid assignee ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  const userExists = await User.findById(assignee);

  if (!userExists) {
    throw notFound("User not found");
  }

  task.assignee = assignee;

  await task.save();

  return task;
};

// 7. Delete task
const deleteTaskService = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw badRequest("Invalid task ID");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  await Task.findByIdAndDelete(taskId);

  return true;
};

module.exports = {
  createTaskService,
  getProjectTasksService,
  getSingleTaskService,
  updateTaskService,
  updateTaskStatusService,
  assignTaskService,
  deleteTaskService,
};
