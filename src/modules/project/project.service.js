const mongoose = require("mongoose");

const ProjectModel = require("./project.model");
const UserModel = require("../user/user.model");

// =====================================================
// CREATE PROJECT
// =====================================================

const createProject = async (data, userId) => {
  const {
    name,
    description,
    deadline,
  } = data;

  if (!name) {
    throw new Error("Project name is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  let deadlineDate = null;

  if (deadline) {
    deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      throw new Error("Invalid deadline");
    }
  }

  const project = await ProjectModel.create({
    name,
    description: description || "",
    deadline: deadlineDate,
    owner: userId,
    members: [],
  });

  return project;
};


// =====================================================
// GET PROJECTS
// =====================================================

const getProjects = async (userId, role) => {

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  let query;

  // ADMIN → See ALL projects
  if (role === "admin") {
    query = {};
  }

  // MANAGER / USER → See own or member projects
  else {
    query = {
      $or: [
        {
          owner: userId,
        },
        {
          "members.user": userId,
        },
      ],
    };
  }

  const projects = await ProjectModel.find(query)
    .populate(
      "owner",
      "name email role"
    )
    .populate(
      "members.user",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });

  return projects;
};

// =====================================================
// GET PROJECT BY ID
// =====================================================

const getProjectById = async (projectId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project =
    await ProjectModel.findById(projectId)
      .populate(
        "owner",
        "name email role"
      )
      .populate(
        "members.user",
        "name email role"
      );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// =====================================================
// UPDATE PROJECT
// =====================================================

const updateProject = async (
  projectId,
  data
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project =
    await ProjectModel.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (data.name !== undefined) {
    project.name = data.name;
  }

  if (data.description !== undefined) {
    project.description =
      data.description;
  }

  if (data.deadline !== undefined) {
    if (data.deadline === null || data.deadline === "") {
      project.deadline = null;
    } else {
      const deadlineDate =
        new Date(data.deadline);

      if (
        Number.isNaN(
          deadlineDate.getTime()
        )
      ) {
        throw new Error(
          "Invalid deadline"
        );
      }

      project.deadline =
        deadlineDate;
    }
  }

  await project.save();

  return project;
};

// =====================================================
// DELETE PROJECT
// =====================================================

const deleteProject = async (
  projectId
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project =
    await ProjectModel.findByIdAndDelete(
      projectId
    );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// =====================================================
// ADD MEMBER
// =====================================================

const addMember = async (
  projectId,
  userId,
  memberUserId,
  role = "member"
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  if (!mongoose.Types.ObjectId.isValid(memberUserId)) {
    throw new Error("Invalid member user ID");
  }

  const project =
    await ProjectModel.findById(
      projectId
    );

  if (!project) {
    throw new Error("Project not found");
  }

  const user =
    await UserModel.findById(
      memberUserId
    );

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !["manager", "member"].includes(
      role
    )
  ) {
    throw new Error(
      "Invalid project role"
    );
  }

  // Owner should not be added as member
  if (
    project.owner.toString() ===
    memberUserId.toString()
  ) {
    throw new Error(
      "Project owner cannot be added as a member"
    );
  }

  const alreadyMember =
    project.members.some(
      (member) =>
        member.user.toString() ===
        memberUserId.toString()
    );

  if (alreadyMember) {
    throw new Error(
      "User is already a project member"
    );
  }

  project.members.push({
    user: memberUserId,
    role,
  });

  await project.save();

  return project;
};

// =====================================================
// GET PROJECT MEMBERS
// =====================================================

const getProjectMembers = async (
  projectId
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project =
    await ProjectModel.findById(
      projectId
    )
      .populate(
        "owner",
        "name email role"
      )
      .populate(
        "members.user",
        "name email role"
      );

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    owner: project.owner,
    members: project.members,
  };
};

// =====================================================
// REMOVE MEMBER
// =====================================================

const removeMember = async (
  projectId,
  memberUserId
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  if (!mongoose.Types.ObjectId.isValid(memberUserId)) {
    throw new Error("Invalid user ID");
  }

  const project =
    await ProjectModel.findById(
      projectId
    );

  if (!project) {
    throw new Error("Project not found");
  }

  const memberExists =
    project.members.some(
      (member) =>
        member.user &&
        member.user.toString() ===
          memberUserId.toString()
    );

  if (!memberExists) {
    throw new Error(
      "User is not a project member"
    );
  }

  project.members =
    project.members.filter(
      (member) =>
        member.user &&
        member.user.toString() !==
          memberUserId.toString()
    );

  await project.save();

  return project;
};

// =====================================================
// CHANGE MEMBER ROLE
// =====================================================

const changeMemberRole = async (
  projectId,
  memberUserId,
  newRole
) => {
  if (
    !["manager", "member"].includes(
      newRole
    )
  ) {
    throw new Error(
      "Invalid project role"
    );
  }

  const project =
    await ProjectModel.findById(
      projectId
    );

  if (!project) {
    throw new Error("Project not found");
  }

  const member =
    project.members.find(
      (member) =>
        member.user.toString() ===
        memberUserId.toString()
    );

  if (!member) {
    throw new Error(
      "Project member not found"
    );
  }

  member.role = newRole;

  await project.save();

  return project;
};

// =====================================================
// EXPORT
// =====================================================

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