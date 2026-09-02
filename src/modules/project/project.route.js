const express = require("express");

const projectController = require("./project.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const authorizeProjectRole = require("../../middlewares/projectRole.middleware");
const authorizeRole = require("../../middlewares/role.middleware");

const router = express.Router();


// ======================================
// PROJECT APIs
// ======================================

// Create project
// ADMIN + MANAGER can create
router.post(
  "/",
  authMiddleware,
  authorizeRole("admin", "manager"),
  projectController.createProject
);


// Get all projects
// Any authenticated user
router.get(
  "/",
  authMiddleware,
  projectController.getProjects
);


// Get project by ID
// Any authenticated user
router.get(
  "/:projectId",
  authMiddleware,
  projectController.getProjectById
);


// Update project
// Project OWNER or project MANAGER
router.put(
  "/:projectId",
  authMiddleware,
  authorizeProjectRole("owner", "manager"),
  projectController.updateProject
);


// Delete project
// Project OWNER only
router.delete(
  "/:projectId",
  authMiddleware,
  authorizeProjectRole("owner"),
  projectController.deleteProject
);


// ======================================
// TEAM APIs
// ======================================

// Add member
// Project OWNER or project MANAGER
router.post(
  "/:projectId/members",
  authMiddleware,
  authorizeProjectRole("owner", "manager"),
  projectController.addMember
);


// Get members
// OWNER, MANAGER, MEMBER
router.get(
  "/:projectId/members",
  authMiddleware,
  authorizeProjectRole("owner", "manager", "member"),
  projectController.getProjectMembers
);


// Remove member
// Project OWNER or project MANAGER
router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  authorizeProjectRole("owner", "manager"),
  projectController.removeMember
);


// Change member role
// Project OWNER only
router.patch(
  "/:projectId/members/:userId/role",
  authMiddleware,
  authorizeProjectRole("owner"),
  projectController.changeMemberRole
);


module.exports = router;