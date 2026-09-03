const projectService = require("./project.service");

const asyncHandler = require("../../utils/asyncHandler");

// =====================================================
// CREATE PROJECT
// =====================================================

const createProject = asyncHandler(
  async (req, res) => {
    const userId = req.user.userId;

    const project =
      await projectService.createProject(
        req.body,
        userId
      );

    return res.status(201).json({
      success: true,
      message:
        "Project created successfully",
      data: project,
    });
  }
);

// =====================================================
// GET PROJECTS
// =====================================================

const getProjects = asyncHandler(
  async (req, res) => {

    const userId = req.user.userId;
    const role = req.user.role;

    const projects =
      await projectService.getProjects(
        userId,
        role
      );

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  }
);

// =====================================================
// GET PROJECT BY ID
// =====================================================

const getProjectById = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.getProjectById(
        req.params.projectId
      );

    return res.status(200).json({
      success: true,
      data: project,
    });
  }
);

// =====================================================
// UPDATE PROJECT
// =====================================================

const updateProject = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.updateProject(
        req.params.projectId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: project,
    });
  }
);

// =====================================================
// DELETE PROJECT
// =====================================================

const deleteProject = asyncHandler(
  async (req, res) => {
    await projectService.deleteProject(
      req.params.projectId
    );

    return res.status(200).json({
      success: true,
      message:
        "Project deleted successfully",
    });
  }
);

// =====================================================
// ADD MEMBER
// =====================================================

const addMember = asyncHandler(
  async (req, res) => {
    const memberUserId =
      req.body.userId ||
      req.body.memberUserId;

    const project =
      await projectService.addMember(
        req.params.projectId,
        req.user.userId,
        memberUserId,
        req.body.role
      );

    return res.status(201).json({
      success: true,
      message:
        "Member added successfully",
      data: project,
    });
  }
);

// =====================================================
// GET MEMBERS
// =====================================================

const getProjectMembers =
  asyncHandler(
    async (req, res) => {
      const members =
        await projectService.getProjectMembers(
          req.params.projectId
        );

      return res.status(200).json({
        success: true,
        data: members,
      });
    }
  );

// =====================================================
// REMOVE MEMBER
// =====================================================

const removeMember = asyncHandler(
  async (req, res) => {
    const project =
      await projectService.removeMember(
        req.params.projectId,
        req.params.userId
      );

    return res.status(200).json({
      success: true,
      message:
        "Member removed successfully",
      data: project,
    });
  }
);

// =====================================================
// CHANGE MEMBER ROLE
// =====================================================

const changeMemberRole =
  asyncHandler(
    async (req, res) => {
      const project =
        await projectService.changeMemberRole(
          req.params.projectId,
          req.params.userId,
          req.body.role
        );

      return res.status(200).json({
        success: true,
        message:
          "Member role updated successfully",
        data: project,
      });
    }
  );

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