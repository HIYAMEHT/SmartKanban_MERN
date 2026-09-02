const User = require("./user.model");
const ApiError = require("../../utils/apiError");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const { name, bio } = data;
  const updateData = {};

  if (name !== undefined) {
    updateData.name = name.trim();
  }

  if (bio !== undefined) {
    updateData.bio = bio.trim();
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const getSkills = async (userId) => {
  const user = await User.findById(userId).select("skills");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { skills: user.skills };
};

const updateSkills = async (userId, skills) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      skills: skills.map((skill) => skill.trim()),
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("skills");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { skills: user.skills };
};

const getAvailability = async (userId) => {
  const user = await User.findById(userId).select("availability");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { availability: user.availability };
};

const updateAvailability = async (userId, data) => {
  const updateData = {};

  if (data.status !== undefined) {
    updateData["availability.status"] = data.status;
  }

  if (data.hoursPerDay !== undefined) {
    updateData["availability.hoursPerDay"] = data.hoursPerDay;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  ).select("availability");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { availability: user.availability };
};

const getUserIntelligence = async (userId) => {
  const user = await User.findById(userId).select("role skills availability");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    userId: user._id,
    role: user.role,
    skills: user.skills,
    availability: user.availability,
  };
};

module.exports = {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getAvailability,
  updateAvailability,
  getUserIntelligence,
};
