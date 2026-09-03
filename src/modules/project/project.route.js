const express = require("express");

const projectController =
  require("./project.controller");

const authMiddleware =
  require("../../middlewares/auth.middleware");

const authorizeProjectRole =
  require("../../middlewares/projectRole.middleware");

const authorizeRole =
  require("../../middlewares/role.middleware");

const router = express.Router();

// =====================================================
// PROJECT APIs
// =====================================================

// CREATE PROJECT
router.post(
  "/",
  authMiddleware,
  authorizeRole("admin", "manager", "projectManager"),
  projectController.createProject
);

// GET PROJECTS
router.get(
  "/",
  authMiddleware,
  projectController.getProjects
);

// GET SINGLE PROJECT
router.get(
  "/:projectId",
  authMiddleware,
  projectController.getProjectById
);

// UPDATE PROJECT
router.put(
  "/:projectId",
  authMiddleware,
  authorizeProjectRole(
    "owner",
    "manager"
  ),
  projectController.updateProject
);

// DELETE PROJECT
router.delete(
  "/:projectId",
  authMiddleware,
  authorizeProjectRole("owner"),
  projectController.deleteProject
);

// =====================================================
// TEAM APIs
// =====================================================

// ADD MEMBER
router.post(
  "/:projectId/members",
  authMiddleware,
  authorizeProjectRole(
    "owner",
    "manager"
  ),
  projectController.addMember
);

// GET MEMBERS
router.get(
  "/:projectId/members",
  authMiddleware,
  authorizeProjectRole(
    "owner",
    "manager",
    "member"
  ),
  projectController.getProjectMembers
);

// REMOVE MEMBER
router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  authorizeProjectRole(
    "owner",
    "manager"
  ),
  projectController.removeMember
);

// CHANGE ROLE
router.patch(
  "/:projectId/members/:userId/role",
  authMiddleware,
  authorizeProjectRole("owner"),
  projectController.changeMemberRole
);

module.exports = router;