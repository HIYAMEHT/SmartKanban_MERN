import express from "express";

import {
    getProfile,
    updateProfile,
    getSkills,
    updateSkills,
    getAvailability,
    updateAvailability,
    getUserIntelligence
} from "./user.controller.js";

import {
    validateProfileUpdate,
    validateSkillsUpdate,
    validateAvailabilityUpdate
} from "./user.validator.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.patch(
    "/profile",
    authMiddleware,
    validateProfileUpdate,
    updateProfile
);

router.get(
    "/skills",
    authMiddleware,
    getSkills
);

router.put(
    "/skills",
    authMiddleware,
    validateSkillsUpdate,
    updateSkills
);

router.get(
    "/availability",
    authMiddleware,
    getAvailability
);

router.put(
    "/availability",
    authMiddleware,
    validateAvailabilityUpdate,
    updateAvailability
);

router.get(
    "/:userId/intelligence",
    authMiddleware,
    getUserIntelligence
);

export default router;