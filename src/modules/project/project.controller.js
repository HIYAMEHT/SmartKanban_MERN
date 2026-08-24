const projectService = require("./project.service");

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(
      req.params.projectId
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(
      req.params.projectId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(
      req.params.projectId
    );

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};