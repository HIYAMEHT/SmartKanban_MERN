const mongoose = require("mongoose");
const ProjectModel = require("./project.model");
const UserModel = require("../auth/user.model");

// ============================
// CREATE PROJECT
// ============================

const createProject = async (data, userId) => {
  const { name, description, deadline } = data;

  if (!name) {
    throw new Error("Project name is required");
  }

  if (!deadline) {
    throw new Error("Project deadline is required");
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    throw new Error("Invalid deadline");
  }

  const project = await ProjectModel.create({
    name,
    description,
    deadline: deadlineDate,
    owner: userId,
    members: [],
  });

  return project;
};

// ============================
// GET PROJECTS
// ============================

const getProjects = async () => {
  const projects = await ProjectModel.find({})
    .populate("owner", "name email role")
    .populate("members.user", "name email role")
    .sort({ createdAt: -1 });

  return projects;
};

// ============================
// GET PROJECT BY ID
// ============================

const getProjectById = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findById(projectId)
    .populate("owner", "name email role")
    .populate("members.user", "name email role");

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// ============================
// UPDATE PROJECT
// ============================

const updateProject = async (projectId, data) => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  project.name = data.name ?? project.name;
  project.description = data.description ?? project.description;
  project.status = data.status ?? project.status;

  if (data.deadline) {
    project.deadline = new Date(data.deadline);
  }

  await project.save();

  return project;
};

// ============================
// DELETE PROJECT
// ============================

const deleteProject = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findByIdAndDelete(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// ============================
// ADD MEMBER
// ============================

const addMember = async (
  projectId,
  userId,
  memberUserId,
  role = "member"
) => {
  if (!memberUserId) {
    throw new Error("Member userId is required");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const user = await UserModel.findById(memberUserId);

  if (!user) {
    throw new Error("User not found");
  }

  const alreadyMember = project.members.some(
    (member) =>
      member.user.toString() === memberUserId.toString()
  );

  if (alreadyMember) {
    throw new Error("User is already a project member");
  }

  if (!["manager", "member"].includes(role)) {
    throw new Error("Invalid project role");
  }

  project.members.push({
    user: memberUserId,
    role: role
  });

  await project.save();

  return project;
};

// ============================
// GET MEMBERS
// ============================

const getProjectMembers = async (projectId) => {
  const project = await ProjectModel.findById(projectId)
    .populate("owner", "name email role")
    .populate("members.user", "name email role");

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    owner: project.owner,
    members: project.members,
  };
};

// ============================
// REMOVE MEMBER
// ============================

const removeMember = async (projectId, memberUserId) => {
  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const memberExists = project.members.some(
    (member) =>
      member.user &&
      member.user.toString() === memberUserId.toString()
  );

  if (!memberExists) {
    throw new Error("User is not a project member");
  }

  project.members = project.members.filter(
    (member) =>
      member.user &&
      member.user.toString() !== memberUserId.toString()
  );

  await project.save();

  return project;
};

// ============================
// CHANGE MEMBER ROLE
// ============================

const changeMemberRole = async (
  projectId,
  memberUserId,
  newRole
) => {
  if (!["manager", "member"].includes(newRole)) {
    throw new Error("Invalid project role");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const member = project.members.find(
    (member) =>
      member.user.toString() === memberUserId.toString()
  );

  if (!member) {
    throw new Error("Project member not found");
  }

  member.role = newRole;

  await project.save();

  return project;
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  getProjectMembers,
  removeMember,
  changeMemberRole,
};