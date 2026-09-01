const userService = require("./user.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const getSkills = asyncHandler(async (req, res) => {
  const skills = await userService.getSkills(req.user.userId);
  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

const updateSkills = asyncHandler(async (req, res) => {
  const skills = await userService.updateSkills(
    req.user.userId,
    req.body.skills,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills updated successfully"));
});

const getAvailability = asyncHandler(async (req, res) => {
  const availability = await userService.getAvailability(req.user.userId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, availability, "Availability fetched successfully"),
    );
});

const updateAvailability = asyncHandler(async (req, res) => {
  const availability = await userService.updateAvailability(
    req.user.userId,
    req.body,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, availability, "Availability updated successfully"),
    );
});

const getUserIntelligence = asyncHandler(async (req, res) => {
  const intelligence = await userService.getUserIntelligence(req.params.userId);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        intelligence,
        "User intelligence fetched successfully",
      ),
    );
});

module.exports = {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getAvailability,
  updateAvailability,
  getUserIntelligence,
};
