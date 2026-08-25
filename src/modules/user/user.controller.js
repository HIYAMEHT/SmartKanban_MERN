import * as userService from "./user.service.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.userId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const getSkills = asyncHandler(async (req, res) => {
  const skills = await userService.getSkills(req.user.userId);

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

export const updateSkills = asyncHandler(async (req, res) => {
  const skills = await userService.updateSkills(
    req.user.userId,
    req.body.skills,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills updated successfully"));
});

export const getAvailability = asyncHandler(async (req, res) => {
  const availability = await userService.getAvailability(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, availability, "Availability fetched successfully"),
    );
});

export const updateAvailability = asyncHandler(async (req, res) => {
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

export const getUserIntelligence = asyncHandler(async (req, res) => {
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
