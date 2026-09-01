const express = require("express");
const {
  getProfile,
  updateProfile,
  getSkills,
  updateSkills,
  getAvailability,
  updateAvailability,
  getUserIntelligence,
} = require("./user.controller");
const {
  validateProfileUpdate,
  validateSkillsUpdate,
  validateAvailabilityUpdate,
} = require("./user.validator");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, validateProfileUpdate, updateProfile);
router.get("/skills", authMiddleware, getSkills);
router.put("/skills", authMiddleware, validateSkillsUpdate, updateSkills);
router.get("/availability", authMiddleware, getAvailability);
router.put(
  "/availability",
  authMiddleware,
  validateAvailabilityUpdate,
  updateAvailability,
);
router.get("/:userId/intelligence", authMiddleware, getUserIntelligence);

module.exports = router;
