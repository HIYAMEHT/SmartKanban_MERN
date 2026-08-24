const express = require("express");

const projectController = require("./project.controller");

const router = express.Router();

// Create project
router.post("/", projectController.createProject);

// Get all projects
router.get("/", projectController.getProjects);

// Get project by ID
router.get("/:projectId", projectController.getProjectById);

// Update project
router.put("/:projectId", projectController.updateProject);

// Delete project
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;