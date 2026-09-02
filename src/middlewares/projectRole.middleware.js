const ProjectModel = require("../modules/project/project.model");
const ApiError = require("../utils/apiError");

const authorizeProjectRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // User must be logged in
      if (!req.user) {
        return next(new ApiError(401, "Authentication required"));
      }

      // ADMIN can access any project
      if (req.user.role === "admin") {
        const project = await ProjectModel.findById(
          req.params.projectId
        );

        if (!project) {
          return next(new ApiError(404, "Project not found"));
        }

        req.project = project;
        return next();
      }

      // For non-admin users, check project
      const project = await ProjectModel.findById(
        req.params.projectId
      );

      if (!project) {
        return next(new ApiError(404, "Project not found"));
      }

      const userId = req.user.userId;

      // PROJECT OWNER
      if (
        allowedRoles.includes("owner") &&
        project.owner &&
        project.owner.toString() === userId.toString()
      ) {
        req.project = project;
        return next();
      }

      // PROJECT MEMBER
      const member = project.members.find(
        (member) =>
          member.user &&
          member.user.toString() === userId.toString()
      );

      if (
        member &&
        allowedRoles.includes(member.role)
      ) {
        req.project = project;
        return next();
      }

      // NOT AUTHORIZED
      return next(
        new ApiError(
          403,
          "You are not authorized to perform this action"
        )
      );

    } catch (error) {
      return next(error);
    }
  };
};

module.exports = authorizeProjectRole;