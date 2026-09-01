const mongoose = require("mongoose");
const ProjectModel = require("./projectModel");


const createProject = async (data) => {
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
  });

  return project;
};


const getProjects = async () => {
  const projects = await ProjectModel.find()
    .sort({ createdAt: -1 });

  return projects;
};


const getProjectById = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};


const updateProject = async (projectId, data) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (data.name !== undefined) {
    project.name = data.name;
  }

  if (data.description !== undefined) {
    project.description = data.description;
  }

  if (data.deadline !== undefined) {
    const deadlineDate = new Date(data.deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      throw new Error("Invalid deadline");
    }

    project.deadline = deadlineDate;
  }

  await project.save();

  return project;
};


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


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};